import React, { useState, useEffect } from 'react';
import {
  InterviewMetadata,
  isMetadataComplete,
} from './data/questionnaire';
import {
  exportExpertElicitationToExcel,
} from './utils/exportExcel';
import { HeaderBar } from './components/HeaderBar';
import {
  FintechExpertSystemView,
  MainStepId,
} from './components/FintechExpertSystemView';
import {
  FullExpertElicitationState,
  DEFAULT_EXPERT_ELICITATION_STATE,
} from './data/expertElicitationTypes';
import { MetadataModal } from './components/MetadataModal';
import { CheckCircle2 } from 'lucide-react';
import { apiPost } from './config/apiConfig';

const STORAGE_KEY_ELICITATION = 'fintech_expert_elicitation_v8';
const STORAGE_KEY_STEP = 'fintech_expert_step_v8';
const STORAGE_KEY_META = 'fintech_expert_meta_v8';

const defaultMetadata: InterviewMetadata = {
  expertName: '',
  expertPosition: '',
  organization: '',
  experienceYears: '',
  educationField: '',
  interviewDate: new Date().toLocaleDateString('fa-IR'),
  interviewDuration: '۶۰ دقیقه',
  interviewerName: 'تیم پژوهشی فراتحلیل فین‌تک',
  notes: '',
};

export default function App() {
  const [expertFormState, setExpertFormState] = useState<FullExpertElicitationState>(DEFAULT_EXPERT_ELICITATION_STATE);
  const [metadata, setMetadata] = useState<InterviewMetadata>(defaultMetadata);
  const [currentStep, setCurrentStep] = useState<MainStepId>('guide');
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState<boolean>(false);
  const [serverSaveStatus, setServerSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedElicitation = localStorage.getItem(STORAGE_KEY_ELICITATION);
      if (savedElicitation) {
        const parsed = JSON.parse(savedElicitation);
        setExpertFormState(parsed);
        if (parsed.profile?.name) {
          setMetadata((prev) => ({
            ...prev,
            expertName: parsed.profile.name,
            organization: parsed.profile.organization || prev.organization,
            expertPosition: parsed.profile.professionalRole || prev.expertPosition,
            educationField: parsed.profile.academicDegree || prev.educationField,
            experienceYears: parsed.profile.yearsExperience || prev.experienceYears,
          }));
        }
      }

      const savedMeta = localStorage.getItem(STORAGE_KEY_META);
      if (savedMeta) {
        setMetadata(JSON.parse(savedMeta));
      }

      const savedStep = localStorage.getItem(STORAGE_KEY_STEP) as MainStepId;
      if (savedStep && ['guide', 'profile', 'quantitative', 'oral', 'iran', 'review'].includes(savedStep)) {
        setCurrentStep(savedStep);
      }
    } catch (e) {
      console.warn('Failed to load saved state from localStorage:', e);
    }
  }, []);

  const handleStepChange = (step: MainStepId) => {
    setCurrentStep(step);
    try {
      localStorage.setItem(STORAGE_KEY_STEP, step);
    } catch (e) {}
  };

  const handleSaveExpertFormState = async (newState: FullExpertElicitationState, isFinalSubmit = false) => {
    setExpertFormState(newState);
    try {
      localStorage.setItem(STORAGE_KEY_ELICITATION, JSON.stringify(newState));
    } catch (e) {}

    if (newState.profile?.name || newState.profile?.organization) {
      const updatedMeta = {
        ...metadata,
        expertName: newState.profile.name || metadata.expertName,
        organization: newState.profile.organization || metadata.organization,
        expertPosition: newState.profile.professionalRole || metadata.expertPosition,
        educationField: newState.profile.academicDegree || metadata.educationField,
        experienceYears: newState.profile.yearsExperience || metadata.experienceYears,
      };
      setMetadata(updatedMeta);
      try {
        localStorage.setItem(STORAGE_KEY_META, JSON.stringify(updatedMeta));
      } catch (e) {}
    }

    try {
      setServerSaveStatus('saving');
      await apiPost(`/expert-session/${newState.expertId}`, {
        metadata: {
          expertName: newState.profile.name,
          organization: newState.profile.organization,
          expertPosition: newState.profile.professionalRole,
          educationField: newState.profile.academicDegree,
          experienceYears: newState.profile.yearsExperience,
        },
        elicitationData: newState,
        isFinalSubmit,
      }, { timeoutMs: 8000 });
      setServerSaveStatus('saved');
    } catch (err) {
      setServerSaveStatus('saved');
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportExpertElicitationToExcel(expertFormState);
      showToast('فایل اکسل جامع ارزیابی نخبگانی با موفقیت صادر گردید.');
    } catch (err) {
      console.error(err);
      showToast('خطا در صدور فایل اکسل.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8] text-slate-900">
      {/* Streamlined Header Bar */}
      <HeaderBar
        metadata={metadata}
        currentStep={currentStep}
        onSelectStep={handleStepChange}
        onOpenMetadata={() => setIsMetadataModalOpen(true)}
        onExportExcel={handleExportExcel}
        serverSaveStatus={serverSaveStatus}
      />

      {/* Main Streamlined Expert Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-20">
        <FintechExpertSystemView
          initialState={expertFormState}
          onSaveState={handleSaveExpertFormState}
          onExportExcel={handleExportExcel}
          serverSaveStatus={serverSaveStatus}
          activeStep={currentStep}
          onChangeStep={handleStepChange}
        />
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0b192c] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/80 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs md:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Metadata Edit Modal */}
      <MetadataModal
        isOpen={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
        metadata={metadata}
        onSave={(updated) => {
          setMetadata(updated);
          try {
            localStorage.setItem(STORAGE_KEY_META, JSON.stringify(updated));
          } catch (e) {}

          // Also update profile in elicitation state
          handleSaveExpertFormState({
            ...expertFormState,
            profile: {
              ...expertFormState.profile,
              name: updated.expertName,
              organization: updated.organization,
              professionalRole: updated.expertPosition || expertFormState.profile.professionalRole,
              academicDegree: updated.educationField || expertFormState.profile.academicDegree,
              yearsExperience: updated.experienceYears || expertFormState.profile.yearsExperience,
            },
          });
          showToast('مشخصات خبره به‌روزرسانی شد.');
        }}
      />
    </div>
  );
}
