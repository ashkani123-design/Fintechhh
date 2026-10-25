import React, { useState } from 'react';
import {
  FIGURE_10_BLOCKS,
  SYNTHESIS_CONTRADICTIONS,
  Figure10BlockInfo,
} from '../data/questionnaire';
import {
  ShieldAlert,
  Sliders,
  Users,
  Building2,
  Scale,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  Info,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';

interface Figure10ExplorerProps {
  onNavigateToQuestion?: (questionId: string) => void;
}

export const Figure10Explorer: React.FC<Figure10ExplorerProps> = ({
  onNavigateToQuestion,
}) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string>('hd4_governance');
  const [selectedContradictionId, setSelectedContradictionId] = useState<string | null>(null);

  const selectedBlock = FIGURE_10_BLOCKS.find((b) => b.id === selectedBlockId);
  const selectedContradiction = SYNTHESIS_CONTRADICTIONS.find(
    (c) => c.id === selectedContradictionId
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0b192c] text-white p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>چارچوب اولیه متاسنتز بین‌المللی (Initial Meta-Synthesis Model)</span>
            </div>
            <span className="text-slate-400 text-xs">
              برگرفته از فراتحلیل کیفی (۲۸ مقاله معتبر جهانی، ۲۰۱۹-۲۰۲۶)
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white">
            کاوشگر تعاملی چارچوب اولیه: سیستم غیرخطی و چندمکانیزمی اعتماد-تصمیم-واسطه‌گری
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-4xl">
            چارچوب اولیه نشان می‌دهد که پذیرش فناوری سرمایه‌گذاری دیجیتال (Adoption) دارای اثر خطی و مکانیکی بر بازده نیست، بلکه در قالب یک فرمول ترکیبی و مشروط:{' '}
            <span className="font-mono text-amber-300 font-bold dir-ltr inline-block">
              Adoption → [ HD1 × HD2 × HD3 × HD4 ] → Outcomes
            </span>{' '}
            عمل می‌کند. روی هر یک از بلوک‌ها و تضادهای زیر کلیک کنید تا شواهد مقالات و دلالت‌های بومی‌سازی در ایران را بررسی فرمایید.
          </p>
        </div>
      </div>

      {/* Interactive Initial Framework Diagram Board */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-5 md:p-8 shadow-lg space-y-6">
        {/* Top Formula Banner */}
        <div className="flex flex-wrap items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 px-5 text-xs">
          <div className="font-bold text-slate-800">
            <span className="text-indigo-600 font-black ml-1">چارچوب اولیه:</span>
            <span>Final Meta-Synthesis Baseline Model — A Conditional, Recursive, Multi-Mechanistic Trust–Decision–Intermediation System</span>
          </div>
          <div className="font-mono text-[0.75rem] font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200 dir-ltr">
            Adoption → [ HD1 × HD2 × HD3 × HD4 ] → Outcomes
          </div>
        </div>

        {/* ================= TOP BLOCK: HD4 GOVERNANCE (MACRO CONTEXT) ================= */}
        <div
          onClick={() => {
            setSelectedBlockId('hd4_governance');
            setSelectedContradictionId(null);
          }}
          className={`cursor-pointer rounded-xl p-5 border-2 transition-all relative ${
            selectedBlockId === 'hd4_governance'
              ? 'border-slate-800 bg-slate-900 text-white shadow-xl ring-4 ring-slate-300'
              : 'border-slate-300 bg-slate-100 hover:bg-slate-200/80 text-slate-900'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/40 font-mono font-black text-xs">
                HD4
              </span>
              <h3 className="font-black text-base md:text-lg">
                ALGORITHMIC GOVERNANCE & NORMATIVE FRAMEWORKS (حکمرانی الگوریتمی و چارچوب‌های هنجاری)
              </h3>
            </div>
            <span className="text-[0.7rem] px-2.5 py-1 rounded bg-slate-200/30 font-bold">
              بستر کلان (MACRO CONTEXT)
            </span>
          </div>

          {/* Explicit Sub-Theme ST6 Representation */}
          <div className={`p-3 rounded-lg mb-3 border ${selectedBlockId === 'hd4_governance' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white border-amber-300'}`}>
            <div className="flex items-center justify-between">
              <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-black">ST6</span>
                <span>مضمون سطح دوم زیرمجموعه HD4: حکمرانی الگوریتمی و چارچوب‌های هنجاری (Algorithmic Governance & Normative Frameworks)</span>
              </div>
              <span className="text-[0.65rem] text-slate-400 font-mono">Second-Order Theme ST6</span>
            </div>
            <p className="text-[0.75rem] text-slate-300 mt-1.5 leading-relaxed text-justify">
              این مضمون به عنوان بعد هنجاری شکل‌دهنده به کل اکوسیستم سرمایه‌گذاری دیجیتال عمل کرده و از طریق تدوین چارچوب‌های رگولاتوری، استانداردهای اخلاقی و الزامات پاسخگویی، ساختار تعاملات انسان و الگوریتم را سامان می‌بخشد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className={`p-3 rounded-lg ${selectedBlockId === 'hd4_governance' ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="font-bold text-amber-400 mb-1">سازوکارهای کلیدی ST6 (Core Mechanisms):</div>
              <p>کشف تورش و سوگیری (Bias Detection)، ممیزی‌های انصاف، پروانه مشاوره هوش مصنوعی (AIRAL)، حفاظت از سرمایه‌گذار در MiFID II و شفافیت تبیین‌پذیر.</p>
            </div>
            <div className={`p-3 rounded-lg ${selectedBlockId === 'hd4_governance' ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="font-bold text-amber-400 mb-1">نقش هنجاری و پاسخگویی ST6 (Normative Role):</div>
              <p>بعد هنجاری فراگیر برای تامین انصاف سیستمی، پاسخگویی الگوریتم‌ها، رعایت اصول اخلاقی و جبران ناتوانی خودتنظیم‌گری بازار (ST6).</p>
            </div>
            <div className={`p-3 rounded-lg ${selectedBlockId === 'hd4_governance' ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="font-bold text-amber-400 mb-1">شرایط مرزی و رگولاتوری ST6 (Boundary Conditions):</div>
              <p>حوزه قضایی (Jurisdiction)، رژیم‌های هوش مصنوعی تبیین‌پذیر (XAI)، سندباکس‌های نظارتی پویا و نوع مدل الگوریتمی.</p>
            </div>
          </div>
        </div>

        {/* ENABLING CONNECTIONS INDICATOR */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-600 text-[0.7rem] font-bold">
            <ArrowRight className="w-3.5 h-3.5 rotate-90" />
            <span>تسهیل‌کننده و جهت‌بخش (ENABLING & SHAPING)</span>
          </span>
        </div>

        {/* ================= MIDDLE THREE COLUMNS: HD2, HD1, HD3 ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* HD2: HUMAN-ALGORITHM DECISION ARCHITECTURE */}
          <div
            onClick={() => {
              setSelectedBlockId('hd2_decision');
              setSelectedContradictionId(null);
            }}
            className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between ${
              selectedBlockId === 'hd2_decision'
                ? 'border-indigo-600 bg-indigo-950 text-white shadow-xl ring-4 ring-indigo-200'
                : 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-950'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-500 border border-indigo-400/30 font-mono font-black text-xs">
                  HD2
                </span>
                <span className="text-[0.65rem] text-slate-400">User Segment / Task Type</span>
              </div>
              <h4 className="font-black text-sm md:text-base mb-2">
                HUMAN–ALGORITHM DECISION ARCHITECTURE
              </h4>
              <p className="text-xs mb-3 font-semibold text-indigo-400">
                معماری تصمیم انسان-الگوریتم
              </p>

              <div className="space-y-2 text-xs">
                <div className={`p-2.5 rounded-lg border ${selectedBlockId === 'hd2_decision' ? 'bg-indigo-900/60 border-indigo-700' : 'bg-white border-indigo-100'}`}>
                  <div className="font-bold text-amber-300">Hybrid Advisory (ST2)</div>
                  <p className="text-[0.75rem] leading-relaxed">
                    Advisor-in-the-Loop (AITL)؛ تعادل میان خطای اتوماسیون (Automation Bias) و گریز از الگوریتم (Algorithm Aversion).
                  </p>
                </div>

                <div className={`p-2.5 rounded-lg border ${selectedBlockId === 'hd2_decision' ? 'bg-indigo-900/60 border-indigo-700' : 'bg-white border-indigo-100'}`}>
                  <div className="font-bold text-amber-300">Personalization Constraints (ST7)</div>
                  <p className="text-[0.75rem] leading-relaxed">
                    اتکای شدید بر ریسک و افق زمانی؛ غفلت از سرمایه انسانی؛ شکاف ادعا در برابر تحقق شخصی‌سازی.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-indigo-300/30 text-[0.7rem] text-indigo-400 font-bold">
              مکمل و تعاملی (COMPLEMENTARY)
            </div>
          </div>

          {/* HD1: TRUST, RISK & INVESTOR PSYCHOLOGY */}
          <div
            onClick={() => {
              setSelectedBlockId('hd1_trust');
              setSelectedContradictionId(null);
            }}
            className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between ${
              selectedBlockId === 'hd1_trust'
                ? 'border-emerald-600 bg-emerald-950 text-white shadow-xl ring-4 ring-emerald-200'
                : 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 border border-emerald-400/30 font-mono font-black text-xs">
                  HD1
                </span>
                <span className="text-[0.65rem] text-slate-400">Experience / Financial Literacy</span>
              </div>
              <h4 className="font-black text-sm md:text-base mb-2">
                TRUST, RISK & INVESTOR PSYCHOLOGY
              </h4>
              <p className="text-xs mb-3 font-semibold text-emerald-400">
                روانشناسی سرمایه‌گذار، اعتماد و ریسک
              </p>

              <div className="space-y-2 text-xs">
                <div className={`p-2.5 rounded-lg border ${selectedBlockId === 'hd1_trust' ? 'bg-emerald-900/60 border-emerald-700' : 'bg-white border-emerald-100'}`}>
                  <div className="font-bold text-amber-300">Trust Calibration (ST1)</div>
                  <p className="text-[0.75rem] leading-relaxed">
                    تمایز اعتماد کالیبره‌شده از پذیرش کورکورانه؛ سرریز اعتماد از اعتبار نهاد و سامانه (Trust Transfer).
                  </p>
                </div>

                <div className={`p-2.5 rounded-lg border ${selectedBlockId === 'hd1_trust' ? 'bg-emerald-900/60 border-emerald-700' : 'bg-white border-emerald-100'}`}>
                  <div className="font-bold text-amber-300">Behavioral Dynamics (ST5)</div>
                  <p className="text-[0.75rem] leading-relaxed">
                    ناآشنایی مولد ترس است؛ اضطراب روانی مانع شکل‌گیری اعتماد اولیه به روبوادوایزر می‌شود.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-emerald-300/30 text-[0.7rem] text-emerald-400 font-bold">
              دو سویه و متقابل (RECIPROCAL)
            </div>
          </div>

          {/* HD3: STRUCTURAL MARKET TRANSFORMATION */}
          <div
            onClick={() => {
              setSelectedBlockId('hd3_market');
              setSelectedContradictionId(null);
            }}
            className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between ${
              selectedBlockId === 'hd3_market'
                ? 'border-amber-600 bg-amber-950 text-white shadow-xl ring-4 ring-amber-200'
                : 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-950'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-400/30 font-mono font-black text-xs">
                  HD3
                </span>
                <span className="text-[0.65rem] text-slate-400">Market Type / Reg Environment</span>
              </div>
              <h4 className="font-black text-sm md:text-base mb-2">
                STRUCTURAL MARKET TRANSFORMATION
              </h4>
              <p className="text-xs mb-3 font-semibold text-amber-400">
                تحول ساختاری بازار و واسطه‌گری
              </p>

              <div className="space-y-2 text-xs">
                <div className={`p-2.5 rounded-lg border ${selectedBlockId === 'hd3_market' ? 'bg-amber-900/60 border-amber-700' : 'bg-white border-amber-100'}`}>
                  <div className="font-bold text-amber-300">Intermediation Shift (ST3)</div>
                  <p className="text-[0.75rem] leading-relaxed">
                    باز-واسطه‌گری پلتفرمی به جای حذف واسطه‌ها؛ نقش اعتبارسنجی سرمایه‌گذاران جسورانه (VCs).
                  </p>
                </div>

                <div className={`p-2.5 rounded-lg border ${selectedBlockId === 'hd3_market' ? 'bg-amber-900/60 border-amber-700' : 'bg-white border-amber-100'}`}>
                  <div className="font-bold text-amber-300">Access Stratification (ST4)</div>
                  <p className="text-[0.75rem] leading-relaxed">
                    همزیستی دموکراتیزه‌سازی با شکاف توانمندی؛ انحراف بیشینه منافع به سمت صاحبان سواد مالی بالاتر.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-amber-300/30 text-[0.7rem] text-amber-400 font-bold">
              مشروط و وابسته (CONDITIONAL)
            </div>
          </div>
        </div>

        {/* ================= INVESTMENT OUTCOMES BLOCK ================= */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 border border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h4 className="font-black text-base text-white">
                پیامدهای سرمایه‌گذاری نهایی (INVESTMENT OUTCOMES)
              </h4>
            </div>
            <span className="text-xs text-amber-300 font-mono">
              [ HD1 × HD2 × HD3 × HD4 ] → Outcomes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
              <div className="font-bold text-emerald-300 mb-1">عملکرد پرتفوی (Portfolio Performance):</div>
              <p>بهبود نسبت‌های شارپ (۱۶.۱٪ افزایش) مشروط بر استفاده مستمر؛ کاهش تعصب به سهام خانگی (Home Bias).</p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
              <div className="font-bold text-blue-300 mb-1">چرخش‌های رفتاری (Behavioral Shifts):</div>
              <p>افزایش سرمایه‌گذاری شاخصی (از ۴۶٪ به ۸۱٪ ثروت)، کاهش رفتارهای هیجانی و انضباط در معاملات.</p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
              <div className="font-bold text-amber-300 mb-1">رفاه و شمول مالی (Welfare Effects):</div>
              <p>رفاه طبقاتی‌شده؛ ایجاد سود بیشتر برای اقشار دارای مهارت سواد دیجیتال و مالی و نیاز به چتر حمایتی برای آسیب‌پذیران.</p>
            </div>
          </div>
        </div>

        {/* ================= FEEDBACK LOOPS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900 mb-1.5">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span>حلقه بازخورد خرد (MICRO FEEDBACK LOOP)</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <span className="font-mono text-blue-800 font-bold dir-ltr inline-block">Adoption → Experience → Trust → Continued Use</span>
              <br />
              هشدارهای هوشمند رفتار معاملاتی و بازده واقعی را در طول زمان دگرگون می‌سازند (Bianchi & Brière, 2024).
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1.5">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>حلقه بازخورد کلان (MACRO FEEDBACK LOOP)</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <span className="font-mono text-amber-800 font-bold dir-ltr inline-block">Intermediation → Market Response → Org Adaptation</span>
              <br />
              ورود استارتاپ‌های روبوادوایزر باعث پاسخ بازار و تحول سازمانی نهادهای سنتی در استخدام مشاوران می‌شود (Kumar, 2024).
            </p>
          </div>
        </div>

        {/* ================= KEY CONTRADICTIONS (BOTTOM STRIP) ================= */}
        <div className="border-t-2 border-red-200 pt-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h4 className="font-black text-sm md:text-base text-red-900">
              تضادها، تناقض‌ها و موارد منفی بنیادین متاسنتز (KEY CONTRADICTIONS & LIMITATIONS)
            </h4>
          </div>
          <p className="text-xs text-slate-600">
            برای مشاهده جزئیات و شواهد هر یک از ۶ چالش علمی شناسایی‌شده در مقالات متاسنتز، روی آن کلیک فرمایید:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SYNTHESIS_CONTRADICTIONS.map((c) => {
              const isSelected = selectedContradictionId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedContradictionId(c.id);
                    setSelectedBlockId('');
                  }}
                  className={`text-right p-3 rounded-lg border transition-all text-xs cursor-pointer ${
                    isSelected
                      ? 'border-red-600 bg-red-950 text-white shadow-md'
                      : 'border-red-200 bg-red-50/70 hover:bg-red-100/70 text-red-950'
                  }`}
                >
                  <div className="font-bold mb-1">{c.title}</div>
                  <p className={`line-clamp-2 text-[0.7rem] ${isSelected ? 'text-red-200' : 'text-slate-600'}`}>
                    {c.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= DETAIL EXPLORER CARD ================= */}
      {selectedBlock && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#0b192c] text-white flex items-center justify-center font-mono font-bold text-xs">
                {selectedBlock.code}
              </span>
              <div>
                <h3 className="font-black text-base md:text-lg text-[#0b192c]">
                  {selectedBlock.titleFa}
                </h3>
                <div className="text-xs text-slate-500 font-serif">{selectedBlock.titleEn}</div>
              </div>
            </div>

            {onNavigateToQuestion && (
              <button
                type="button"
                onClick={() => {
                  if (selectedBlock.id === 'hd4_governance') onNavigateToQuestion('Q7-HD4-GOVERNANCE');
                  else if (selectedBlock.id === 'hd2_decision') onNavigateToQuestion('Q3-HD2-HYBRID');
                  else if (selectedBlock.id === 'hd1_trust') onNavigateToQuestion('Q1-HD1-TRUST');
                  else if (selectedBlock.id === 'hd3_market') onNavigateToQuestion('Q5-HD3-INTERMEDIATION');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
              >
                <span>پاسخ به سوال ارزیابی این بعد</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
            {selectedBlock.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Key Studies */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>مهم‌ترین شواهد ۲۸ مقاله متاسنتز:</span>
              </h5>
              <div className="space-y-2">
                {selectedBlock.keyStudies.map((s, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-indigo-700 ml-1">
                      {s.author} ({s.year}):
                    </span>
                    <span className="text-slate-600">{s.finding}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Iran Adaptation Implications */}
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
              <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>دلالت کلیدی برای فاز دوم (بومی‌سازی در زیست‌بوم مالی ایران):</span>
              </h5>
              <p className="text-slate-800 leading-relaxed text-justify bg-white p-3 rounded-lg border border-amber-200">
                {selectedBlock.iranImplications}
              </p>

              <div className="pt-2">
                <span className="text-[0.7rem] font-bold text-slate-500">شرایط مرزی (Boundary Conditions):</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedBlock.boundaryConditions.map((b, i) => (
                    <span key={i} className="text-[0.65rem] px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONTRADICTION MODAL / PANEL ================= */}
      {selectedContradiction && (
        <div className="bg-red-50 rounded-2xl border-2 border-red-300 p-6 shadow-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-red-200">
            <h4 className="font-black text-base text-red-900">
              {selectedContradiction.title}
            </h4>
            <span className="text-xs text-red-700 font-mono font-bold">
              شواهد مقالات: {selectedContradiction.evidence}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-800 leading-relaxed">
            {selectedContradiction.description}
          </p>
          <div className="flex justify-end pt-2">
            {onNavigateToQuestion && (
              <button
                type="button"
                onClick={() => onNavigateToQuestion('Q9-PARADOXES-SYNTHESIS')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition cursor-pointer"
              >
                <span>ارزیابی این پارادوکس در پرسشنامه تخصصی</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
