import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Sliders,
  Mic,
  Compass,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Volume2,
  Award,
  Layers,
  Network,
  Scale,
  Lock,
  Send,
  Info,
  User,
  UserCheck,
  Building,
  GraduationCap,
  Briefcase,
  Star,
  ExternalLink,
  BarChart3,
  PieChart,
  Activity,
  TrendingUp,
  RefreshCw,
  Target,
  Split,
  SlidersHorizontal,
  ArrowDown,
  ArrowUp,
  CheckCircle,
} from 'lucide-react';
import {
  FullExpertElicitationState,
  ConstructDecision,
  ConstructAssessment,
  ProposedMissingConstruct,
  IranContextualFactorAssessment,
  ProposedRelationship,
} from '../data/expertElicitationTypes';
import { BASELINE_CONSTRUCTS_REGISTRY, BaselineConstructItem } from '../data/baselineConstructsList';
import { IRAN_EXPLORATORY_PROMPTS } from '../data/iranExploratoryPrompts';
import { Figure10Explorer } from './Figure10Explorer';
import { VoiceAnswerInput } from './VoiceAnswerInput';
import {
  computeDematel,
  computeDanp,
  computePairwisePriorities,
} from '../utils/mathModels';
import {
  DEFAULT_DEMATEL_DIRECT_MATRIX,
  DEMATEL_DIMENSION_NAMES,
} from '../data/methodologyData';

export type MainStepId = 'guide' | 'profile' | 'quantitative' | 'oral' | 'iran' | 'review';

interface FintechExpertSystemViewProps {
  initialState: FullExpertElicitationState;
  onSaveState: (state: FullExpertElicitationState, isFinalSubmit?: boolean) => Promise<void>;
  onExportExcel: () => void;
  serverSaveStatus: 'saved' | 'saving' | 'error';
  activeStep?: MainStepId;
  onChangeStep?: (step: MainStepId) => void;
}

const STEPS_NAV: { id: MainStepId; num: string; titleFa: string; shortFa: string; icon: any }[] = [
  { id: 'guide', num: '۱', titleFa: 'راهنما و روایت چارچوب', shortFa: 'روایت و راهنما', icon: BookOpen },
  { id: 'profile', num: '۲', titleFa: 'ثبت مشخصات و شناسنامه خبره', shortFa: 'مشخصات خبره', icon: User },
  { id: 'quantitative', num: '۳', titleFa: 'ارزیابی کمّی، DEMATEL و ANP چارچوب', shortFa: 'ارزیابی کمّی، DEMATEL و ANP', icon: Sliders },
  { id: 'oral', num: '۴', titleFa: 'دریافت اطلاعات و بازخوردهای شفاهی', shortFa: 'اطلاعات شفاهی', icon: Mic },
  { id: 'iran', num: '۵', titleFa: 'تدوین و اعتبارسنجی چارچوب بومی ایران', shortFa: 'چارچوب بومی ایران', icon: Compass },
  { id: 'review', num: '۶', titleFa: 'جمع‌بندی نهایی و دریافت فایل اکسل', shortFa: 'ثبت و دانلود', icon: FileSpreadsheet },
];

export const FintechExpertSystemView: React.FC<FintechExpertSystemViewProps> = ({
  initialState,
  onSaveState,
  onExportExcel,
  serverSaveStatus,
  activeStep: controlledStep,
  onChangeStep,
}) => {
  const [state, setState] = useState<FullExpertElicitationState>(initialState);
  const [internalStep, setInternalStep] = useState<MainStepId>('guide');
  const activeStep = controlledStep || internalStep;

  // Guide Sub-Views / Sections
  const [guideSubTab, setGuideSubTab] = useState<'narrative' | 'dimensions' | 'relationships' | 'paradoxes' | 'explorer'>('narrative');

  // Quantitative Sub-navigation tabs: 'validation' | 'dematel' | 'anp'
  const [quantSubTab, setQuantSubTab] = useState<'validation' | 'dematel' | 'anp'>('validation');
  const [anpMode, setAnpMode] = useState<'danp' | 'pairwise'>('danp');

  // Quantitative filter & expand
  const [constructFilter, setConstructFilter] = useState<'all' | 'dimensions' | 'themes' | 'relationships' | 'paradoxes'>('all');
  const [expandedConstructId, setExpandedConstructId] = useState<string | null>('HD1');

  // Oral feedback active topic
  const [activeOralTopic, setActiveOralTopic] = useState<string>('strengths');

  // New missing construct form state
  const [newMissingNameFa, setNewMissingNameFa] = useState('');
  const [newMissingNameEn, setNewMissingNameEn] = useState('');
  const [newMissingDef, setNewMissingDef] = useState('');
  const [newMissingDim, setNewMissingDim] = useState('HD1');
  const [newMissingWhy, setNewMissingWhy] = useState('');
  const [newMissingWhyInad, setNewMissingWhyInad] = useState('');
  const [newMissingEvidence, setNewMissingEvidence] = useState('');
  const [newMissingType, setNewMissingType] = useState<'new_construct' | 'extension_of_existing' | 'contextual_condition'>('new_construct');

  // Contextual factors active tab
  const [activeFactorIndex, setActiveFactorIndex] = useState<number>(0);

  // New relationship form state
  const [relSource, setRelSource] = useState('HD1');
  const [relTarget, setRelTarget] = useState('HD2');
  const [relDir, setRelDir] = useState<'unidirectional' | 'bidirectional'>('unidirectional');
  const [relType, setRelType] = useState<ProposedRelationship['relationshipType']>('direct_effect');
  const [relMechanism, setRelMechanism] = useState('');
  const [relConfidence, setRelConfidence] = useState<number>(4);

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync state with parent
  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  // Pairwise comparisons state for ANP (un-filled by default for data collection)
  const [pairwiseState, setPairwiseState] = useState<Record<string, { id: string; dimA: string; dimB: string; side?: 'A' | 'B' | 'Equal' | null; intensity?: number | null }>>(() => {
    return (initialState.anpComparisons as any) || {};
  });

  // DEMATEL current direct matrix (4x4, diagonal 0, off-diagonal un-filled by default)
  const currentDematelMatrix: (number | null)[][] = useMemo(() => {
    if (state.dematelMatrix && state.dematelMatrix.length === 4) {
      return state.dematelMatrix;
    }
    return [
      [0, null, null, null],
      [null, 0, null, null],
      [null, null, 0, null],
      [null, null, null, 0],
    ];
  }, [state.dematelMatrix]);

  // Counts of completed inputs (for progress indicators)
  const dematelFilledCount = useMemo(() => {
    let count = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (r !== c && currentDematelMatrix[r]?.[c] !== null && currentDematelMatrix[r]?.[c] !== undefined) {
          count++;
        }
      }
    }
    return count;
  }, [currentDematelMatrix]);

  const anpFilledCount = useMemo(() => {
    const pairs = ['HD1_HD2', 'HD1_HD3', 'HD1_HD4', 'HD2_HD3', 'HD2_HD4', 'HD3_HD4'];
    return pairs.filter((key) => {
      const cmp = pairwiseState[key];
      return cmp && cmp.side && (cmp.side === 'Equal' || (cmp.intensity && cmp.intensity >= 1));
    }).length;
  }, [pairwiseState]);

  const handleUpdateDematelCell = (rIdx: number, cIdx: number, val: number) => {
    if (rIdx === cIdx) return;
    const next = currentDematelMatrix.map((row, r) =>
      row.map((c, col) => (r === rIdx && col === cIdx ? val : c))
    );
    setState((prev) => ({
      ...prev,
      dematelMatrix: next,
      lastSavedAt: new Date().toISOString(),
    }));
  };

  const handleClearDematel = () => {
    const blank = [
      [0, null, null, null],
      [null, 0, null, null],
      [null, null, 0, null],
      [null, null, null, 0],
    ];
    setState((prev) => ({
      ...prev,
      dematelMatrix: blank,
      lastSavedAt: new Date().toISOString(),
    }));
    showToast('ماتریس اثرگذاری مستقیم دیمتل پاکسازی شد.');
  };

  const handleClearPairwise = () => {
    setPairwiseState({});
    setState((prev) => ({
      ...prev,
      anpComparisons: {},
      lastSavedAt: new Date().toISOString(),
    }));
    showToast('مقایسه‌های زوجی ANP پاکسازی شد.');
  };

  const handleUpdatePairwise = (key: string, side: 'A' | 'B' | 'Equal', intensity: number) => {
    const next = {
      ...pairwiseState,
      [key]: { id: key, dimA: key.split('_')[0], dimB: key.split('_')[1], side, intensity },
    };
    setPairwiseState(next);
    setState((prev) => ({
      ...prev,
      anpComparisons: next as any,
      lastSavedAt: new Date().toISOString(),
    }));
  };

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      onSaveState(state, false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [state]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const setStep = (step: MainStepId) => {
    if (onChangeStep) {
      onChangeStep(step);
    } else {
      setInternalStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProfile = (field: keyof FullExpertElicitationState['profile'], value: any) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
      lastSavedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateConstructAssessment = (
    constructId: string,
    updater: (curr: ConstructAssessment) => ConstructAssessment
  ) => {
    setState((prev) => {
      const existing = prev.constructAssessments[constructId] || {
        constructId,
        decision: '' as any,
        ratings: {},
        confidence: 0,
        explanation: '',
        lastUpdated: new Date().toISOString(),
      };
      return {
        ...prev,
        constructAssessments: {
          ...prev.constructAssessments,
          [constructId]: updater(existing),
        },
        lastSavedAt: new Date().toISOString(),
      };
    });
  };

  const handleAddMissingConstruct = () => {
    if (!newMissingNameFa.trim() || !newMissingDef.trim()) {
      alert('لطفاً عنوان فارسی و تعریف مقدماتی سازه مفقود را وارد فرمایید.');
      return;
    }
    const newProposal: ProposedMissingConstruct = {
      id: `MISSING-${Date.now()}`,
      nameFa: newMissingNameFa.trim(),
      nameEn: newMissingNameEn.trim(),
      preliminaryDefinition: newMissingDef.trim(),
      assignedDimension: newMissingDim,
      whyNecessary: newMissingWhy.trim(),
      whyExistingInadequate: newMissingWhyInad.trim(),
      iranSpecificEvidence: newMissingEvidence.trim(),
      proposalType: newMissingType,
      proposedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      missingConstructs: [...prev.missingConstructs, newProposal],
      lastSavedAt: new Date().toISOString(),
    }));
    setNewMissingNameFa('');
    setNewMissingNameEn('');
    setNewMissingDef('');
    setNewMissingWhy('');
    setNewMissingWhyInad('');
    setNewMissingEvidence('');
    showToast('سازه مفقود پیشنهادی ویژه ایران با موفقیت افزوده شد.');
  };

  const handleAddRelationship = () => {
    if (!relMechanism.trim()) {
      alert('لطفاً سازوکار تبیین‌کننده رابطه را وارد فرمایید.');
      return;
    }
    const newRel: ProposedRelationship = {
      id: `REL-${Date.now()}`,
      sourceConstruct: relSource,
      targetConstruct: relTarget,
      direction: relDir,
      relationshipType: relType,
      mechanism: relMechanism.trim(),
      conditions: '',
      evidence: '',
      confidence: relConfidence,
    };
    setState((prev) => ({
      ...prev,
      proposedRelationships: [...prev.proposedRelationships, newRel],
      lastSavedAt: new Date().toISOString(),
    }));
    setRelMechanism('');
    showToast('رابطه پیشنهادی جدید با موفقیت ثبت گردید.');
  };

  const handleFinalSubmit = async () => {
    if (window.confirm('آیا از ثبت قطعی و ارسال ارزیابی‌های خود اطمینان دارید؟')) {
      const finalState: FullExpertElicitationState = {
        ...state,
        isFinalSubmitted: true,
        submittedAt: new Date().toISOString(),
      };
      setState(finalState);
      await onSaveState(finalState, true);
      showToast('ارزیابی شما با موفقیت به عنوان ارزیابی قطعی ثبت گردید.');
    }
  };

  // Filter constructs
  const filteredConstructs = BASELINE_CONSTRUCTS_REGISTRY.filter((c) => {
    if (constructFilter === 'all') return true;
    if (constructFilter === 'dimensions') return c.category === 'higher_order_dimension';
    if (constructFilter === 'themes') return c.category === 'second_order_theme';
    if (constructFilter === 'relationships') return c.category === 'systemic_relationship';
    if (constructFilter === 'paradoxes') return c.category === 'paradox_contradiction';
    return true;
  });

  const assessedCount = Object.keys(state.constructAssessments).length;
  const totalConstructs = BASELINE_CONSTRUCTS_REGISTRY.length;
  const isProfileComplete = Boolean(
    state.profile.name &&
    state.profile.organization &&
    state.profile.professionalRole &&
    state.profile.yearsExperience
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 animate-fadeIn">
      {/* Top Academic Headline Banner */}
      <div className="bg-[#0b192c] text-white p-5 md:p-7 rounded-3xl border border-slate-700 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                سامانه اعتبارسنجی نخبگانی چارچوب سرمایه‌گذاری الگوریتمی و فین‌تک ایران
              </span>
              <span className="text-[0.65rem] text-slate-400 font-mono">
                شناسه خبره: <strong className="text-amber-400">{state.expertId}</strong>
              </span>
            </div>
            <h1 className="text-lg md:text-2xl font-black text-white">
              اعتبارسنجی چارچوب مفهومی فراتحلیل و تدوین چارچوب بومی ایران
            </h1>
            <p className="text-xs text-slate-300">
              {state.profile.name ? `خبره ارجمند: ${state.profile.name}` : 'فرم ارزیابی و استخراج قضاوت نخبگانی'}
              {state.profile.organization && ` (${state.profile.organization})`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                serverSaveStatus === 'saving'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{serverSaveStatus === 'saving' ? 'در حال ذخیره‌سازی...' : 'داده‌ها ذخیره شد'}</span>
            </span>

            <button
              type="button"
              onClick={onExportExcel}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
              title="دریافت فایل اکسل پاسخ‌ها"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>خروجی اکسل</span>
            </button>
          </div>
        </div>

        {/* 6-Step Streamlined Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-3 border-t border-slate-700/80">
          {STEPS_NAV.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setStep(step.id)}
                className={`p-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-md font-black ring-2 ring-blue-400/50'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-blue-300" />
                <span className="text-[0.72rem] truncate">{step.titleFa}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating toast alert */}
      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-900/90 text-emerald-100 border border-emerald-500 text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          STEP 1: COMPREHENSIVE GUIDE & NARRATIVE (راهنما و روایت چارچوب)
      ========================================================================= */}
      {activeStep === 'guide' && (
        <div className="space-y-6">
          {/* Prominent Expert Profile Quick Banner directly on Step 1 */}
          <div className="bg-gradient-to-r from-slate-900 via-[#10233b] to-slate-900 text-white p-5 rounded-3xl border-2 border-amber-400/70 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <UserCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-[0.7rem] text-amber-300 font-bold flex items-center gap-1.5">
                  <span>شناسنامه و مشخصات خبره در پژوهش</span>
                  {isProfileComplete ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[0.65rem] border border-emerald-500/40 flex items-center gap-1">
                      <Check className="w-3 h-3" /> تکمیل‌شده
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[0.65rem] border border-amber-500/40">
                      نیازمند تکمیل مشخصات
                    </span>
                  )}
                </div>
                <div className="text-sm md:text-base font-black text-white">
                  {state.profile.name ? `دکتر/جناب ${state.profile.name}` : 'مشخصات خبره هنوز ثبت نگردیده است'}
                  {state.profile.organization && (
                    <span className="text-xs text-slate-300 font-normal mr-2">
                      | {state.profile.organization} {state.profile.professionalRole ? `(${state.profile.professionalRole})` : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('profile')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{isProfileComplete ? 'مشاهده و ویرایش شناسنامه خبره' : 'تکمیل مشخصات خبره (کلیک کنید)'}</span>
            </button>
          </div>

          {/* Master Narrative & Guide Card */}
          <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 font-mono">سنتز کیفی نظام‌مند (Meta-Synthesis)</span>
                <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                  خاستگاه چارچوب فراتحلیل بین‌المللی
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                راهنمای جامع و روایت چارچوب مفهومی سرمایه‌گذاری الگوریتمی و تحول دیجیتال
              </h2>

              {/* Comprehensive Abstract & Methodological Foundation Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 space-y-3 text-xs text-slate-700 leading-relaxed text-justify">
                <p>
                  این صفحه، روایت مفهومی یکپارچه و منطق نظری شکل‌گیری چارچوبی را به تصویر می‌کشد که از دل <strong>سنتز کیفی نظام‌مند (Qualitative Meta-Synthesis) بر روی ۲۸ مطالعه علمی منتخب و معتبر بین‌المللی (منتشرشده بین سال‌های ۲۰۱۹ تا ۲۰۲۶)</strong>، یکپارچه‌شده با کاوش متن محاسباتی (Computational Text Mining)، استخراج شده است.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>متدولوژی هفت‌مرحله‌ای و سه‌سویه‌سازی محاسباتی:</span>
                    </div>
                    <p className="text-[0.72rem] text-slate-600 leading-relaxed">
                      این فراتحلیل بر مبنای رویکرد هفت‌مرحله‌ای ساندلوسکی و باروسو (Sandelowski & Barroso, 2007) و پروتکل PRISMA 2020 سامان یافته است. سنتز از پالایش بیش از <strong>۳۰۰۰ کد اولیه</strong> آغاز شده و در فرآیندی تدریجی از مسیر <strong>۲۰ مقوله محوری</strong> به <strong>۷ مضمون سطح دوم (ST1–ST7)</strong> و <strong>۴ بعد مفهومی کلان (HD1–HD4)</strong> توسعه یافته است. برای سه‌سویه‌سازی محاسباتی (Computational Triangulation)، از مدل‌های تخصیص پنهان دیریکله (LDA)، مدل زبان BERTopic، وزن‌دهی TF-IDF، تحلیل شباهت معنایی برداری و تحلیل شبکه مفاهیم استفاده شده است.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                      <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>رد جبرگرایی فناورانه و فرمول بازگشتی-مشروط:</span>
                    </div>
                    <p className="text-[0.72rem] text-slate-600 leading-relaxed">
                      یافته‌های اساسی اثبات می‌کنند که فناوری دیجیتال پیامدهای سرمایه‌گذاری را به صورت خودکار یا قطعی تعیین نمی‌کند (رد جبرگرایی فناورانه). تحقق پیامدها مشروط به تعامل چهار سازوکار بنیادین است:{' '}
                      <strong className="text-slate-800">کالیبراسیون اعتماد (نه صرفاً ایجاد اعتماد)</strong>،{' '}
                      <strong className="text-slate-800">مذاکره انسان-الگوریتم (برتری الگوهای هیبریدی)</strong>،{' '}
                      <strong className="text-slate-800">بازپیکربندی واسطه‌گری پلتفرمی</strong>، و{' '}
                      <strong className="text-slate-800">حکمرانی الگوریتمی و چارچوب‌های هنجاری (ST6)</strong>.{' '}
                      فرمول سیستمی چارچوب عبارت است از:{' '}
                      <span className="font-mono font-bold text-blue-800 dir-ltr inline-block">Adoption → [ HD1 × HD2 × HD3 × HD4 ] → Outcomes</span>
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-slate-800 pt-1">
                  لطفاً پیش از ارزیابی‌های کمّی، روایت جامع چارچوب و ابعاد چهارگانه زیر را به دقت مطالعه فرمایید:
                </p>
              </div>
            </div>

            {/* Guide Sub-Nav Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
              {[
                { id: 'narrative', label: '۱. روایت چارچوب مفهومی', icon: BookOpen },
                { id: 'dimensions', label: '۲. ابعاد ۴گانه کلان (HDs)', icon: Layers },
                { id: 'relationships', label: '۳. سازوکارهای روابط سیستمی (R1–R7)', icon: Network },
                { id: 'paradoxes', label: '۴. پارادوکس‌های ۶گانه دیالکتیکی', icon: Scale },
                { id: 'explorer', label: '۵. کاوشگر تعاملی نمودار بلوکی چارچوب', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = guideSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setGuideSubTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm font-black'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SUB-SECTION 1: THE NARRATIVE OF THE FRAMEWORK */}
            {guideSubTab === 'narrative' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Visual Narrative Header */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950 via-[#10233b] to-slate-900 text-white space-y-4 border border-blue-800 shadow-md">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
                      Conditional & Recursive Trust–Decision–Intermediation Account
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-white leading-tight">
                    روایت چارچوب: چگونه روانشناسی سرمایه‌گذار، تصمیم‌گیری هیبریدی، تحول واسطه‌گری و حکمرانی هنجاری در یک اکوسیستم واحد همگرا می‌شوند؟
                  </h3>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed text-justify">
                    پژوهش‌های پیشین اغلب به ابزارهای فین‌تک، روبوادوایزرها و سامانه‌های الگوریتمی با نگاهی تک‌بعدی (صرفاً کارایی ابزاری یا کانال‌های دیجیتال) نگریسته‌اند. فراتحلیل کیفی ۲۸ مطالعه معتبر جهانی نشان داد که این پدیده یک <strong>«سیستم یکپارچه فنی-اجتماعی (STS)»</strong> و یک <strong>«سیستم انسانی-طراحی‌شده (HDS)»</strong> است. این چارچوب مفهومی تمام بخش‌ها و مضامین را در قالب روایتی چهارفصلی به هم پیوند می‌زند:
                  </p>
                </div>

                {/* 4 Narrative Chapters Covering Entire Framework */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Chapter 1: HD1 */}
                  <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-700 text-white font-mono text-xs font-bold">
                        فصل ۱: بعد HD1
                      </span>
                      <span className="text-[0.7rem] text-blue-900 font-bold">روانشناسی سرمایه‌گذار، اعتماد و ریسک (ST1 & ST5)</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm">
                      کالیبراسیون اعتماد در برابر ایجاد صرف اعتماد و پارادوکس شفافیت
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                      روایت با سرمایه‌گذار آغاز می‌شود. یافته‌های فراتحلیل تمایز آشکاری میان <em>«شکل‌گیری اعتماد اولیه»</em> و <em>«کالیبراسیون اعتماد (Trust Calibration)»</em> قائل است. کالیبراسیون یعنی تنظیم دقیق سطح اعتماد کاربر متناسب با قابلیت و خطاپذیری واقعی سیستم. شواهد نشان می‌دهند که شفافیت الگوریتمی ممکن است احساس آرامش و راحتی (Comfort) را در سرمایه‌گذار افزایش دهد، اما لزوماً کیفیت قضاوت مالی او را ارتقا نمی‌بخشد. همچنین سرریز اعتبار از برند نهاد مادر (Trust Transfer) و کنترل اضطراب فناوری، شروط مرزی پایداری اعتماد در نوسانات بازارند.
                    </p>
                  </div>

                  {/* Chapter 2: HD2 */}
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-700 text-white font-mono text-xs font-bold">
                        فصل ۲: بعد HD2
                      </span>
                      <span className="text-[0.7rem] text-amber-900 font-bold">معماری تصمیم انسان-الگوریتم (ST2 & ST7)</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm">
                      مذاکره تصمیم، برتری الگوهای هیبریدی و شکاف تحقق شخصی‌سازی
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                      در هسته تصمیم‌گیری، الگوی جایگزینی کامل انسان رد می‌شود. شواهد فراتحلیل اثبات می‌کنند که <strong>مدل‌های هیبریدی انسان-الگوریتم (مشاور-در-حلقه / Advisor-in-the-Loop)</strong> در عمل عملکردی به مراتب برتر از آلترناتیوهای تمام‌خودکار یا تصمیم‌گیران صرفاً سنتی به نمایش می‌گذارند. انسان هوش عاطفی و درک ابعاد زندگی را تأمین می‌کند و ماشین سرعت محاسباتی و انضباط تحلیلی را می‌آورد. همچنین سنتز کیفی نشان داد که <em>«شخصی‌سازی مبتنی بر داده»</em> بیشتر در بیانیه‌های بازاریابی ادعا می‌شود تا اینکه در پلتفرم‌ها به معنای واقعی سرمایه انسانی و نیازهای پویا تحقق یابد.
                    </p>
                  </div>

                  {/* Chapter 3: HD3 */}
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-mono text-xs font-bold">
                        فصل ۳: بعد HD3
                      </span>
                      <span className="text-[0.7rem] text-emerald-900 font-bold">تحول ساختار بازار، واسطه‌گری و دسترسی (ST3 & ST4)</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm">
                      باز-واسطه‌گری پلتفرمی، اثر نامتقارن سواد مالی و لایه‌بندی دسترسی
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                      در سطح اکوسیستم بازار، پدیده‌ای دوگانه شکل می‌گیرد: دیجیتالی‌سازی از یک سو واسطه‌های مالی سنتی را تضعیف و حذف می‌کند (Disintermediation)، اما از سوی دیگر واسطه‌گری نوینی را بر محور غول‌های پلتفرمی مستقر می‌سازد (Platform-Based Re-intermediation). از طرف دیگر، در حالی که دسترسی به خدمات سرمایه‌گذاری برای عموم دموکراتیزه می‌شود، <em>سواد مالی تأثیری کاملاً ناهمگن و غیریکنواخت</em> بر پذیرش و بهره‌مندی واقعی دارد؛ به گونه‌ای که کاربران دارای سواد مالی و داده‌ای بالاتر سودهای بسیار چشمگیرتری کسب کرده و شکاف لایه‌بندی دسترسی تعمیق می‌گردد.
                    </p>
                  </div>

                  {/* Chapter 4: HD4 */}
                  <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-700 text-white font-mono text-xs font-bold">
                        فصل ۴: بعد HD4
                      </span>
                      <span className="text-[0.7rem] text-purple-900 font-bold">حکمرانی الگوریتمی و چارچوب‌های هنجاری (ST6)</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm">
                      بعد هنجاری شکل‌دهنده، نظارت تطبیقی و استانداردهای اخلاقی
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                      چارچوب نشان می‌دهد که بدون یک بستر هنجاری مقتدر، سیستم دچار شکست بازار و ریسک سیستمیک می‌شود. مضمون <strong>ST6 (حکمرانی الگوریتمی و چارچوب‌های هنجاری)</strong> به عنوان بعد هنجاری نظام‌بخش، کل تعاملات سرمایه‌گذاری دیجیتال را شکل می‌دهد. این بعد از طریق کشف سوگیری‌ها (Bias Detection)، ممیزی‌های دوره‌ای انصاف الگوریتمی، رژیم‌های مجوزدهی مشاوران هوش مصنوعی (AIRAL)، الزامات شفافیت تبیین‌پذیر (XAI) و سندباکس‌های نظارتی پویا عمل می‌کند تا ناتوانی ذاتی خودتنظیم‌گری بازار را مهار سازد.
                    </p>
                  </div>
                </div>

                {/* Synthesis Narrative Conclusion & Recursive System */}
                <div className="p-5 rounded-2xl bg-slate-100 border border-slate-300 space-y-2.5">
                  <h4 className="font-black text-slate-900 text-xs md:text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>منطق دیالکتیکی و بازگشتی چارچوب: اتصالات R1 تا R7 و پارادوکس‌های P1 تا P6</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">
                    این ابعاد چهارگانه منفصل نیستند، بلکه از طریق ۷ رابطه سیستمی (R1–R7) و دو حلقه بازخورد خرد و کلان به صورت مداوم در حال تعامل بازگشتی‌اند: کالیبراسیون اعتماد در HD1 رفتار همکاری در HD2 را مقدور می‌سازد؛ گسترش پلتفرم‌ها در HD3 دسترسی را متحول می‌کند؛ و اثرات رفاهی بازار ناگزیر به رگولاتوری HD4 (به‌ویژه ST6) بازخورد داده و موازین تنظیمی مجدداً اعتماد و تصمیم را بازتنظیم می‌نمایند. در پس تمام این لایه‌ها، ۶ پارادوکس دیالکتیکی همواره در حال مدیریت و تعادل‌یابی پویای سیستم هستند.
                  </p>
                </div>

                {/* Direct Action to Next Step */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setGuideSubTab('dimensions')}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>مشاهده ابعاد و مضامین تفصیلی (HDs)</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('profile')}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <span>ثبت مشخصات خبره و ورود به ارزیابی</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SUB-SECTION 2: 4 HIGHER-ORDER DIMENSIONS */}
            {guideSubTab === 'dimensions' && (
              <div className="space-y-5 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      code: 'HD1',
                      titleFa: 'روانشناسی سرمایه‌گذار، اعتماد و ریسک',
                      titleEn: 'Trust, Risk & Investor Psychology',
                      descFa:
                        'نحوه ادراک، اعتمادسازی و واکنش سرمایه‌گذاران به سامانه‌های دیجیتال؛ شامل سازوکارهای کالیبراسیون اعتماد به الگوریتم، انتقال اعتبار از نهاد مالی، ادراک ریسک نوسان، اضطراب فناوری و رفتارهای پذیرش یا مقاومت کاربر.',
                      themes: 'ST1 (کالیبراسیون اعتماد) و ST5 (پویایی‌های رفتاری پذیرش و مقاومت)',
                      color: 'blue',
                    },
                    {
                      code: 'HD2',
                      titleFa: 'معماری تصمیم انسان-الگوریتم',
                      titleEn: 'Human–Algorithm Decision Architecture',
                      descFa:
                        'نحوه ساختاربندی، شخصی‌سازی و اجرای تصمیمات سرمایه‌گذاری از طریق ادغام قضاوت انسان و سیستم‌های الگوریتمی؛ شامل مدل مشاور-در-حلقه (AITL)، تفویض اختیار محاسباتی، شخصی‌سازی سبد و مداخلات رفتاری (Nudging).',
                      themes: 'ST2 (مذاکره تصمیم انسان-الگوریتم) و ST7 (شخصی‌سازی مبتنی بر داده)',
                      color: 'amber',
                    },
                    {
                      code: 'HD3',
                      titleFa: 'تحول ساختاری بازارهای سرمایه‌گذاری و دسترسی',
                      titleEn: 'Structural Transformation of Markets & Access',
                      descFa:
                        'دگرگونی ساختار واسطه‌گری توسط پلتفرم‌های دیجیتال، حذف واسطه‌های سنتی، باز-واسطه‌گری، دموکراتیزه‌سازی دسترسی به مدیریت ثروت برای سرمایه‌گذاران خرد و خطر لایه‌بندی نابرابر دسترسی بر اساس سواد تحلیلی.',
                      themes: 'ST3 (بازپیکربندی واسطه‌گری) و ST4 (دموکراتیزه‌سازی و لایه‌بندی دسترسی)',
                      color: 'emerald',
                    },
                    {
                      code: 'HD4',
                      titleFa: 'حکمرانی چندسطحی رگولاتوری، نهادی و اخلاقی',
                      titleEn: 'Multi-Level Governance & Regulation',
                      descFa:
                        'سازوکارهای حاکمیتی و تنظیمی حاکم بر سیستم؛ شامل رژیم‌های مجوزدهی هوش مصنوعی (نظیر AIRAL)، ممیزی سوگیری الگوریتم، شفافیت و تبیین‌پذیری مدل (XAI)، سندباکس رگولاتوری و صیانت از حقوق سرمایه‌گذار.',
                      themes: 'ST6 (حکمرانی الگوریتمی و پاسخگویی هنجاری)',
                      color: 'purple',
                    },
                  ].map((hd) => (
                    <div
                      key={hd.code}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-slate-900 text-amber-300 font-mono font-black text-xs">
                          {hd.code}
                        </span>
                        <span className="text-[0.7rem] font-serif text-slate-500 dir-ltr">{hd.titleEn}</span>
                      </div>
                      <h3 className="font-black text-sm md:text-base text-slate-900">{hd.titleFa}</h3>
                      <p className="text-xs text-slate-700 leading-relaxed text-justify">{hd.descFa}</p>
                      <div className="pt-2 border-t border-slate-200 text-[0.7rem] font-bold text-blue-900">
                        مضامین متناظر: {hd.themes}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 7 Second-Order Themes List */}
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <h4 className="text-sm font-black text-slate-900">مضامین هفت‌گانه سطح دوم (Second-Order Themes: ST1–ST7):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BASELINE_CONSTRUCTS_REGISTRY.filter((c) => c.category === 'second_order_theme').map((st) => (
                      <div key={st.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[0.68rem]">
                            {st.code}
                          </span>
                          <span className="text-[0.65rem] text-slate-400 font-mono dir-ltr">{st.nameEn}</span>
                        </div>
                        <div className="font-bold text-slate-900">{st.nameFa}</div>
                        <p className="text-[0.72rem] text-slate-600 leading-relaxed text-justify">{st.definitionFa}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION 3: SYSTEMIC RELATIONSHIPS (R1–R7) */}
            {guideSubTab === 'relationships' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 leading-relaxed text-justify">
                  این ۷ رابطه سیستمی، سازوکارهای دینامیک و جریان‌های تأثیرگذاری متقابل بین ابعاد چهارگانه و مضامین هفت‌گانه را در مدل پیشینه ادبیات تبیین می‌کنند:
                </div>
                <div className="space-y-3">
                  {BASELINE_CONSTRUCTS_REGISTRY.filter((c) => c.category === 'systemic_relationship').map((rel) => (
                    <div key={rel.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700 text-white font-mono font-black text-[0.7rem]">
                            {rel.code}
                          </span>
                          <span className="font-black text-sm text-slate-900">{rel.nameFa}</span>
                        </div>
                        <span className="text-[0.7rem] font-serif text-slate-400 dir-ltr">{rel.nameEn}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-justify">{rel.definitionFa}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-SECTION 4: DIALECTICAL PARADOXES */}
            {guideSubTab === 'paradoxes' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed text-justify">
                  شش پارادوکس دیالکتیکی زیر نشان‌دهنده تنش‌ها و تضادهای درونی اجتناب‌ناپذیری هستند که هر سامانه هوشمند سرمایه‌گذاری با آن‌ها دست‌به‌گریبان است و نیازمند مدیریت متوازن می‌باشند:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BASELINE_CONSTRUCTS_REGISTRY.filter((c) => c.category === 'paradox_contradiction').map((pdx) => (
                    <div key={pdx.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-lg bg-purple-700 text-white font-mono font-black text-[0.7rem]">
                          {pdx.code}
                        </span>
                        <span className="text-[0.68rem] text-slate-500 font-serif dir-ltr">{pdx.nameEn}</span>
                      </div>
                      <h4 className="font-black text-sm text-slate-900">{pdx.nameFa}</h4>
                      <p className="text-slate-700 leading-relaxed text-justify">{pdx.definitionFa}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-SECTION 5: INTERACTIVE BLOCK DIAGRAM EXPLORER */}
            {guideSubTab === 'explorer' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  با کلیک بر روی هر یک از بلوک‌ها و اتصالات در نمودار مفهومی زیر، توضیحات تفصیلی، مضامین تابعه و روابط وابسته را بررسی فرمایید:
                </div>
                <div className="border border-slate-300 rounded-3xl overflow-hidden p-2 bg-slate-900 shadow-inner">
                  <Figure10Explorer />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: EXPERT PROFILE & REGISTRATION (بخش ثبت مشخصات خبره - بسیار مشخص و برجسته)
      ========================================================================= */}
      {activeStep === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 font-mono">گام دوم پژوهش</span>
              <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                ثبت مشخصات و شناسنامه خبره
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              شناسنامه تخصصی و مشخصات حرفه‌ای خبره محترم
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              مشخصات ثبت‌شده در این بخش صرفاً جهت تحلیل‌های متدولوژیک و طبقه‌بندی دیدگاه‌ها در گزارش پژوهش استفاده خواهد شد و طبق ضوابط اخلاقی تحقیق، نظرات انفرادی به صورت محرمانه گزارش می‌گردند.
            </p>
          </div>

          {/* Profile Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Field: Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>نام و نام خانوادگی:</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.profile.name || ''}
                onChange={(e) => handleUpdateProfile('name', e.target.value)}
                placeholder="مثال: دکتر علیرضا ناصری"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Field: Organization */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>سازمان، شرکت یا دانشگاه متبوع:</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.profile.organization || ''}
                onChange={(e) => handleUpdateProfile('organization', e.target.value)}
                placeholder="مثال: سازمان بورس / بانک مرکزی / شرکت سبدگردان / دانشگاه تهران"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Field: Professional Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>سمت فعلی یا نقش سازمانی:</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.profile.professionalRole || ''}
                onChange={(e) => handleUpdateProfile('professionalRole', e.target.value)}
                placeholder="مثال: مدیر فناوری اطلاعات / مشاور ارشد الگوریتمی / عضو هیئت علمی"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Field: Years of Experience */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-blue-600" />
                <span>سابقه فعالیت حرفه‌ای و تخصصی (سال):</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.profile.yearsExperience || ''}
                onChange={(e) => handleUpdateProfile('yearsExperience', e.target.value)}
                placeholder="مثال: ۱۲ سال"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Field: Academic Degree */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>مقطع و رشته تحصیلی:</span>
              </label>
              <input
                type="text"
                value={state.profile.academicDegree || ''}
                onChange={(e) => handleUpdateProfile('academicDegree', e.target.value)}
                placeholder="مثال: دکتری مدیریت مالی / مهندسی کامپیوتر و هوش مصنوعی"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Field: Primary Expertise Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">حوزه اصلی تخصص شما:</label>
              <select
                value={state.profile.primaryExpertise || ''}
                onChange={(e) => handleUpdateProfile('primaryExpertise', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs md:text-sm bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">-- لطفاً حوزه تخصصی خود را انتخاب فرمایید --</option>
                <option value="regulatory">سیاست‌گذاری و رگولاتوری مالی و پولی (بانک مرکزی / بورس)</option>
                <option value="fintech_market">فناوری‌های مالی، فین‌تک، ولث‌تک و پرداخت الکترونیک</option>
                <option value="capital_markets">بازار سرمایه، سبدگردانی و معاملات الگوریتمی</option>
                <option value="ai_datascience">هوش مصنوعی، یادگیری ماشین و علم داده‌های مالی</option>
                <option value="legal_tech">حقوق فناوری، اخلاق الگوریتم و انطباق (Compliance)</option>
                <option value="academic">پژوهشی، دانشگاهی و متدولوژی سیستم‌ها</option>
              </select>
            </div>
          </div>

          {/* Self-Assessed Familiarity Ratings */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-xs md:text-sm font-black text-slate-900">
              میزان آشنایی خوداظهاری با مباحث تخصصی پژوهش (مقیاس ۱ تا ۵):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">آشنایی با سیستم‌های تصمیم‌گیری الگوریتمی و روبوادوایزری:</span>
                  <span className={`font-mono font-bold ${state.profile.familiarityTheoretical ? 'text-blue-600 font-black' : 'text-slate-400'}`}>
                    {state.profile.familiarityTheoretical ? `${state.profile.familiarityTheoretical} از ۵` : 'انتخاب نشده'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleUpdateProfile('familiarityTheoretical', lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        state.profile.familiarityTheoretical === lvl
                          ? 'bg-blue-600 text-white font-black shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">آشنایی با زیست‌بوم و شرایط نهادی فین‌تک ایران:</span>
                  <span className={`font-mono font-bold ${state.profile.familiarityEcosystem ? 'text-blue-600 font-black' : 'text-slate-400'}`}>
                    {state.profile.familiarityEcosystem ? `${state.profile.familiarityEcosystem} از ۵` : 'انتخاب نشده'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleUpdateProfile('familiarityEcosystem', lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        state.profile.familiarityEcosystem === lvl
                          ? 'bg-blue-600 text-white font-black shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stepper buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStep('guide')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به راهنما و روایت چارچوب</span>
            </button>

            <button
              type="button"
              onClick={() => {
                showToast('مشخصات خبره با موفقیت ثبت و ذخیره گردید.');
                setStep('quantitative');
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <span>ورود به مرحله بعد: ارزیابی کمّی چارچوب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: QUANTITATIVE ASSESSMENT, DEMATEL & ANP (ارزیابی کمّی، DEMATEL و ANP چارچوب)
      ========================================================================= */}
      {activeStep === 'quantitative' && (
        <div className="space-y-6">
          {/* Sub-Navigation Header: 1. Validation | 2. DEMATEL | 3. ANP */}
          <div className="bg-white rounded-3xl border border-slate-300 p-5 md:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 font-mono">گام سوم ارزیابی</span>
                  <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    سنجش کمّی، ماتریس علّی دیمتل (DEMATEL) و تحلیل شبکه (ANP)
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                  ارزیابی کمّی چارچوب، ماتریس دیمتل (DEMATEL) و تحلیل شبکه (ANP)
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl text-justify">
                  این گام شامل سه بخش تخصصی است: اعتبارسنجی مقیاسی سازه‌ها، تحلیل ساختار علّی و شدت اثرگذاری ابعاد (DEMATEL)، و اولویت‌بندی سوپرماتریس شبکه (ANP / DANP). لطفاً از تب‌های زیر برای تکمیل هر بخش استفاده فرمایید:
                </p>
              </div>

              {/* Sub-Tabs Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start lg:self-auto">
                {[
                  { id: 'validation', label: '۱. اعتبارسنجی سازه‌ها و چارچوب', short: 'سازه‌ها', icon: CheckCircle2 },
                  { id: 'dematel', label: '۲. گردآوری داده‌های دیمتل (DEMATEL)', short: 'دیمتل', icon: Network },
                  { id: 'anp', label: '۳. گردآوری مقایسات زوجی (ANP)', short: 'تحلیل شبکه', icon: Layers },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setQuantSubTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                      quantSubTab === tab.id
                        ? 'bg-blue-600 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================================
              SUB-TAB 1: CONSTRUCT-LEVEL & HOLISTIC VALIDATION
          ========================================================================= */}
          {quantSubTab === 'validation' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Section A: Overall Framework Assessment */}
              <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 font-mono">بخش الف</span>
                    <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                      ارزیابی کلان و کل‌نگر (Holistic Framework Validation)
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900">
                    ارزیابی کمّی و کیفی کلیت چارچوب مفهومی
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    لطفاً پیش از ارزیابی تفصیلی سازه‌ها، دیدگاه کل‌نگر خود را درباره انسجام، پوشش، سازگاری و سودمندی کلیت چارچوب با مقیاس ۱ تا ۵ (۱=خیلی کم، ۵=خیلی زیاد) مشخص فرمایید:
                  </p>
                </div>

                {/* Overall Framework Ratings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'conceptualCoherence', label: 'انسجام مفهومی و همگرایی ساختاری چارچوب', desc: 'میزان ارتباط منطقی و هم‌افزایی میان ابعاد و اجزای چارچوب' },
                    { key: 'domainCoverage', label: 'کفایت پوشش دامنه موضوعی', desc: 'پوشش ابعاد روانشناختی، فنی، بازاری و رگولاتوری بدون نقص عمده' },
                    { key: 'constructCompleteness', label: 'جامعیت مضامین و سازه‌های احصاشده', desc: 'کفایت سازه‌های استخراج‌شده برای تبیین پدیده سرمایه‌گذاری الگوریتمی' },
                    { key: 'dimensionConsistency', label: 'سازگاری ابعاد STS و HDS', desc: 'انطباق تلفیق سیستم‌های فنی-اجتماعی و انسانی-سازمانی' },
                    { key: 'relationshipPlausibility', label: 'معقولیت روابط علی و سیستمی', desc: 'قابلیت دفاع تجربی و منطقی روابط ۷گانه استخراج‌شده' },
                    { key: 'practicalUsefulness', label: 'سودمندی کاربردی برای صنعت و سیاست‌گذاری', desc: 'توانایی چارچوب در ارائه بینش‌های عملیاتی به تصمیم‌گیران' },
                  ].map((item) => {
                    const currentVal = (state.overallValidation.ratings as any)?.[item.key];
                    return (
                      <div key={item.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-black text-slate-900">{item.label}</span>
                          <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                            currentVal ? 'text-blue-700 bg-blue-100 font-black' : 'text-slate-400 bg-slate-200/70'
                          }`}>
                            {currentVal ? `${currentVal} از ۵` : 'انتخاب نشده'}
                          </span>
                        </div>
                        <p className="text-[0.7rem] text-slate-500 leading-relaxed">{item.desc}</p>
                        <div className="flex items-center gap-1.5 pt-1">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                setState((prev) => ({
                                  ...prev,
                                  overallValidation: {
                                    ...prev.overallValidation,
                                    ratings: {
                                      ...prev.overallValidation.ratings,
                                      [item.key]: num,
                                    },
                                  },
                                  lastSavedAt: new Date().toISOString(),
                                }));
                              }}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                currentVal === num
                                  ? 'bg-blue-600 text-white font-black shadow-xs'
                                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Qualitative Reflections */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs md:text-sm font-black text-slate-900">
                    دیدگاه‌های کیفی پیرامون کلیت چارچوب:
                  </h4>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        ۱. مهم‌ترین نقطه قوت یا مزیت تمایزبخش این چارچوب مفهومی چیست؟
                      </label>
                      <textarea
                        rows={2}
                        value={state.overallValidation.q1OmittedDimension || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setState((prev) => ({
                            ...prev,
                            overallValidation: { ...prev.overallValidation, q1OmittedDimension: val },
                            lastSavedAt: new Date().toISOString(),
                          }));
                        }}
                        placeholder="دیدگاه خود را اینجا یادداشت فرمایید..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        ۲. آیا در این چارچوب همپوشانی زائد، ابهام ساختاری یا رابطه غیرقابل‌قبولی ملاحظه می‌فرمایید؟
                      </label>
                      <textarea
                        rows={2}
                        value={state.overallValidation.q2Redundancies || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setState((prev) => ({
                            ...prev,
                            overallValidation: { ...prev.overallValidation, q2Redundancies: val },
                            lastSavedAt: new Date().toISOString(),
                          }));
                        }}
                        placeholder="در صورت وجود توضیح دهید..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section B: Construct-by-Construct Detailed Quantitative Validation */}
              <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 font-mono">بخش ب</span>
                    <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      ارزیابی کمّی تک‌تک سازه‌ها (Construct-Level Validation)
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900">
                    اعتبارسنجی تک‌تک سازه‌ها، ابعاد و روابط چارچوب پایه
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    برای هر سازه، لطفاً تصمیم نهایی (پذیرش/اصلاح/رد)، نمرات ابعاد ۶گانه (وضوح، اهمیت، توجیه، کاربردپذیری و تمایز) را تعیین فرمایید:
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: 'همه سازه‌ها' },
                      { id: 'dimensions', label: 'ابعاد ۴گانه (HDs)' },
                      { id: 'themes', label: 'مضامین ۷گانه (STs)' },
                      { id: 'relationships', label: 'روابط سیستمی (Rs)' },
                      { id: 'paradoxes', label: 'پارادوکس‌ها (Ps)' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setConstructFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          constructFilter === f.id
                            ? 'bg-blue-600 text-white shadow-xs font-black'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-slate-500 font-mono">
                    پیشرفت ارزیابی: <strong className="text-blue-600">{assessedCount}</strong> از {totalConstructs}
                  </div>
                </div>

                {/* Construct Cards List */}
                <div className="space-y-4">
                  {filteredConstructs.map((construct) => {
                    const rawAssessment = state.constructAssessments[construct.id];
                    const assessment = rawAssessment || {
                      constructId: construct.id,
                      decision: '' as any,
                      ratings: {},
                      confidence: 0,
                      explanation: '',
                      lastUpdated: '',
                    };
                    const hasDecision = Boolean(rawAssessment && rawAssessment.decision);

                    const isExpanded = expandedConstructId === construct.id;

                    return (
                      <div
                        key={construct.id}
                        className={`rounded-2xl border transition shadow-xs ${
                          isExpanded
                            ? 'border-blue-400 bg-blue-50/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {/* Header Bar */}
                        <div
                          onClick={() => setExpandedConstructId(isExpanded ? null : construct.id)}
                          className="p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-xl bg-slate-900 text-amber-300 font-mono font-black text-xs">
                              {construct.code}
                            </span>
                            <div>
                              <div className="font-black text-slate-900 text-sm md:text-base flex items-center gap-2">
                                <span>{construct.nameFa}</span>
                                <span className="text-xs text-slate-400 font-serif font-normal dir-ltr hidden sm:inline">
                                  ({construct.nameEn})
                                </span>
                              </div>
                              <div className="text-[0.7rem] text-slate-500">{construct.categoryLabelFa}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {hasDecision ? (
                              <span
                                className={`px-3 py-1 rounded-xl text-xs font-bold ${
                                  assessment.decision === 'accept_as_is'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : assessment.decision === 'accept_with_modifications'
                                    ? 'bg-amber-100 text-amber-800'
                                    : assessment.decision === 'reject'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {assessment.decision === 'accept_as_is'
                                  ? 'پذیرش قطعی'
                                  : assessment.decision === 'accept_with_modifications'
                                  ? 'پذیرش با اصلاح'
                                  : assessment.decision === 'reject'
                                  ? 'رد سازه'
                                  : 'عدم امکان ارزیابی'}
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                هنوز ارزیابی نشده
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Assessment Controls */}
                        {isExpanded && (
                          <div className="p-5 border-t border-blue-200/60 bg-white rounded-b-2xl space-y-5 animate-in fade-in">
                            {/* Operational Definition */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                              <span className="font-black text-slate-700">تعریف عملیاتی / مفهومی در ادبیات پایه:</span>
                              <p className="text-slate-600 leading-relaxed text-justify">{construct.definitionFa}</p>
                            </div>

                            {/* Four-Option Decision */}
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-800">
                                ۱. تصمیم کلی شما درباره این سازه در چارچوب مفهومی:
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  { id: 'accept_as_is', label: 'پذیرش همان‌گونه که هست', color: 'emerald' },
                                  { id: 'accept_with_modifications', label: 'پذیرش مشروط به اصلاح', color: 'amber' },
                                  { id: 'reject', label: 'رد و حذف از چارچوب', color: 'rose' },
                                  { id: 'unable_to_assess', label: 'عدم امکان ارزیابی', color: 'slate' },
                                ].map((opt) => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() =>
                                      handleUpdateConstructAssessment(construct.id, (prev) => ({
                                        ...prev,
                                        decision: opt.id as any,
                                      }))
                                    }
                                    className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                      assessment.decision === opt.id
                                        ? opt.color === 'emerald'
                                          ? 'bg-emerald-600 text-white font-black shadow-xs'
                                          : opt.color === 'amber'
                                          ? 'bg-amber-600 text-white font-black shadow-xs'
                                          : opt.color === 'rose'
                                          ? 'bg-rose-600 text-white font-black shadow-xs'
                                          : 'bg-slate-700 text-white font-black shadow-xs'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                  >
                                    <span>{opt.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 6-Dimension Likert Ratings */}
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-800">
                                ۲. امتیازدهی به معیارهای شش‌گانه سازه (۱=خیلی کم تا ۵=خیلی زیاد):
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                  { key: 'conceptualClarity', label: 'وضوح مفهومی' },
                                  { key: 'relevanceToProblem', label: 'ارتباط با مسئله' },
                                  { key: 'theoreticalJustification', label: 'توجیه نظری' },
                                  { key: 'applicabilityToIran', label: 'کاربردپذیری در ایران' },
                                  { key: 'importanceForPhenomenon', label: 'اهمیت در پدیده' },
                                  { key: 'distinctiveness', label: 'تمایز از سایر سازه‌ها' },
                                ].map((dim) => {
                                  const ratingVal = (assessment.ratings as any)?.[dim.key];
                                  return (
                                    <div key={dim.key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                      <div className="flex justify-between items-center text-[0.72rem]">
                                        <span className="font-bold text-slate-700">{dim.label}</span>
                                        <span className={`font-mono font-bold ${ratingVal ? 'text-blue-600' : 'text-slate-400'}`}>
                                          {ratingVal ?? '—'}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                          <button
                                            key={val}
                                            type="button"
                                            onClick={() =>
                                              handleUpdateConstructAssessment(construct.id, (prev) => ({
                                                ...prev,
                                                ratings: { ...prev.ratings, [dim.key]: val },
                                              }))
                                            }
                                            className={`flex-1 py-1 rounded text-[0.7rem] font-bold transition cursor-pointer ${
                                              ratingVal === val
                                                ? 'bg-blue-600 text-white font-black'
                                                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                                            }`}
                                          >
                                            {val}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Qualitative Explanations */}
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-800">
                                ۳. توضیحات کیفی، دلایل پذیرش/رد یا پیشنهاد اصلاحی:
                              </label>
                              <textarea
                                rows={2}
                                value={assessment.explanation || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleUpdateConstructAssessment(construct.id, (prev) => ({
                                    ...prev,
                                    explanation: val,
                                  }));
                                }}
                                placeholder="توضیح دلایل یا پیشنهاد اصلاح عنوان / تعریف این سازه..."
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Sub-tab footer buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setStep('profile')}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>مرحله قبل (مشخصات خبره)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setQuantSubTab('dematel');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <span>بخش بعدی: ماتریس علّی دیمتل (DEMATEL)</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SUB-TAB 2: DEMATEL DIRECT INFLUENCE DATA COLLECTION (گردآوری داده‌های ماتریس دیمتل)
          ========================================================================= */}
          {quantSubTab === 'dematel' && (
            <div className="space-y-6 animate-in fade-in">
              {/* DEMATEL Introduction & Explanation Card */}
              <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 font-mono">ماژول تصمیم‌گیری چندمعیاره (MCDM)</span>
                      <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                        گردآوری داده‌های خبرگی برای روش دیمتل (DEMATEL Data Collection)
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900">
                      ماتریس ارزیابی و گردآوری شدت اثرگذاری مستقیم ابعاد چارچوب (DEMATEL)
                    </h3>
                  </div>

                  {/* Actions: Clear */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClearDematel}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>پاکسازی ماتریس (شروع مجدد)</span>
                    </button>
                  </div>
                </div>

                {/* Research Ethics & Data Collection Disclaimer Box */}
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs leading-relaxed space-y-2 text-justify">
                  <div className="flex items-center gap-2 font-black text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>ملاحظات روش‌شناختی: گردآوری مستقل داده‌های خبرگی بدون نمایش سوگیرانه خروجی‌ها</span>
                  </div>
                  <p>
                    این سامانه منحصراً برای <strong>گردآوری داده‌های خام خبرگی (Expert Elicitation)</strong> طراحی گردیده است. به‌منظور جلوگیری از سوگیری شناختی (Cognitive Bias) و اثر هاله (Halo Effect) بر ارزیابی آزادانه و مستقل شما، محاسبات ریاضیاتی (ماتریس روابط کل، آستانه اثرگذاری، نقش علّی و معلولی و نمودار دکارتی) پس از اتمام فاز گردآوری داده‌ها از کل پنل خبرگان در نرم‌افزار تخصصی محاسبه خواهد شد و در این صفحه هیچ‌گونه نتایج تحلیلی از پیش محاسبه‌شده نمایش داده نمی‌شود.
                  </p>
                </div>

                {/* Progress Tracker */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <span>وضعیت تکمیل ماتریس اثرات مستقیم:</span>
                      <span className="font-mono font-black text-indigo-700 text-sm">
                        {dematelFilledCount} از ۱۲ رابطه اثرگذاری
                      </span>
                      <span className="text-[0.7rem] font-bold text-slate-500">
                        ({Math.round((dematelFilledCount / 12) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full sm:w-64 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(dematelFilledCount / 12) * 100}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-[0.72rem] text-slate-500">
                    {dematelFilledCount === 12
                      ? '✓ تمام ۱۲ خانه ماتریس با موفقیت تکمیل شده است.'
                      : `${12 - dematelFilledCount} خانه هنوز مقداردهی نشده است.`}
                  </span>
                </div>

                {/* Scale Guide */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-black text-slate-800 block">
                    راهنمای مقیاس پنج‌درجه‌ای دیمتل (۰ تا ۴):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[0.72rem]">
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <div className="font-mono font-black text-slate-700 text-sm">۰</div>
                      <div className="font-bold text-slate-600">بدون اثرگذاری</div>
                    </div>
                    <div className="p-2 rounded-xl bg-sky-50 border border-sky-200">
                      <div className="font-mono font-black text-sky-700 text-sm">۱</div>
                      <div className="font-bold text-sky-800">اثرگذاری کم</div>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="font-mono font-black text-blue-700 text-sm">۲</div>
                      <div className="font-bold text-blue-800">اثرگذاری متوسط</div>
                    </div>
                    <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200">
                      <div className="font-mono font-black text-indigo-700 text-sm">۳</div>
                      <div className="font-bold text-indigo-800">اثرگذاری زیاد</div>
                    </div>
                    <div className="p-2 rounded-xl bg-purple-50 border border-purple-200">
                      <div className="font-mono font-black text-purple-700 text-sm">۴</div>
                      <div className="font-bold text-purple-800">اثر بسیار شدید</div>
                    </div>
                  </div>
                  <p className="text-[0.68rem] text-slate-500 pt-1">
                    * قطرهای اصلی ماتریس (اثر بعد بر خود) بر مبنای منطق ریاضی دیمتل همواره برابر ۰ و ثابت است.
                  </p>
                </div>

                {/* 4x4 Direct Matrix Interactive Grid */}
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white text-xs">
                        <th className="p-3 rounded-tr-2xl text-slate-200 font-bold text-right">
                          ابعاد مبداء اثرگذاری (سطر) ⟶ ابعاد مقصد اثرپذیری (ستون)
                        </th>
                        {DEMATEL_DIMENSION_NAMES.map((d) => (
                          <th key={d.code} className="p-3 text-center font-black">
                            <div className="font-mono text-amber-300">{d.code}</div>
                            <div className="text-[0.65rem] text-slate-300 font-normal">{d.labelFa.split('(')[0]}</div>
                          </th>
                        ))}
                        <th className="p-3 text-center font-bold text-indigo-300 bg-slate-800 rounded-tl-2xl">
                          تعداد تکمیل‌شده سطر
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      {DEMATEL_DIMENSION_NAMES.map((rowDim, rIdx) => {
                        let completedInRow = 0;
                        for (let c = 0; c < 4; c++) {
                          if (rIdx !== c && currentDematelMatrix[rIdx]?.[c] !== null && currentDematelMatrix[rIdx]?.[c] !== undefined) {
                            completedInRow++;
                          }
                        }

                        return (
                          <tr key={rowDim.code} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5 font-bold text-slate-900 border-l border-slate-200 bg-slate-50/50">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-black">
                                  {rowDim.code}
                                </span>
                                <div>
                                  <div className="font-black text-slate-800">{rowDim.labelFa}</div>
                                  <div className="text-[0.65rem] text-slate-400 font-serif dir-ltr text-right">{rowDim.labelEn}</div>
                                </div>
                              </div>
                            </td>

                            {DEMATEL_DIMENSION_NAMES.map((colDim, cIdx) => {
                              const isDiagonal = rIdx === cIdx;
                              const currentVal = currentDematelMatrix[rIdx]?.[cIdx];
                              const isUnfilled = currentVal === null || currentVal === undefined;

                              if (isDiagonal) {
                                return (
                                  <td key={colDim.code} className="p-3 text-center bg-slate-100 border border-slate-200">
                                    <div className="font-mono font-bold text-slate-400 text-xs">۰</div>
                                    <div className="text-[0.6rem] text-slate-400">(اثر بر خود)</div>
                                  </td>
                                );
                              }

                              return (
                                <td key={colDim.code} className={`p-2.5 text-center border border-slate-200 ${isUnfilled ? 'bg-amber-50/30' : 'bg-white'}`}>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-center gap-1">
                                      {[0, 1, 2, 3, 4].map((v) => (
                                        <button
                                          key={v}
                                          type="button"
                                          onClick={() => handleUpdateDematelCell(rIdx, cIdx, v)}
                                          title={`اثر ${rowDim.code} بر ${colDim.code}: ${v}`}
                                          className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                                            currentVal === v
                                              ? v === 0
                                                ? 'bg-slate-700 text-white font-black shadow-xs'
                                                : v === 1
                                                ? 'bg-sky-500 text-white font-black shadow-xs'
                                                : v === 2
                                                ? 'bg-blue-600 text-white font-black shadow-xs'
                                                : v === 3
                                                ? 'bg-indigo-600 text-white font-black shadow-xs'
                                                : 'bg-purple-700 text-white font-black shadow-xs'
                                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                          }`}
                                        >
                                          {v}
                                        </button>
                                      ))}
                                    </div>
                                    <div className="text-[0.62rem] text-slate-400 font-mono">
                                      {isUnfilled ? (
                                        <span className="text-amber-600 font-sans font-bold">انتخاب نشده</span>
                                      ) : (
                                        <span>ثبت شده: {currentVal}</span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              );
                            })}

                            <td className="p-3 text-center font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200">
                              <span className={completedInRow === 3 ? 'text-emerald-700 font-black' : 'text-slate-500'}>
                                {completedInRow} از ۳
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Qualitative Notes on DEMATEL */}
              <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-3">
                <label className="text-xs font-black text-slate-900 block">
                  تحلیل و یادداشت‌های تفسیری خبره پیرامون روابط اثرگذاری مستقیم دیمتل:
                </label>
                <textarea
                  rows={3}
                  value={state.dematelNotes || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setState((prev) => ({
                      ...prev,
                      dematelNotes: val,
                      lastSavedAt: new Date().toISOString(),
                    }));
                  }}
                  placeholder="اگر در خصوص شدت اثرگذاری مستقیم میان ابعاد ۴گانه، تقدم علّی یا روابط تعاملی دیدگاه یا نکته خاصی دارید، مرقوم فرمایید..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500"
                />
              </div>

              {/* Sub-tab footer buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setQuantSubTab('validation');
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>بازگشت به اعتبارسنجی سازه‌ها</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQuantSubTab('anp');
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>بخش بعدی: پرسشنامه تحلیل شبکه (ANP)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              SUB-TAB 3: ANP PAIRWISE DATA COLLECTION (گردآوری داده‌های مقایسات زوجی تحلیل شبکه)
          ========================================================================= */}
          {quantSubTab === 'anp' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Introduction Card */}
              <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-600 font-mono">ماژول تصمیم‌گیری ساختار شبکه (ANP)</span>
                      <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                        گردآوری مقایسه‌های زوجی (Analytic Network Process Elicitation)
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900">
                      پرسشنامه مقایسه‌های زوجی اولویت‌بندی ابعاد در فرآیند تحلیل شبکه (ANP)
                    </h3>
                  </div>

                  {/* Actions: Clear */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClearPairwise}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>پاکسازی مقایسه‌ها (شروع مجدد)</span>
                    </button>
                  </div>
                </div>

                {/* Research Ethics & Data Collection Disclaimer Box */}
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs leading-relaxed space-y-2 text-justify">
                  <div className="flex items-center gap-2 font-black text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>ملاحظات روش‌شناختی: گردآوری داده‌های قضاوتی بدون ارائه نتایج ریاضیاتی زودهنگام</span>
                  </div>
                  <p>
                    این بخش صرفاً به‌منظور <strong>گردآوری قضاوت‌های ترجیحی خبرگان (Pairwise Data Elicitation)</strong> طراحی گردیده است. مطابق با اصول متدولوژی ANP، تشکیل سوپرماتریس ناموزون، سوپرماتریس موزون تصادفی، سوپرماتریس حد (Limit Supermatrix) و استخراج بردار اوزان نهایی، پس از تجمیع پاسخ‌های کلیه خبرگان پنل در نرم‌افزار تحلیلی استخراج خواهد شد تا از هرگونه سوگیری شناختی ممانعت به عمل آید.
                  </p>
                </div>

                {/* Progress Tracker */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <span>وضعیت تکمیل مقایسه‌های زوجی:</span>
                      <span className="font-mono font-black text-purple-700 text-sm">
                        {anpFilledCount} از ۶ جفت مقایسه
                      </span>
                      <span className="text-[0.7rem] font-bold text-slate-500">
                        ({Math.round((anpFilledCount / 6) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full sm:w-64 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(anpFilledCount / 6) * 100}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-[0.72rem] text-slate-500">
                    {anpFilledCount === 6
                      ? '✓ تمام ۶ مقایسه زوجی با موفقیت تکمیل شده است.'
                      : `${6 - anpFilledCount} مقایسه هنوز ثبت نشده است.`}
                  </span>
                </div>

                {/* Saaty Scale Guide */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-black text-slate-800 block">
                    راهنمای مقیاس ترجیحات ساعتی (Saaty Fundamental Scale):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[0.72rem]">
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <div className="font-mono font-black text-purple-700 text-sm">۱</div>
                      <div className="font-bold text-slate-700">اهمیت یکسان و برابر</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <div className="font-mono font-black text-purple-700 text-sm">۳</div>
                      <div className="font-bold text-slate-700">اهمیت تا حدی بیشتر</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <div className="font-mono font-black text-purple-700 text-sm">۵</div>
                      <div className="font-bold text-slate-700">اهمیت زیاد و قوی</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <div className="font-mono font-black text-purple-700 text-sm">۷</div>
                      <div className="font-bold text-slate-700">اهمیت خیلی زیاد</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <div className="font-mono font-black text-purple-700 text-sm">۹</div>
                      <div className="font-bold text-slate-700">اهمیت مطلق و مفرط</div>
                    </div>
                  </div>
                  <p className="text-[0.68rem] text-slate-500 pt-1">
                    * اعداد ۲، ۴، ۶ و ۸ ارزش‌های بینابینی میان ترجیحات فوق می‌باشند.
                  </p>
                </div>
              </div>

              {/* Saaty Pairwise Comparison Inputs (6 Pairs) */}
              <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4 space-y-1">
                  <h4 className="text-base font-black text-slate-900">
                    پرسش‌های مقایسه زوجی میان ابعاد ۴گانه چارچوب (۶ جفت رابطه)
                  </h4>
                  <p className="text-xs text-slate-600">
                    برای هر جفت از ابعاد، تعیین فرمایید در شکل‌گیری و هدایت تحول سرمایه‌گذاری الگوریتمی، کدام بُعد نقش اولویت‌دار و وزن بالاتری دارد و شدت این برتری چقدر است:
                  </p>
                </div>

                {/* 6 Pairwise Rows */}
                <div className="space-y-4">
                  {[
                    {
                      key: 'HD1_HD2',
                      codeA: 'HD1',
                      titleA: 'روانشناسی سرمایه‌گذار، اعتماد و ریسک',
                      descA: 'کالیبراسیون اعتماد، سوگیری‌های رفتاری و ریسک ادراک‌شده',
                      codeB: 'HD2',
                      titleB: 'معماری تصمیم و تعامل انسان-الگوریتم',
                      descB: 'مدل‌های هیبرید، تفویض اختیار و واسط‌های شناختی',
                    },
                    {
                      key: 'HD1_HD3',
                      codeA: 'HD1',
                      titleA: 'روانشناسی سرمایه‌گذار، اعتماد و ریسک',
                      descA: 'کالیبراسیون اعتماد، سوگیری‌های رفتاری و ریسک ادراک‌شده',
                      codeB: 'HD3',
                      titleB: 'تحول واسطه‌گری و ساختار بازار',
                      descB: 'پلتفرم‌سازی، بازواسطه‌گری و دسترسی دموکراتیک',
                    },
                    {
                      key: 'HD1_HD4',
                      codeA: 'HD1',
                      titleA: 'روانشناسی سرمایه‌گذار، اعتماد و ریسک',
                      descA: 'کالیبراسیون اعتماد، سوگیری‌های رفتاری و ریسک ادراک‌شده',
                      codeB: 'HD4',
                      titleB: 'حکمرانی الگوریتمی و چارچوب‌های هنجاری',
                      descB: 'رگولاتوری تطبیقی، پاسخگویی الگوریتم و اخلاق فناوری',
                    },
                    {
                      key: 'HD2_HD3',
                      codeA: 'HD2',
                      titleA: 'معماری تصمیم و تعامل انسان-الگوریتم',
                      descA: 'مدل‌های هیبرید، تفویض اختیار و واسط‌های شناختی',
                      codeB: 'HD3',
                      titleB: 'تحول واسطه‌گری و ساختار بازار',
                      descB: 'پلتفرم‌سازی، بازواسطه‌گری و دسترسی دموکراتیک',
                    },
                    {
                      key: 'HD2_HD4',
                      codeA: 'HD2',
                      titleA: 'معماری تصمیم و تعامل انسان-الگوریتم',
                      descA: 'مدل‌های هیبرید، تفویض اختیار و واسط‌های شناختی',
                      codeB: 'HD4',
                      titleB: 'حکمرانی الگوریتمی و چارچوب‌های هنجاری',
                      descB: 'رگولاتوری تطبیقی، پاسخگویی الگوریتم و اخلاق فناوری',
                    },
                    {
                      key: 'HD3_HD4',
                      codeA: 'HD3',
                      titleA: 'تحول واسطه‌گری و ساختار بازار',
                      descA: 'پلتفرم‌سازی، بازواسطه‌گری و دسترسی دموکراتیک',
                      codeB: 'HD4',
                      titleB: 'حکمرانی الگوریتمی و چارچوب‌های هنجاری',
                      descB: 'رگولاتوری تطبیقی، پاسخگویی الگوریتم و اخلاق فناوری',
                    },
                  ].map((pair, pIdx) => {
                    const cur = pairwiseState[pair.key];
                    const isAnswered = Boolean(cur && cur.side && (cur.side === 'Equal' || cur.intensity));

                    return (
                      <div
                        key={pair.key}
                        className={`p-5 rounded-2xl border transition space-y-4 ${
                          isAnswered
                            ? 'bg-purple-50/20 border-purple-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {/* Pair Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                              {pIdx + 1}
                            </span>
                            <span className="font-black text-slate-800 text-xs md:text-sm">
                              مقایسه زوجی جفت {pIdx + 1}
                            </span>
                          </div>

                          <div>
                            {isAnswered ? (
                              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[0.7rem] flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>
                                  {cur.side === 'Equal'
                                    ? 'ثبت شد: اهمیت یکسان (۱)'
                                    : `ثبت شد: ترجیح ${cur.side === 'A' ? pair.codeA : pair.codeB} با شدت ${cur.intensity || 1}`}
                                </span>
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-xl bg-slate-200 text-slate-600 font-bold text-[0.7rem]">
                                هنوز انتخاب نشده
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dimensions Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Dim A */}
                          <div className={`p-3.5 rounded-xl border transition ${
                            cur?.side === 'A'
                              ? 'bg-blue-100/60 border-blue-400'
                              : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-600 text-white font-black">
                                {pair.codeA}
                              </span>
                              <span className="font-black text-slate-900">{pair.titleA}</span>
                            </div>
                            <p className="text-[0.7rem] text-slate-500 pt-1 leading-relaxed">{pair.descA}</p>
                          </div>

                          {/* Dim B */}
                          <div className={`p-3.5 rounded-xl border transition ${
                            cur?.side === 'B'
                              ? 'bg-purple-100/60 border-purple-400'
                              : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-700 text-white font-black">
                                {pair.codeB}
                              </span>
                              <span className="font-black text-slate-900">{pair.titleB}</span>
                            </div>
                            <p className="text-[0.7rem] text-slate-500 pt-1 leading-relaxed">{pair.descB}</p>
                          </div>
                        </div>

                        {/* Choice Controls */}
                        <div className="space-y-3 pt-1">
                          <label className="text-[0.72rem] font-bold text-slate-700 block">
                            کدام بُعد در اولویت است؟
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {/* Option: A is more important */}
                            <button
                              type="button"
                              onClick={() => handleUpdatePairwise(pair.key, 'A', cur?.intensity && cur.intensity > 1 ? cur.intensity : 3)}
                              className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                cur?.side === 'A'
                                  ? 'bg-blue-600 text-white font-black shadow-xs'
                                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>ترجیح با {pair.codeA}</span>
                            </button>

                            {/* Option: Equal */}
                            <button
                              type="button"
                              onClick={() => handleUpdatePairwise(pair.key, 'Equal', 1)}
                              className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                cur?.side === 'Equal'
                                  ? 'bg-slate-800 text-white font-black shadow-xs'
                                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>اهمیت برابر و یکسان (۱)</span>
                            </button>

                            {/* Option: B is more important */}
                            <button
                              type="button"
                              onClick={() => handleUpdatePairwise(pair.key, 'B', cur?.intensity && cur.intensity > 1 ? cur.intensity : 3)}
                              className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                cur?.side === 'B'
                                  ? 'bg-purple-700 text-white font-black shadow-xs'
                                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>ترجیح با {pair.codeB}</span>
                            </button>
                          </div>

                          {/* Intensity Selector if side is A or B */}
                          {cur && (cur.side === 'A' || cur.side === 'B') && (
                            <div className="p-3 rounded-xl bg-white border border-slate-300 space-y-2 animate-in fade-in">
                              <div className="flex justify-between items-center text-[0.72rem]">
                                <span className="font-bold text-slate-700">
                                  شدت برتری و اهمیت ترجیحی {cur.side === 'A' ? pair.codeA : pair.codeB} را تعیین فرمایید:
                                </span>
                                <span className="font-mono font-black text-purple-700 text-xs">
                                  شدت: {cur.intensity || 1}
                                </span>
                              </div>

                              <div className="grid grid-cols-5 sm:grid-cols-9 gap-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => handleUpdatePairwise(pair.key, cur.side!, lvl)}
                                    className={`py-2 rounded-lg text-xs font-mono font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                                      cur.intensity === lvl
                                        ? 'bg-purple-700 text-white font-black shadow-xs'
                                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span>{lvl}</span>
                                    <span className="text-[0.55rem] font-sans">
                                      {lvl === 1 ? 'برابر' : lvl === 3 ? 'کم' : lvl === 5 ? 'قوی' : lvl === 7 ? 'خیلی' : lvl === 9 ? 'مطلق' : ''}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Qualitative Notes on ANP */}
              <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-3">
                <label className="text-xs font-black text-slate-900 block">
                  تحلیل و یادداشت‌های کیفی خبره پیرامون اولویت‌بندی شبکه (ANP):
                </label>
                <textarea
                  rows={3}
                  value={state.anpNotes || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setState((prev) => ({
                      ...prev,
                      anpNotes: val,
                      lastSavedAt: new Date().toISOString(),
                    }));
                  }}
                  placeholder="دیدگاه تحلیلی شما در خصوص تقدم و تاخر ابعاد ۴گانه، اولویت‌های استراتژیک و نحوه توازن میان حکمرانی، معماری و اعتماد..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-purple-500"
                />
              </div>

              {/* Sub-tab footer buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setQuantSubTab('dematel');
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>بازگشت به ماتریس دیمتل</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('oral')}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>ورود به مرحله بعد: دریافت اطلاعات شفاهی</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STEP 4: ORAL FEEDBACK & VOICE INPUT (دریافت اطلاعات و بازخوردهای شفاهی)
      ========================================================================= */}
      {activeStep === 'oral' && (
        <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-600 font-mono">گام چهارم پژوهش</span>
              <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                دریافت اطلاعات شفاهی با هوش مصنوعی (Oral Feedback)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              ثبت استدلال‌ها، بازخوردهای گفتاری و یادداشت‌های شفاهی
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              برخی از عمیق‌ترین بینش‌های نخبگانی در قالب گفتار شفاهی بهتر از متون کوتاه منتقل می‌شوند. می‌توانید با استفاده از میکروفون، صوت خود را ضبط فرمایید؛ هوش مصنوعی آن را فوراً به متن فارسی پیاده‌سازی می‌نماید، یا نکات گفتگوی جلسه متمرکز را در کادرها تایپ نمایید:
            </p>
          </div>

          {/* 4 Oral Topics */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'strengths', label: '۱. نقاط قوت و روایی کلی چارچوب' },
              { id: 'paradoxes_debate', label: '۲. بحث پیرامون تعارض‌ها و پارادوکس‌ها' },
              { id: 'mechanisms', label: '۳. سازوکارهای روابط علّی انسان-الگوریتم' },
              { id: 'iran_meeting', label: '۴. جمع‌بندی بیانات شفاهی در جلسه خبرگی' },
            ].map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setActiveOralTopic(topic.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeOralTopic === topic.id
                    ? 'bg-purple-700 text-white shadow-sm font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Active Oral Topic Input Area */}
          <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 text-xs md:text-sm">
                موضوع فعال:{' '}
                {activeOralTopic === 'strengths'
                  ? 'نقاط قوت و روایی کلی چارچوب فراتحلیل'
                  : activeOralTopic === 'paradoxes_debate'
                  ? 'بحث و استدلال پیرامون پارادوکس‌های دیالکتیکی'
                  : activeOralTopic === 'mechanisms'
                  ? 'تحلیل سازوکارهای روابط میان انسان و الگوریتم'
                  : 'جمع‌بندی بیانات شفاهی در جلسه خبرگی'}
              </span>
              <span className="text-[0.7rem] text-purple-700 font-bold flex items-center gap-1">
                <Mic className="w-3.5 h-3.5" />
                قابلیت ضبط صوت زنده
              </span>
            </div>

            {/* Smart Voice Input with Gemini API */}
            <VoiceAnswerInput
              questionId={`oral_${activeOralTopic}`}
              questionTitle={
                activeOralTopic === 'strengths'
                  ? 'نقاط قوت و روایی کلی چارچوب مفهومی'
                  : activeOralTopic === 'paradoxes_debate'
                  ? 'بحث و تحلیل پارادوکس‌های دیالکتیکی چارچوب'
                  : activeOralTopic === 'mechanisms'
                  ? 'سازوکارهای روابط علّی انسان-الگوریتم'
                  : 'جمع‌بندی مباحث مطروحه در جلسه خبرگی'
              }
              questionText="لطفاً با کلیک بر روی میکروفون صحبت بفرمایید (هوش مصنوعی بلادرنگ متن فارسی را پیاده‌سازی می‌کند) یا در کادر زیر تایپ فرمایید:"
              currentAnswer={{
                refinedText: state.oralFeedback?.[activeOralTopic]?.refinedText || '',
                rawTranscript: state.oralFeedback?.[activeOralTopic]?.rawTranscript || '',
              }}
              onUpdateAnswer={(ans) => {
                const textVal = ans.refinedText || '';
                setState((prev) => ({
                  ...prev,
                  oralFeedback: {
                    ...prev.oralFeedback,
                    [activeOralTopic]: {
                      topicId: activeOralTopic,
                      topicTitleFa: activeOralTopic,
                      refinedText: textVal,
                      rawTranscript: ans.rawTranscript || '',
                      lastUpdated: new Date().toISOString(),
                    },
                  },
                  lastSavedAt: new Date().toISOString(),
                }));
              }}
            />
          </div>

          {/* Stepper buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStep('quantitative')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>مرحله قبل (ارزیابی کمّی چارچوب)</span>
            </button>

            <button
              type="button"
              onClick={() => setStep('iran')}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <span>ورود به مرحله بعد: چارچوب بومی ایران</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 5: IRAN-SPECIFIC FRAMEWORK (تدوین و اعتبارسنجی چارچوب بومی ایران)
      ========================================================================= */}
      {activeStep === 'iran' && (
        <div className="space-y-6">
          {/* Section A: 10 Contextual Prompts */}
          <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 font-mono">گام پنجم پژوهش</span>
                <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  بومی‌سازی چارچوب بر اساس واقعیات اکوسیستم ایران
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                ارزیابی عوامل بافتاری و شرایط نهادی، اقتصادی و رگولاتوری ایران
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                ۱۰ عامل زمینه‌ای زیر به عنوان پیش‌ران‌ها یا موانع اکوسیستم فین‌تک ایران تعریف شده‌اند. لطفاً میزان تأثیر و مکانیسم عمل آن‌ها را ارزیابی فرمایید:
              </p>
            </div>

            {/* Factors Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {IRAN_EXPLORATORY_PROMPTS.map((prompt, idx) => (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => setActiveFactorIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeFactorIndex === idx
                      ? 'bg-amber-600 text-white shadow-xs font-black'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{prompt.id}: {prompt.titleFa.split(' ')[0]}...</span>
                </button>
              ))}
            </div>

            {/* Active Factor Detail */}
            {(() => {
              const currentPrompt = IRAN_EXPLORATORY_PROMPTS[activeFactorIndex];
              const factorState = state.contextualFactors[currentPrompt.id] || {
                factorId: currentPrompt.id,
                promptTopic: currentPrompt.titleFa,
                description: '',
                mechanism: '',
                theoreticalRole: 'contextual_condition',
                supportingRationale: '',
                expectedDirection: 'conditional',
                confidence: 4,
                isActive: true,
              };

              return (
                <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-amber-900 text-amber-200 font-mono font-black text-xs">
                      {currentPrompt.id}
                    </span>
                    <span className="text-xs font-serif text-slate-500 dir-ltr">{currentPrompt.titleEn}</span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base">{currentPrompt.titleFa}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">{currentPrompt.descriptionFa}</p>

                  {/* Probing questions list */}
                  {currentPrompt.probingQuestionsFa && currentPrompt.probingQuestionsFa.length > 0 && (
                    <div className="p-3 rounded-xl bg-white border border-amber-200/80 space-y-1 text-xs">
                      <span className="font-bold text-amber-900">پرسش‌های هدایت‌کننده ارزیابی:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[0.72rem]">
                        {currentPrompt.probingQuestionsFa.map((q, qIdx) => (
                          <li key={qIdx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-800">
                      سازوکار و نحوه اثرگذاری این عامل در چارچوب بومی فین‌تک ایران:
                    </label>
                    <textarea
                      rows={3}
                      value={factorState.mechanism || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setState((prev) => ({
                          ...prev,
                          contextualFactors: {
                            ...prev.contextualFactors,
                            [currentPrompt.id]: {
                              ...factorState,
                              mechanism: val,
                            },
                          },
                          lastSavedAt: new Date().toISOString(),
                        }));
                      }}
                      placeholder="این عامل چگونه روابط چارچوب را در ایران تغییر می‌دهد یا چه سازه‌ای باید اضافه شود؟"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Section B: Propose Missing Constructs for Iran */}
          <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4 space-y-2">
              <h3 className="text-lg md:text-xl font-black text-slate-900">
                پیشنهاد سازه‌ها یا متغیرهای مفقود (ویژه شرایط ایران)
              </h3>
              <p className="text-xs text-slate-600">
                در صورتی که معتقدید مفهومی حیاتی در ادبیات بین‌المللی مغفول مانده یا مختص شرایط ایران است، آن را با تعریف و توجیه نظری در این قسمت بیفزایید:
              </p>
            </div>

            {/* Existing Proposed Constructs */}
            {state.missingConstructs.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700">سازه‌های پیشنهادی شما:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {state.missingConstructs.map((mc, idx) => (
                    <div key={mc.id} className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-emerald-950 font-bold">{mc.nameFa}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setState((prev) => ({
                              ...prev,
                              missingConstructs: prev.missingConstructs.filter((m) => m.id !== mc.id),
                              lastSavedAt: new Date().toISOString(),
                            }));
                          }}
                          className="text-rose-600 hover:text-rose-800 text-[0.7rem] font-bold"
                        >
                          حذف
                        </button>
                      </div>
                      <p className="text-slate-700 text-[0.72rem] leading-relaxed">{mc.preliminaryDefinition}</p>
                      <div className="text-[0.68rem] text-slate-500">دلیل ضرورت: {mc.whyNecessary}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Missing Construct Form */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
              <span className="font-black text-slate-900 text-xs">فرم ثبت سازه جدید ویژه ایران:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newMissingNameFa}
                  onChange={(e) => setNewMissingNameFa(e.target.value)}
                  placeholder="عنوان فارسی سازه پیشنهادی (مثال: تاب‌آوری ناشی از نوسان ارزی)"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={newMissingNameEn}
                  onChange={(e) => setNewMissingNameEn(e.target.value)}
                  placeholder="Equivalent English Title (Optional)"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white dir-ltr text-right"
                />
              </div>

              <textarea
                rows={2}
                value={newMissingDef}
                onChange={(e) => setNewMissingDef(e.target.value)}
                placeholder="تعریف عملیاتی و مفهومی این سازه..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newMissingWhy}
                  onChange={(e) => setNewMissingWhy(e.target.value)}
                  placeholder="چرا این سازه برای اکوسیستم ایران ضروری است؟"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={newMissingEvidence}
                  onChange={(e) => setNewMissingEvidence(e.target.value)}
                  placeholder="شواهد عینی، نهادی یا تجربی در ایران..."
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddMissingConstruct}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن این سازه به چارچوب ایران</span>
                </button>
              </div>
            </div>

            {/* Stepper buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep('oral')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>مرحله قبل (اطلاعات شفاهی)</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('review')}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>ورود به مرحله نهایی: جمع‌بندی و دریافت اکسل</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 6: REVIEW, FINAL SUBMISSION & EXCEL EXPORT (جمع‌بندی و دانلود اکسل)
      ========================================================================= */}
      {activeStep === 'review' && (
        <div className="bg-white rounded-3xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 font-mono">گام نهایی پژوهش</span>
              <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                بازبینی، ثبت قطعی و دریافت گزارش رسمی
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              جمع‌بندی نهایی ارزیابی خبره و دانلود فایل اکسل داده‌ها
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              ضمن سپاسگزاری از وقت و دقت نظر ارزنده‌تان در این پژوهش ملّی، خلاصه تکمیل‌شده ارزیابی‌های شما در زیر درج شده است. می‌توانید فایل اکسل جامع پژوهشی را دانلود فرموده و دکمه ثبت قطعی را کلیک نمایید:
            </p>
          </div>

          {/* Submission Status Banner */}
          {state.isFinalSubmitted && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs md:text-sm flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div>ارزیابی شما با موفقیت در پایگاه داده اعتبارسنجی نخبگانی ثبت و تثبیت گردید.</div>
                <div className="text-xs font-normal text-emerald-800 font-mono mt-0.5">
                  زمان ثبت: {state.submittedAt ? new Date(state.submittedAt).toLocaleString('fa-IR') : '—'}
                </div>
              </div>
            </div>
          )}

          {/* Verification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-500">خبره مشارکت‌کننده:</span>
              <div className="text-sm font-black text-slate-900 truncate">
                {state.profile.name || 'نامشخص'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-500">سازه‌های ارزیابی‌شده کمّی:</span>
              <div className="text-lg font-black text-blue-700 font-mono">
                {assessedCount} از {totalConstructs}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-500">محورهای گفتار شفاهی ثبت‌شده:</span>
              <div className="text-lg font-black text-purple-700 font-mono">
                {Object.keys(state.oralFeedback || {}).length} از ۴ محور
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-500">سازه‌های مفقود پیشنهادی ایران:</span>
              <div className="text-lg font-black text-emerald-700 font-mono">
                {state.missingConstructs.length} سازه جدید
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onExportExcel}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>دانلود فایل اکسل پاسخ‌های خبره (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={state.isFinalSubmitted}
              className={`px-8 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 shadow-lg transition cursor-pointer ${
                state.isFinalSubmitted
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{state.isFinalSubmitted ? 'ارزیابی قطعی قبلاً ثبت گردید' : 'ثبت قطعی در پایگاه داده پژوهش'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
