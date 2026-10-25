import React from 'react';
import {
  FileSpreadsheet,
  UserCheck,
  CheckCircle2,
  BookOpen,
  User,
  Sliders,
  Mic,
  Compass,
} from 'lucide-react';
import { InterviewMetadata } from '../data/questionnaire';
import { MainStepId } from './FintechExpertSystemView';

interface HeaderBarProps {
  metadata: InterviewMetadata;
  currentStep: MainStepId;
  onSelectStep: (step: MainStepId) => void;
  onOpenMetadata?: () => void;
  onExportExcel: () => void;
  serverSaveStatus?: 'saved' | 'saving' | 'error';
}

const STEPS = [
  { id: 'guide' as MainStepId, label: '۱. راهنما و روایت چارچوب', icon: BookOpen },
  { id: 'profile' as MainStepId, label: '۲. ثبت مشخصات خبره', icon: User },
  { id: 'quantitative' as MainStepId, label: '۳. ارزیابی کمّی، DEMATEL و ANP', icon: Sliders },
  { id: 'oral' as MainStepId, label: '۴. دریافت اطلاعات شفاهی', icon: Mic },
  { id: 'iran' as MainStepId, label: '۵. چارچوب بومی ایران', icon: Compass },
  { id: 'review' as MainStepId, label: '۶. جمع‌بندی و دانلود اکسل', icon: FileSpreadsheet },
];

export const HeaderBar: React.FC<HeaderBarProps> = ({
  metadata,
  currentStep,
  onSelectStep,
  onExportExcel,
  serverSaveStatus = 'saved',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b192c] text-white shadow-xl border-b-2 border-emerald-500/80 no-print">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Single Headline Title & Expert Info */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onSelectStep('guide')}
            className="w-10 h-10 rounded-xl bg-[#1e3e62] border border-emerald-400/60 flex items-center justify-center shrink-0 shadow-md cursor-pointer hover:bg-[#254b77] transition"
            title="سامانه اعتبارسنجی نخبگانی فین‌تک ایران"
          >
            <span className="text-emerald-400 font-black text-xs">FinTech</span>
          </div>
          <div>
            <h1 className="font-black text-sm md:text-base text-white tracking-tight flex items-center gap-2">
              <span>سامانه اعتبارسنجی چارچوب فراتحلیل و تدوین الگوی بومی فین‌تک ایران</span>
            </h1>
            <div className="text-[0.7rem] text-slate-300 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectStep('profile')}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer underline decoration-dotted"
                title="مشاهده و ویرایش شناسنامه خبره"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{metadata.expertName ? `خبره: ${metadata.expertName}` : 'ثبت مشخصات خبره (کلیک کنید)'}</span>
                {metadata.organization && (
                  <span className="text-slate-400 font-normal">({metadata.organization})</span>
                )}
              </button>

              <span className="hidden md:inline-flex items-center gap-1 text-[0.65rem] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {serverSaveStatus === 'saving' ? 'در حال ذخیره‌سازی...' : 'پایگاه داده به‌روز است'}
              </span>
            </div>
          </div>
        </div>

        {/* 6 Clean Headline Step Buttons */}
        <div className="flex items-center bg-[#071220] p-1 rounded-xl border border-slate-700/80 gap-1 shadow-inner overflow-x-auto">
          {STEPS.map((st) => {
            const Icon = st.icon;
            const isSelected = currentStep === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStep(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-blue-300" />
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action: Excel Download */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportExcel}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
            title="دانلود فایل اکسل پاسخ‌ها"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">دانلود پاسخ‌ها (Excel)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
