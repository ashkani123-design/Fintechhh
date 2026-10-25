/**
 * Specialized Methodology Data Models for:
 * 1. Modified Delphi for Initial Framework (چارچوب اولیه) Validation
 * 2. Fuzzy Delphi for Iran Contextual Screening
 * 3. Fuzzy DEMATEL for Causal Interdependency Matrix
 * 4. DANP (DEMATEL-based ANP) for Global Weights
 * 5. Multi-stakeholder Expert Panel Quota
 */

export type StakeholderGroup = 'academic' | 'industry' | 'regulator' | 'tech';

export interface ExpertPanelMember {
  id: string;
  name: string;
  stakeholderGroup: StakeholderGroup;
  stakeholderTitleFa: string;
  position: string;
  organization: string;
  experienceYears: number;
  entryCriteriaMet: {
    min5YearsExperience: boolean;
    leadershipOrManagementRole: boolean;
    publicationsOrProjects: boolean;
    directAiRoboRegExperience: boolean;
  };
}

export const STAKEHOLDER_GROUPS: Record<
  StakeholderGroup,
  { titleFa: string; roleDescription: string; targetQuota: string; color: string }
> = {
  academic: {
    titleFa: 'دانشگاهیان و پژوهشگران',
    roleDescription: 'اساتید و پژوهشگران ارشد حوزه‌های FinTech، مدیریت مالی، سرمایه‌گذاری، سیستم‌های اطلاعاتی و هوش مصنوعی',
    targetQuota: '۵ الی ۷ نفر (۲۵٪)',
    color: 'indigo',
  },
  industry: {
    titleFa: 'صنعت مالی و ثروت‌تک',
    roleDescription: 'مدیران عامل و مدیران ارشد شرکت‌های سبدگردان، کارگزاری‌ها، بانک‌ها، WealthTech و استارتاپ‌های روبوادوایزری',
    targetQuota: '۶ الی ۸ نفر (۳۵٪)',
    color: 'emerald',
  },
  regulator: {
    titleFa: 'سیاست‌گذاران و ناظران',
    roleDescription: 'مدیران و کارشناسان ارشد سازمان بورس و اوراق بهادار، بانک مرکزی، شورای عالی فضای مجازی و شرکت مدیریت فناوری بورس',
    targetQuota: '۴ الی ۵ نفر (۲۰٪)',
    color: 'slate',
  },
  tech: {
    titleFa: 'متخصصان فناوری و هوش مصنوعی',
    roleDescription: 'متخصصان یادگیری ماشین، هوش مصنوعی مولد، توسعه پلتفرم‌های سرمایه‌گذاری، امنیت سایبری و الگوریتم‌های معاملاتی',
    targetQuota: '۴ الی ۵ نفر (۲۰٪)',
    color: 'cyan',
  },
};

// =========================================================================
// 1. HIGHER-ORDER DIMENSIONS & SECOND-ORDER THEMES (FIGURE 10 CONSTRUCTS)
// =========================================================================

export interface HigherOrderDimension {
  id: 'HD1' | 'HD2' | 'HD3' | 'HD4';
  titleFa: string;
  titleEn: string;
  operationalDefinition: string;
  constituentThemes: string[]; // ST codes
  coreStudies: string[];
  keyQuestionsDelphiR1: string;
}

export const HIGHER_ORDER_DIMENSIONS: HigherOrderDimension[] = [
  {
    id: 'HD1',
    titleFa: 'روانشناسی سرمایه‌گذار، اعتماد و ریسک',
    titleEn: 'Trust, Risk & Investor Psychology',
    operationalDefinition:
      'سازوکارهای شناختی، عاطفی و رفتاری در شکل‌گیری اعتماد، انتقال اعتبار از نهادهای سنتی، مهار اضطراب فناوری، و تمایز میان پذیرش منفعلانه با کالیبراسیون دقیق اعتماد متناسب با شایستگی واقعی سیستم.',
    constituentThemes: ['ST1', 'ST5'],
    coreStudies: ['Balaskas (2026)', 'Cao et al. (2024)', 'Guo et al. (2019)', 'Singh & Karamcheti (2025)'],
    keyQuestionsDelphiR1:
      'آیا این بعد کلان به نحو جامع و مانع، پویایی‌های روان‌شناختی، کالیبراسیون اعتماد و اضطراب سرمایه‌گذار در مواجهه با سیستم‌های هوشمند را پوشش می‌دهد؟ چه عنصری باید بازتعریف یا افزوده شود؟',
  },
  {
    id: 'HD2',
    titleFa: 'معماری تصمیم انسان-الگوریتم',
    titleEn: 'Human–Algorithm Decision Architecture',
    operationalDefinition:
      'نحوه ساختاربندی، شخصی‌سازی و تفویض اختیار در تصمیم‌گیری‌های مالی میان انسان و هوش مصنوعی، مدل‌های هیبریدی مشاور-در-حلقه (AITL)، و موازنه ظریف میان خطای اتوماسیون (Automation Bias) و گریز از الگوریتم (Algorithm Aversion).',
    constituentThemes: ['ST2', 'ST7'],
    coreStudies: ['Asemi et al. (2025)', 'Mahmud et al. (2025)', 'Scherer & Lehner (2023, 2025)', 'Barile et al. (2024)'],
    keyQuestionsDelphiR1:
      'Does this higher-order dimension adequately represent how human judgment, algorithmic delegation, hybrid advisory, personalization, and behavioral interventions jointly structure digital investment decisions? What element, if any, should be added, removed, merged, or relocated?',
  },
  {
    id: 'HD3',
    titleFa: 'تحول ساختاری بازار و واسطه‌گری دیجیتال',
    titleEn: 'Structural Market Transformation & Access',
    operationalDefinition:
      'دگرگونی زنجیره ارزش مالی از طریق باز-واسطه‌گری پلتفرمی (Re-intermediation به جای حذف واسطه‌ها)، نقش صدور تاییدیه سرمایه‌گذاران جسورانه (VC Certification)، و همزیستی دموکراتیزه‌سازی دسترسی با لایه‌بندی و نابرابری در توانمندی بهره‌برداری.',
    constituentThemes: ['ST3', 'ST4'],
    coreStudies: ['Kumar (2024)', 'Rossi & Utkus (2024)', 'Camelo & Duarte (2025)', 'Zarifis et al. (2025)'],
    keyQuestionsDelphiR1:
      'آیا تفکیک پدیده باز-واسطه‌گری پلتفرمی و پارادوکس دموکراتیزه‌سازی همراه با لایه‌بندی در این بعد به درستی تصویر شده است؟ تعامل فین‌تک با نهادهای سنتی بازار چگونه در این بعد ارزیابی می‌شود؟',
  },
  {
    id: 'HD4',
    titleFa: 'حکمرانی الگوریتمی و چارچوب‌های هنجاری',
    titleEn: 'Algorithmic Governance & Normative Frameworks',
    operationalDefinition:
      'بعد چترمدار در سطح کلان (Macro Umbrella) شامل ممیزی انصاف و کشف سوگیری، پروانه مشاور هوش مصنوعی (AIRAL)، آزمون‌های تناسب سبد دارایی و جبران شکست‌های خودتنظیم‌گری بازار در حفاظت از سرمایه‌گذاران خرد.',
    constituentThemes: ['ST6'],
    coreStudies: ['Kofman (2025)', 'Steennot (2022)', 'Agliata & Hasso (2026)'],
    keyQuestionsDelphiR1:
      'آیا جایگاه HD4 به عنوان لایه فراگیر و حاکم بر سایر ابعاد در چارچوب اولیه منطقی و معتبر است؟ چه الزامات حقوقی، فنی و اخلاقی دیگری باید در این بعد ادغام شود؟',
  },
];

export interface SecondOrderTheme {
  id: string; // ST1 to ST7
  hdParent: 'HD1' | 'HD2' | 'HD3' | 'HD4';
  titleFa: string;
  titleEn: string;
  conceptualCore: string;
  theoreticalMechanism: string;
}

export const SECOND_ORDER_THEMES: SecondOrderTheme[] = [
  {
    id: 'ST1',
    hdParent: 'HD1',
    titleFa: 'کالیبراسیون اعتماد میانجی‌گری‌شده با فناوری',
    titleEn: 'Technology-Mediated Trust Calibration',
    conceptualCore: 'تمایز بنیادین میان پذیرش منفعلانه و انطباق واقعی سطح اعتماد کاربر با قابلیت‌های عینی سیستم جهت جلوگیری از اتکای نابجا یا گریز بی‌دلیل.',
    theoreticalMechanism: 'کالیبراسیون اعتماد از طریق آزمون و خطای کنترل‌شده و هشدارهای شفاف سیستم محقق می‌شود و از شکست پذیرش پیشگیری می‌کند.',
  },
  {
    id: 'ST2',
    hdParent: 'HD2',
    titleFa: 'مذاکره تصمیم‌گیری انسان-الگوریتم',
    titleEn: 'Human–Algorithm Decision Negotiation',
    conceptualCore: 'سازوکارهای تقسیم کار تحلیلی و اختیارات معاملاتی در سامانه‌های هیبریدی مشاور-در-حلقه (Advisor-in-the-Loop).',
    theoreticalMechanism: 'تعریف حق وتوی مشاور انسانی در سناریوهای بحران و واگذاری محاسبات پیچیده و موازنه ریسک به هوش مصنوعی.',
  },
  {
    id: 'ST3',
    hdParent: 'HD3',
    titleFa: 'بازپیکربندی دیجیتال واسطه‌گری سرمایه‌گذاری',
    titleEn: 'Digital Reconfiguration of Investment Intermediation',
    conceptualCore: 'ابطال فرضیه حذف واسطه‌ها و ظهور باز-واسطه‌گری پلتفرمی (Re-intermediation) و تثبیت نقش اعتبارسنجی صندوق‌های جسورانه (VC).',
    theoreticalMechanism: 'ورود روبوادوایزرها زنجیره ارزش را بازسازی کرده و به افزایش استخدام مشاوران انسانی برای مشتریان پرثروت انجامیده است.',
  },
  {
    id: 'ST4',
    hdParent: 'HD3',
    titleFa: 'دموکراتیزه‌سازی و لایه‌بندی دسترسی سرمایه‌گذاری',
    titleEn: 'Democratization and Stratification of Investment Access',
    conceptualCore: 'گسترش دسترسی آحاد مردم به مدیریت ثروت همراه با شکل‌گیری نابرابری ثانویه در بهره‌وری ناشی از شکاف سواد دیجیتال/مالی.',
    theoreticalMechanism: 'روبوادوایزرها موانع ورود را کم می‌کنند اما سودآوری حداکثری به سرمایه‌گذارانی تعلق می‌گیرد که درک بهتری از بازار دارند.',
  },
  {
    id: 'ST5',
    hdParent: 'HD1',
    titleFa: 'پویایی‌های رفتاری پذیرش و مقاومت',
    titleEn: 'Behavioral Dynamics of Adoption and Resistance',
    conceptualCore: 'ناآشنایی مولد ترس و اضطراب است و مقاومت روانی ایجاد می‌کند؛ کاهش اضطراب از طریق انسان‌انگاری و ارتباط شفاف صورت می‌گیرد.',
    theoreticalMechanism: 'طراحی رابط‌های گفتگومحور و نمایش استدلال‌های تحلیلی، سوگیری‌های شناختی و رفتارهای گله‌ای را تعدیل می‌نماید.',
  },
  {
    id: 'ST6',
    hdParent: 'HD4',
    titleFa: 'حکمرانی الگوریتمی و پاسخگویی هنجاری',
    titleEn: 'Algorithmic Governance and Accountability',
    conceptualCore: 'ناکافی بودن خودتنظیم‌گری بازار، لزوم استقرار پروانه‌های فعالیت هوش مصنوعی مالی (AIRAL) و ممیزی سوگیری و آزمون تناسب.',
    theoreticalMechanism: 'چهار گیت اخلاقی (رقابت، شایستگی، سوگیری، چتر ایمنی) سلامت زیست‌بوم را در برابر رفتارهای ناعادلانه الگوریتم تضمین می‌کند.',
  },
  {
    id: 'ST7',
    hdParent: 'HD2',
    titleFa: 'معماری شخصی‌سازی و تصمیم‌گیری',
    titleEn: 'Personalization and Decision Architecture',
    conceptualCore: 'نقد فرمول‌های ساده‌انگارانه فعلی که صرفاً به ریسک و افق زمانی متکی هستند و ضرورت ورود تلنگرهای رفتاری و سرمایه انسانی خانوار.',
    theoreticalMechanism: 'گذر از پرسشنامه‌های صوری به پایش رفتاری و تحلیل دارایی‌های چندگانه کاربر برای تولید پیشنهادهای واقعاً اختصاصی.',
  },
];

// =========================================================================
// 2. SYSTEM RELATIONSHIP TABLE (FIGURE 10 LINKAGES)
// =========================================================================

export interface SystemRelationshipItem {
  id: string;
  source: string;
  target: string;
  relationshipType: 'Enabling' | 'Complementary' | 'Reciprocal' | 'Shaping' | 'Conditional';
  relationshipTypeFa: string;
  theoreticalRationale: string;
  metaEvidence: string;
  delphiR2ValidScore?: number;
}

export const SYSTEM_RELATIONSHIPS: SystemRelationshipItem[] = [
  {
    id: 'REL-1',
    source: 'HD1 (Trust & Psychology)',
    target: 'Adoption & Continued Usage',
    relationshipType: 'Reciprocal',
    relationshipTypeFa: 'متقابل و توانمندساز (Reciprocal / Enabling)',
    theoreticalRationale: 'کالیبراسیون اعتماد کاربر نرخ پذیرش را بالا می‌برد و تداوم موفقیت‌آمیز تجربه کاربری، اعتماد را تثبیت می‌کند.',
    metaEvidence: 'Balaskas (2026); Bianchi & Brière (2024)',
  },
  {
    id: 'REL-2',
    source: 'HD2 (Decision Architecture)',
    target: 'ST7 (Personalization)',
    relationshipType: 'Complementary',
    relationshipTypeFa: 'مکمل و هم‌افزا (Complementary)',
    theoreticalRationale: 'معماری مشاور-در-حلقه (AITL) ساختار شخصی‌سازی عمیق را ممکن می‌سازد و شخصی‌سازی داده‌های واقعی را به الگوریتم تزریق می‌کند.',
    metaEvidence: 'Asemi et al. (2025); Scherer & Lehner (2023)',
  },
  {
    id: 'REL-3',
    source: 'HD3 (Market Transformation)',
    target: 'ST4 (Access Democratization)',
    relationshipType: 'Conditional',
    relationshipTypeFa: 'مشروط به زمینه (Conditional / Enabling)',
    theoreticalRationale: 'باز-واسطه‌گری پلتفرمی دسترسی عامه را تسهیل می‌کند، مشروط بر اینکه شکاف سواد دیجیتال و مالی مانع بهره‌برداری عادلانه نشود.',
    metaEvidence: 'Kumar (2024); Rossi & Utkus (2024)',
  },
  {
    id: 'REL-4',
    source: 'HD4 (Governance & Normative)',
    target: 'HD1 (Trust Calibration)',
    relationshipType: 'Enabling',
    relationshipTypeFa: 'بنیادین و توانمندساز (Enabling Foundation)',
    theoreticalRationale: 'چارچوب هنجاری، پروانه‌های نظارتی (AIRAL) و ممیزی انصاف زیربنای اعتماد عقلایی و پایدار سرمایه‌گذار به سامانه‌ها را می‌سازند.',
    metaEvidence: 'Kofman (2025); Steennot (2022)',
  },
  {
    id: 'REL-5',
    source: 'ST7 (Personalization)',
    target: 'HD1 (Trust & Psychology)',
    relationshipType: 'Shaping',
    relationshipTypeFa: 'شکل‌دهنده (Shaping)',
    theoreticalRationale: 'درک کاربر از اینکه سیستم نیازها و محدودیت‌های زندگی واقعی او را شناخته است، حس اطمینان و تعهد روانی ایجاد می‌کند.',
    metaEvidence: 'Tahvildari (2025); Mahmud et al. (2025)',
  },
  {
    id: 'REL-6',
    source: 'Macro Feedback Loop',
    target: 'Incumbent Institutional Adaptation',
    relationshipType: 'Reciprocal',
    relationshipTypeFa: 'بازخورد متقابل نهادی (Reciprocal Feedback)',
    theoreticalRationale: 'ورود فین‌تک‌های الگوریتمی نهادهای مالی سنتی (بانک‌ها و کارگزاری‌ها) را وادار به تغییر مدل کسب‌وکار و استخدام مشاوران هیبریدی می‌کند.',
    metaEvidence: 'Kumar (2024); Wexler & Oberlander (2021)',
  },
];

// =========================================================================
// 3. TRACEABLE CHANGE MATRIX (OUTPUT 2 TABLE)
// =========================================================================

export interface TraceableChangeItem {
  id: string;
  componentCode: string;
  componentTitle: string;
  initialMetaModel: string;
  expertFeedbackSummary: string;
  methodologicalDecision: 'Retained' | 'Revised' | 'Relocated' | 'Removed' | 'Added';
  methodologicalDecisionFa: string;
  rationale: string;
}

export const INITIAL_TRACEABLE_CHANGES: TraceableChangeItem[] = [
  {
    id: 'CHG-1',
    componentCode: 'HD1',
    componentTitle: 'Trust, Risk & Investor Psychology',
    initialMetaModel: 'بررسی عمومی اعتماد و ریسک بر پایه مطالعات رفتاری فین‌تک',
    expertFeedbackSummary: 'تایید کامل تفکیک اعتماد منفعل از کالیبراسیون اعتماد؛ تاکید بر سازوکار انتقال اعتماد از نهاد به الگوریتم',
    methodologicalDecision: 'Retained',
    methodologicalDecisionFa: 'تایید و تثبیت (Retained)',
    rationale: 'اجماع ۹۵٪ خبرگان مبنی بر اینکه کالیبراسیون اعتماد هسته اصلی رفتاری مدل است.',
  },
  {
    id: 'CHG-2',
    componentCode: 'ST7',
    componentTitle: 'Personalization Architecture',
    initialMetaModel: 'دسته‌بندی اولیه به عنوان بخشی فرعی از دسترسی و واسطه‌گری پلتفرمی',
    expertFeedbackSummary: 'شخصی‌سازی ماهیت تصمیم‌گیری شناختی دارد و باید مستقیماً زیرمجموعه HD2 (معماری تصمیم انسان-الگوریتم) قرار گیرد نه ساختار بازار',
    methodologicalDecision: 'Relocated',
    methodologicalDecisionFa: 'انتقال و بازجایابی ساختاری (Relocated to HD2)',
    rationale: 'ارتقای تناسب ساختاری (Structural fit) مدل بر مبنای منطق تصمیم‌گیری مشترک انسان و الگوریتم.',
  },
  {
    id: 'CHG-3',
    componentCode: 'HD2',
    componentTitle: 'Advisor-in-the-Loop (AITL)',
    initialMetaModel: 'طرح کلی گزینه‌های خودکارسازی و مشاوره ترکیبی',
    expertFeedbackSummary: 'رد اکید روبوادوایزری تمام‌خودکار در محیط‌های با نوسان بالا؛ تثبیت مدل هیبریدی AITL به عنوان استاندارد اصلی تصمیم‌گیری',
    methodologicalDecision: 'Revised',
    methodologicalDecisionFa: 'اصلاح و شفاف‌سازی عمیق (Revised)',
    rationale: 'همسویی با ملاحظات ریسک سیستماتیک و یافته‌های Asemi (2025) و Mahmud (2025).',
  },
  {
    id: 'CHG-4',
    componentCode: 'HD4',
    componentTitle: 'Algorithmic Governance Umbrella',
    initialMetaModel: 'مقررات‌گذاری به عنوان متغیر بیرونی محیطی در مدل',
    expertFeedbackSummary: 'حکمرانی باید لایه هنجاری چترمدار و فعال باشد که چهار گیت اخلاقی و پروانه AIRAL را تعریف می‌کند',
    methodologicalDecision: 'Revised',
    methodologicalDecisionFa: 'ارتقا به لایه چترمدار کلان (Revised as Umbrella)',
    rationale: 'شکست خودتنظیم‌گری بازار و لزوم نظارت فعال بر سوگیری‌های مدل‌های زاینده هوش مصنوعی.',
  },
  {
    id: 'CHG-5',
    componentCode: 'NEW-CVC',
    componentTitle: 'VC Certification & Intermediation',
    initialMetaModel: 'صرفاً اشاره به سرمایه‌گذاری جسورانه به عنوان منبع تامین مالی',
    expertFeedbackSummary: 'در اقتصادهای نوظهور، نقش VCها عمدتاً صدور تاییدیه کیفیت و کاهش عدم تقارن اطلاعاتی است تا تزریق سرمایه',
    methodologicalDecision: 'Added',
    methodologicalDecisionFa: 'افزوده شدن سازوکار جدید (Added Mechanism)',
    rationale: 'مستند به یافته‌های Camelo & Duarte (2025) و تایید خبرگان صنعت و رگولاتور.',
  },
];

// =========================================================================
// 4. IRANIAN CONTEXTUAL FACTORS (FUZZY DELPHI & DEMATEL CRITERIA)
// =========================================================================

export interface IranCriterionItem {
  id: string; // e.g., "C_GOV_1"
  dimensionId: 'HD1' | 'HD2' | 'HD3' | 'HD4';
  dimensionTitleFa: string;
  code: string;
  titleFa: string;
  titleEn: string;
  iranianContextualDescription: string;
  fuzzyL: number; // Low
  fuzzyM: number; // Mid
  fuzzyU: number; // High
  defuzzifiedScore: number;
  fuzzyScreeningStatus: 'retained' | 'revised' | 'excluded';
  dematelProminence?: number; // D + R
  dematelRelation?: number;   // D - R
  danpWeight?: number;        // Global priority %
  importanceIran: number;     // 1 to 7
  currentStateIran: number;   // 1 to 7
  gapScore: number;           // Importance - Current
  gapCategory: 'development_priority' | 'must_have' | 'context_dependent' | 'low_priority';
}

export const IRAN_CRITERIA_DATA: IranCriterionItem[] = [
  // HD4: Algorithmic Governance (Macro Level)
  {
    id: 'C_HD4_AIRAL',
    dimensionId: 'HD4',
    dimensionTitleFa: 'حکمرانی الگوریتمی و چارچوب‌های هنجاری (HD4)',
    code: 'G1',
    titleFa: 'استقرار رژیم پروانه فعالیت هوش مصنوعی مالی (AIRAL بومی)',
    titleEn: 'AI Robo-Advice Licensing (AIRAL)',
    iranianContextualDescription: 'تعیین دستورالعمل صدور مجوز اختصاصی توسط سازمان بورس و اوراق بهادار با ممیزی آزمون تناسب و مسئولیت حقوقی ضرر ناشی از خطای کد.',
    fuzzyL: 0.70,
    fuzzyM: 0.88,
    fuzzyU: 1.00,
    defuzzifiedScore: 0.865,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.8,
    currentStateIran: 2.2,
    gapScore: 4.6,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD4_SANDBOX',
    dimensionId: 'HD4',
    dimensionTitleFa: 'حکمرانی الگوریتمی و چارچوب‌های هنجاری (HD4)',
    code: 'G2',
    titleFa: 'سندباکس رگولاتوری چندنهادی (بورس، بانک مرکزی، بیمه)',
    titleEn: 'Cross-Regulatory FinTech Sandbox',
    iranianContextualDescription: 'ایجاد محیط آزمون کنترل‌شده مشترک برای رفع تشتت تصمیم‌گیری میان شورای عالی بورس و شورای پول و اعتبار در الگوریتم‌های مدیریت ثروت.',
    fuzzyL: 0.65,
    fuzzyM: 0.82,
    fuzzyU: 0.95,
    defuzzifiedScore: 0.81,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.5,
    currentStateIran: 2.9,
    gapScore: 3.6,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD4_AUDIT',
    dimensionId: 'HD4',
    dimensionTitleFa: 'حکمرانی الگوریتمی و چارچوب‌های هنجاری (HD4)',
    code: 'G3',
    titleFa: 'ممیزی مستقل سوگیری الگوریتم و آزمون‌های جعبه سیاه',
    titleEn: 'Independent Fairness & Bias Audits',
    iranianContextualDescription: 'الزام پلتفرم‌های سرمایه‌گذاری الگوریتمی به ارزیابی ادواری خروجی مدل‌ها در مواجهه با دارایی‌های مختلف جهت جلوگیری از تعصب به نمادهای خاص.',
    fuzzyL: 0.60,
    fuzzyM: 0.78,
    fuzzyU: 0.92,
    defuzzifiedScore: 0.77,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.3,
    currentStateIran: 2.0,
    gapScore: 4.3,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD4_INVESTOR_PROT',
    dimensionId: 'HD4',
    dimensionTitleFa: 'حکمرانی الگوریتمی و چارچوب‌های هنجاری (HD4)',
    code: 'G4',
    titleFa: 'چتر اطمینان و صندوق جبران خسارت خطای سیستمی سرمایه‌گذار',
    titleEn: 'Systemic Error Compensation Scheme',
    iranianContextualDescription: 'سازوکار بیمه‌ای یا صندوق تضمین برای جبران خسارت‌های ناشی از قطعی سامانه یا خطاهای فاحش پردازش داده‌های بازار.',
    fuzzyL: 0.58,
    fuzzyM: 0.74,
    fuzzyU: 0.90,
    defuzzifiedScore: 0.74,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.4,
    currentStateIran: 2.4,
    gapScore: 4.0,
    gapCategory: 'development_priority',
  },

  // HD2: Human-Algorithm Decision Architecture
  {
    id: 'C_HD2_AITL',
    dimensionId: 'HD2',
    dimensionTitleFa: 'معماری تصمیم انسان-الگوریتم (HD2)',
    code: 'D1',
    titleFa: 'معماری عملیاتی مشاور-در-حلقه (Advisor-in-the-Loop)',
    titleEn: 'Operational Advisor-in-the-Loop Architecture',
    iranianContextualDescription: 'تطبیق سامانه با الزامات سبدگردانی اختصاصی بورس: هوش مصنوعی پردازشگر و پیشنهاددهنده، مدیر سرمایه‌گذاری دارای صلاحیت تاییدکننده نهایی.',
    fuzzyL: 0.75,
    fuzzyM: 0.92,
    fuzzyU: 1.00,
    defuzzifiedScore: 0.898,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.9,
    currentStateIran: 3.4,
    gapScore: 3.5,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD2_MULTI_ASSET',
    dimensionId: 'HD2',
    dimensionTitleFa: 'معماری تصمیم انسان-الگوریتم (HD2)',
    code: 'D2',
    titleFa: 'شخصی‌سازی متناسب با سبد دارایی خانوار ایرانی (طلا، ملک، تورم)',
    titleEn: 'Multi-Asset Contextual Personalization',
    iranianContextualDescription: 'فراتر رفتن از نمره ریسک فرمولی و ادغام متغیرهای دارایی غیربورسی (مسکن، طلا، خودرو) و تعهدات اقساطی در بازچینش پورتفوی پیشنهادی.',
    fuzzyL: 0.72,
    fuzzyM: 0.89,
    fuzzyU: 0.98,
    defuzzifiedScore: 0.87,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.7,
    currentStateIran: 2.6,
    gapScore: 4.1,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD2_NUDGES',
    dimensionId: 'HD2',
    dimensionTitleFa: 'معماری تصمیم انسان-الگوریتم (HD2)',
    code: 'D3',
    titleFa: 'تلنگرهای رفتاری هوشمند در برابر هیجانات صف خرید/فروش',
    titleEn: 'Behavioral Nudges Against Herding & Panic',
    iranianContextualDescription: 'نمایش هشدارهای سنجیده و تاخیرهای شناختی در زمان تصمیمات هیجانی سرمایه‌گذار در شرایط قفل صف‌های بازار سهام تهران.',
    fuzzyL: 0.62,
    fuzzyM: 0.80,
    fuzzyU: 0.92,
    defuzzifiedScore: 0.785,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.2,
    currentStateIran: 2.8,
    gapScore: 3.4,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD2_CIRCUIT_BREAKER',
    dimensionId: 'HD2',
    dimensionTitleFa: 'معماری تصمیم انسان-الگوریتم (HD2)',
    code: 'D4',
    titleFa: 'سوئیچ قطع اضطراری خودکار در زمان شوک‌های سیستماتیک کلان',
    titleEn: 'Algorithmic Macro Shock Circuit-Breaker',
    iranianContextualDescription: 'توقف فوری سیگنال‌های الگوریتمی در زمان جهش‌های ارزی ناگهانی یا ابلاغ مصوبات شبانه تا تحلیل اثر توسط کمیته سرمایه‌گذاری.',
    fuzzyL: 0.70,
    fuzzyM: 0.85,
    fuzzyU: 0.96,
    defuzzifiedScore: 0.84,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.6,
    currentStateIran: 3.1,
    gapScore: 3.5,
    gapCategory: 'development_priority',
  },

  // HD1: Trust, Risk & Investor Psychology
  {
    id: 'C_HD1_TRUST_TRANSFER',
    dimensionId: 'HD1',
    dimensionTitleFa: 'روانشناسی سرمایه‌گذار و کالیبراسیون اعتماد (HD1)',
    code: 'T1',
    titleFa: 'سازوکار انتقال اعتبار از نهادهای معتبر بازار سرمایه',
    titleEn: 'Institutional Trust Transfer Mechanism',
    iranianContextualDescription: 'بهره‌گیری از اعتبار و سابقه سبدگردان‌ها و صندوق‌های خوش‌نام بازار برای عبور از بی‌اعتمادی تاریخی سرمایه‌گذاران پس از ریزش سال ۱۳۹۹.',
    fuzzyL: 0.74,
    fuzzyM: 0.90,
    fuzzyU: 0.98,
    defuzzifiedScore: 0.88,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.8,
    currentStateIran: 3.6,
    gapScore: 3.2,
    gapCategory: 'must_have',
  },
  {
    id: 'C_HD1_INFLATION_BENCH',
    dimensionId: 'HD1',
    dimensionTitleFa: 'روانشناسی سرمایه‌گذار و کالیبراسیون اعتماد (HD1)',
    code: 'T2',
    titleFa: 'سنجش عملکرد بر مبنای حفظ ارزش پول در برابر طلا و تورم',
    titleEn: 'Inflation-Adjusted & Gold Performance Benchmarking',
    iranianContextualDescription: 'تعریف بازده حقیقی به عنوان سنجه اصلی موفقیت روبوادوایزر به جای بازده اسمی، متناسب با دغدغه حفظ قدرت خرید شهروند ایرانی.',
    fuzzyL: 0.68,
    fuzzyM: 0.86,
    fuzzyU: 0.96,
    defuzzifiedScore: 0.84,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.5,
    currentStateIran: 2.7,
    gapScore: 3.8,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD1_CALIBRATION_UI',
    dimensionId: 'HD1',
    dimensionTitleFa: 'روانشناسی سرمایه‌گذار و کالیبراسیون اعتماد (HD1)',
    code: 'T3',
    titleFa: 'رابط کاربری شفاف‌ساز منطق الگوریتم و سناریوهای استرس',
    titleEn: 'Explainable UI & Worst-Case Scenario Simulation',
    iranianContextualDescription: 'نمایش شفاف عملکرد الگوریتم در بدترین ریزش‌های گذشته تا سرمایه‌گذار دچار توهم مصونیت از زیان نگردد (کالیبراسیون دقیق اعتماد).',
    fuzzyL: 0.64,
    fuzzyM: 0.81,
    fuzzyU: 0.94,
    defuzzifiedScore: 0.80,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.3,
    currentStateIran: 2.5,
    gapScore: 3.8,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD1_PRINCIPAL_PROT',
    dimensionId: 'HD1',
    dimensionTitleFa: 'روانشناسی سرمایه‌گذار و کالیبراسیون اعتماد (HD1)',
    code: 'T4',
    titleFa: 'تلفیق با صندوق‌های تضمین اصل سرمایه جهت جذب افراد محافظه‌کار',
    titleEn: 'Capital-Protected Strategies for Retail Onboarding',
    iranianContextualDescription: 'اتصال الگوریتم به صندوق‌های تضمین اصل دارایی یا ابزارهای درآمد ثابت برای کاهش وحشت اولیه سرمایه‌گذاران خرد.',
    fuzzyL: 0.55,
    fuzzyM: 0.72,
    fuzzyU: 0.88,
    defuzzifiedScore: 0.718,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 5.9,
    currentStateIran: 4.1,
    gapScore: 1.8,
    gapCategory: 'must_have',
  },

  // HD3: Structural Market Transformation & Access
  {
    id: 'C_HD3_CONSORTIUM',
    dimensionId: 'HD3',
    dimensionTitleFa: 'تحول ساختاری بازار و واسطه‌گری دیجیتال (HD3)',
    code: 'M1',
    titleFa: 'کنسرسیوم‌های همزیستی فین‌تک‌های نوآور با هلدینگ‌های مالی',
    titleEn: 'FinTech-Incumbent Collaborative Consortiums',
    iranianContextualDescription: 'مدل همکاری مشترک که مانع بلعیده شدن یا خفگی استارتاپ‌های الگوریتمی توسط انحصار بانک‌ها و نهادهای مالی خصولتی شود.',
    fuzzyL: 0.65,
    fuzzyM: 0.83,
    fuzzyU: 0.95,
    defuzzifiedScore: 0.815,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.4,
    currentStateIran: 3.0,
    gapScore: 3.4,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD3_OPEN_API',
    dimensionId: 'HD3',
    dimensionTitleFa: 'تحول ساختاری بازار و واسطه‌گری دیجیتال (HD3)',
    code: 'M2',
    titleFa: 'آزادسازی وب‌سرویس‌های آنلاین هسته معاملات و اطلاعات سهامداری',
    titleEn: 'Open Finance & Real-Time Trading Core APIs',
    iranianContextualDescription: 'اجبار شرکت مدیریت فناوری بورس (TSETMC) و سپرده‌گذاری مرکزی به ارائه وب‌سرویس‌های پایدار و کم‌هزینه به فین‌تک‌ها.',
    fuzzyL: 0.75,
    fuzzyM: 0.93,
    fuzzyU: 1.00,
    defuzzifiedScore: 0.903,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.9,
    currentStateIran: 2.3,
    gapScore: 4.6,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD3_EDALAT_ACCESS',
    dimensionId: 'HD3',
    dimensionTitleFa: 'تحول ساختاری بازار و واسطه‌گری دیجیتال (HD3)',
    code: 'M3',
    titleFa: 'دموکراتیزه‌سازی مدیریت دارایی برای ۴۹ میلیون دارنده سهام عدالت',
    titleEn: 'Mass Inclusion for Justice Shares (Saham-e Edalat)',
    iranianContextualDescription: 'توسعه روبوادوایزری کم‌کارمزد و ساده‌شده در بستر موبایل برای ارتقای بازده دارایی‌های سهام عدالت دهک‌های متوسط و پایین جامعه.',
    fuzzyL: 0.66,
    fuzzyM: 0.84,
    fuzzyU: 0.95,
    defuzzifiedScore: 0.823,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 6.6,
    currentStateIran: 2.1,
    gapScore: 4.5,
    gapCategory: 'development_priority',
  },
  {
    id: 'C_HD3_VC_CERTIFY',
    dimensionId: 'HD3',
    dimensionTitleFa: 'تحول ساختاری بازار و واسطه‌گری دیجیتال (HD3)',
    code: 'M4',
    titleFa: 'سازوکار سیگنال‌دهی اعتبار توسط صندوق‌های جسورانه شرکتی (CVC)',
    titleEn: 'Corporate VC Certification & Due-Diligence Signals',
    iranianContextualDescription: 'مشارکت صندوق‌های جسورانه معتبر در پلتفرم‌های ثروت‌تک به عنوان مهر تایید فنی و شفافیت عملکردی برای سرمایه‌گذاران.',
    fuzzyL: 0.58,
    fuzzyM: 0.73,
    fuzzyU: 0.88,
    defuzzifiedScore: 0.73,
    fuzzyScreeningStatus: 'retained',
    importanceIran: 5.8,
    currentStateIran: 3.2,
    gapScore: 2.6,
    gapCategory: 'context_dependent',
  },
];

// =========================================================================
// 5. DEFAULT DEMATEL DIRECT INFLUENCE MATRIX (FOR HD1 to HD4)
// Scale: 0 = No influence, 1 = Very low, 2 = Low, 3 = High, 4 = Very high
// =========================================================================

export const DEFAULT_DEMATEL_DIRECT_MATRIX: number[][] = [
  // HD1 (Trust), HD2 (Decision), HD3 (Market), HD4 (Governance)
  [0, 2, 2, 1], // HD1 -> [HD1, HD2, HD3, HD4]
  [3, 0, 2, 1], // HD2 -> [HD1, HD2, HD3, HD4]
  [2, 3, 0, 1], // HD3 -> [HD1, HD2, HD3, HD4]
  [4, 4, 3, 0], // HD4 -> [HD1, HD2, HD3, HD4]
];

export const DEMATEL_DIMENSION_NAMES = [
  { code: 'HD1', labelFa: 'روانشناسی و اعتماد (HD1)', labelEn: 'Trust & Psychology' },
  { code: 'HD2', labelFa: 'معماری تصمیم انسان-الگوریتم (HD2)', labelEn: 'Decision Architecture' },
  { code: 'HD3', labelFa: 'تحول ساختاری بازار (HD3)', labelEn: 'Market Transformation' },
  { code: 'HD4', labelFa: 'حکمرانی الگوریتمی (HD4)', labelEn: 'Algorithmic Governance' },
];

// =========================================================================
// 6. IRANIAN IDEAL ARCHITECTURE (5-LAYER SYSTEM SPECIFICATION)
// =========================================================================

export interface ArchitectureLayerItem {
  layerNumber: number;
  layerCode: string;
  titleFa: string;
  titleEn: string;
  associatedDimension: string;
  causalRole: 'Systemic Cause (علت بنیادین)' | 'Intermediary / Operational (میانجی عملیاتی)' | 'Systemic Effect / Outcome (پیامد و دستاورد)';
  keyComponents: string[];
  governanceInstruments: string[];
  iranianActionables: string[];
  statusColor: string;
}

export const IRANIAN_IDEAL_ARCHITECTURE_LAYERS: ArchitectureLayerItem[] = [
  {
    layerNumber: 1,
    layerCode: 'LAYER-GOVERNANCE',
    titleFa: 'لایه ۱: حکمرانی الگوریتمی، رگولاتوری و هنجارهای سیستمی',
    titleEn: 'Layer 1 — Algorithmic Governance & Normative Umbrella',
    associatedDimension: 'HD4 (Algorithmic Governance)',
    causalRole: 'Systemic Cause (علت بنیادین)',
    keyComponents: [
      'رژیم صدور پروانه هوش مصنوعی مالی (AIRAL بومی بورس تهران)',
      'سندباکس رگولاتوری چندنهادی بازار سرمایه و بانک مرکزی',
      'چهار دروازه اخلاقی (ممیزی عدم تعصب، صلاحیت محاسباتی، رقابت عادلانه و چتر اطمینان)',
      'پروتکل‌های مسئولیت حقوقی خطاهای ناخواسته کد و زیان کاربر',
    ],
    governanceInstruments: [
      'دستورالعمل جامع مصوب شورای عالی بورس',
      'کمیته مستقل آزمون و ممیزی الگوریتم‌ها در سازمان بورس',
      'صندوق تضمین خسارت خطای فنی سامانه‌ها',
    ],
    iranianActionables: [
      'تصویب ضوابط آزمون تناسب (Suitability Test) ویژه الگوریتم‌های سرمایه‌گذاری',
      'رفع تشتت میان رگولاتور پولی و بازار سرمایه در مدیریت ثروت خرد',
    ],
    statusColor: 'slate',
  },
  {
    layerNumber: 2,
    layerCode: 'LAYER-DECISION',
    titleFa: 'لایه ۲: معماری تصمیم تعاملی انسان-الگوریتم (AITL)',
    titleEn: 'Layer 2 — Human–Algorithm Decision Architecture',
    associatedDimension: 'HD2 (Decision Architecture)',
    causalRole: 'Intermediary / Operational (میانجی عملیاتی)',
    keyComponents: [
      'مدل ترکیبی مشاور-در-حلقه (Advisor-in-the-Loop) متناسب با مجوزهای سبدگردانی بورس',
      'شخصی‌سازی چنددارایی (طلا، مسکن، خودرو، بدهی و افق زمانی خانوار)',
      'تلنگرهای رفتاری هوشمند برای مهار رفتارهای گله‌ای و هراس صف‌های بازار',
      'سوئیچ قطع اضطراری خودکار (Macro Circuit-Breaker) در شوک‌های سیستماتیک کلان',
    ],
    governanceInstruments: [
      'الگوی تفویض اختیار شفاف میان الگوریتم و مدیر سرمایه‌گذاری دارای صلاحیت',
      'داشبورد مانیتورینگ بلادرنگ ریسک و نسبت‌های نقدشوندگی سبد',
    ],
    iranianActionables: [
      'ممنوعیت کامل سیستم‌های ۱۰۰٪ خودکار بدون نظارت انسان در شرایط شوک بازار',
      'ارتقای پرسشنامه‌های کلیشه‌ای ارزیابی ریسک به سامانه‌های تطبیقی پویا',
    ],
    statusColor: 'indigo',
  },
  {
    layerNumber: 3,
    layerCode: 'LAYER-TRUST',
    titleFa: 'لایه ۳: روانشناسی سرمایه‌گذار و کالیبراسیون اعتماد',
    titleEn: 'Layer 3 — Trust Calibration & Investor Psychology',
    associatedDimension: 'HD1 (Trust & Psychology)',
    causalRole: 'Intermediary / Operational (میانجی عملیاتی)',
    keyComponents: [
      'کالیبراسیون اعتماد: تطابق سطح اتکای کاربر با شایستگی واقعی الگوریتم',
      'سازوکار انتقال اعتبار از نهادهای سنتی خوش‌نام بازار سرمایه به پلتفرم',
      'سنجه‌های عملکرد تعدیل‌شده با نرخ تورم و طلا برای حفظ قدرت خرید حقیقی',
      'رابط کاربری تبیین‌پذیر و شبیه‌ساز سناریوهای بحران گذشته',
    ],
    governanceInstruments: [
      'استاندارد افشای شفاف افت‌های تاریخی (Max Drawdown)',
      'تلفیق سبدهای الگوریتمی با صندوق‌های تضمین اصل سرمایه',
    ],
    iranianActionables: [
      'بازسازی سرمایه اجتماعی آسیب‌دیده از ریزش ۱۳۹۹ با نمایش تعهدات عملکردی',
      'ارائه آموزش‌های گام‌به‌گام تعاملی در اپلیکیشن‌های معاملاتی',
    ],
    statusColor: 'emerald',
  },
  {
    layerNumber: 4,
    layerCode: 'LAYER-MARKET',
    titleFa: 'لایه ۴: ساختار بازار، باز-واسطه‌گری و زیرساخت پلتفرمی',
    titleEn: 'Layer 4 — Market Structure, Re-intermediation & Platform Infra',
    associatedDimension: 'HD3 (Market Transformation)',
    causalRole: 'Intermediary / Operational (میانجی عملیاتی)',
    keyComponents: [
      'باز-واسطه‌گری پلتفرمی: همزیستی فین‌تک‌های مستقل با سبدگردان‌ها و بانک‌ها',
      'آزادسازی وب‌سرویس‌های برخط هسته معاملات و شرکت سپرده‌گذاری مرکزی',
      'مهر تایید و سرمایه‌گذاری مشترک صندوق‌های جسورانه شرکتی (CVC)',
      'زیرساخت ابری ایمن داخلی و پایگاه داده تاریخی منقح بازار سرمایه',
    ],
    governanceInstruments: [
      'الزام شرکت مدیریت فناوری بورس (TSETMC) به قراردادهای سطح خدمت (SLA)',
      'ضوابط ضدتراست و تسهیل دسترسی بازیگران نوآور به وب‌سرویس‌های بانکی',
    ],
    iranianActionables: [
      'تشکیل کنسرسیوم مشترک فین‌تک و نهادهای مالی جهت تجمیع قدرت بازاریابی',
      'کاهش هزینه‌های سرسام‌آور اتصال به زیرساخت‌های هسته بورس',
    ],
    statusColor: 'amber',
  },
  {
    layerNumber: 5,
    layerCode: 'LAYER-OUTCOMES',
    titleFa: 'لایه ۵: شمول مالی همگانی، تاب‌آوری و کارایی سرمایه‌گذاری',
    titleEn: 'Layer 5 — Financial Inclusion & Systemic Resilience Outcomes',
    associatedDimension: 'Investment & Societal Outcomes',
    causalRole: 'Systemic Effect / Outcome (پیامد و دستاورد)',
    keyComponents: [
      'مدیریت دارایی هوشمند برای ۴۹ میلیون دارنده سهام عدالت و سرمایه‌گذاران خرد',
      'حذف جریان‌های غیررسمی سیگنال‌فروشی تلگرامی با ابزارهای قانون‌مند هوشمند',
      'ارتقای نسبت شارپ و تخصیص بهینه منابع به بخش‌های مولد اقتصاد',
      'کاهش نوسانات مخرب هیجانی در بورس اوراق بهادار تهران',
    ],
    governanceInstruments: [
      'شاخص پایش سلامت مالی و شمول ثروت در گزارش سالانه سازمان بورس',
      'پویش‌های ملی آموزش سواد مالی الگوریتمی در رسانه‌ها',
    ],
    iranianActionables: [
      'رساندن حداقل مبلغ افتتاح حساب روبوادوایزری به زیر ۵۰۰ هزار تومان',
      'امکان مدیریت خودکار سود نقدی سهام عدالت در صندوق‌های سرمایه‌گذاری',
    ],
    statusColor: 'cyan',
  },
];

// =========================================================================
// 7. STRATEGIC ROADMAP FOR IRAN (3 HORIZONS)
// =========================================================================

export interface RoadmapHorizonItem {
  horizon: 'short_term' | 'mid_term' | 'long_term';
  timeframeFa: string;
  titleFa: string;
  leadAgenciesFa: string;
  keyInitiatives: {
    title: string;
    description: string;
    priority: 'حیاتی' | 'بالا' | 'متوسط';
    deliverable: string;
  }[];
}

export const IRAN_STRATEGIC_ROADMAP: RoadmapHorizonItem[] = [
  {
    horizon: 'short_term',
    timeframeFa: 'افق کوتاه‌مدت (سال ۱ الی ۲ - اقدامات ضربتی و زیرساختی)',
    titleFa: 'تثبیت رگولاتوری، گشایش وب‌سرویس‌ها و پایلوت‌های هیبریدی',
    leadAgenciesFa: 'سازمان بورس و اوراق بهادار، شرکت مدیریت فناوری بورس (TSETMC)، انجمن فین‌تک',
    keyInitiatives: [
      {
        title: 'تدوین و ابلاغ دستورالعمل مجوز روبوادوایزری (AIRAL بومی)',
        description: 'تصویب آیین‌نامه سبدگردانی الگوریتمی با تاکید بر معماری مشاور-در-حلقه (AITL) و حداقل الزامات فنی و اخلاقی.',
        priority: 'حیاتی',
        deliverable: 'آیین‌نامه رسمی ابلاغی سازمان بورس',
      },
      {
        title: 'آزادسازی وب‌سرویس‌های اختصاصی معاملات الگوریتمی',
        description: 'ارائه APIهای پرسرعت هسته معاملات و وب‌سرویس پورتفوی سپرده‌گذاری مرکزی به شرکت‌های سبدگردان و فین‌تک‌های تاییدشده.',
        priority: 'حیاتی',
        deliverable: 'سامانه دسترسی یکپارچه Open Market API',
      },
      {
        title: 'طراحی آزمون تناسب پویا و پروتکل‌های قطع اضطراری',
        description: 'جایگزینی فرم‌های سنتی ریسک با آزمون‌های تناسب چنددارایی و سوئیچ قطع در شوک‌های کلان اقتصادی.',
        priority: 'بالا',
        deliverable: 'چارچوب استاندارد آزمون تناسب (Suitability Test V1)',
      },
    ],
  },
  {
    horizon: 'mid_term',
    timeframeFa: 'افق میان‌مدت (سال ۲ الی ۳ - تجاری‌سازی و گسترش بازار)',
    titleFa: 'همزیستی کنسرسیومی، توسعه صندوق‌های ترکیبی و سندباکس مشترک',
    leadAgenciesFa: 'بانک مرکزی، سازمان بورس، کانون نهادهای سرمایه‌گذاری، شرکت‌های تامین سرمایه',
    keyInitiatives: [
      {
        title: 'استقرار سندباکس رگولاتوری مشترک بازار سرمایه و شبکه بانکی',
        description: 'ایجاد میز آزمایشگاهی مشترک برای اعتبارسنجی الگوریتم‌های سرمایه‌گذاری تلفیقی بانکی-بورسی و بیمه‌ای.',
        priority: 'حیاتی',
        deliverable: 'آزمایشگاه رگولاتوری چندبخشی فین‌تک',
      },
      {
        title: 'ایجاد کنسرسیوم‌های فین‌تک با غول‌های سرمایه‌گذاری و کارگزاری‌ها',
        description: 'اتصال موتورهای تحلیلی فین‌تک‌ها به پایگاه مشتریان میلیونی کارگزاری‌ها با مدل شراکت درآمدی شفاف.',
        priority: 'بالا',
        deliverable: 'پلتفرم‌های تجاری مشترک WealthTech',
      },
      {
        title: 'ممیزی مستقل انصاف و سوگیری الگوریتم‌ها',
        description: 'تشکیل نهادهای ممیزی ثالث برای ارزیابی کدها و جلوگیری از دستکاری تعمدی قیمت‌ها یا تعصبات مدلی.',
        priority: 'بالا',
        deliverable: 'گواهی‌نامه ممیزی اخلاق الگوریتمی (Fairness Certificate)',
      },
    ],
  },
  {
    horizon: 'long_term',
    timeframeFa: 'افق بلندمدت (سال ۳ الی ۵ - بلوغ اکوسیستم و شمول ملی)',
    titleFa: 'مدیریت ثروت همگانی، سهام عدالت و یکپارچگی با هوش مصنوعی مولد',
    leadAgenciesFa: 'شورای عالی بورس، شورای عالی فضای مجازی، وزارت امور اقتصادی و دارایی',
    keyInitiatives: [
      {
        title: 'اتصال سهام عدالت به سامانه‌های روبوادوایزری هوشمند خرد',
        description: 'امکان مدیریت خودکار پرتفوی سهام عدالت برای دهک‌های درآمدی مختلف با حداقل کارمزد و تضمین شفافیت.',
        priority: 'حیاتی',
        deliverable: 'پوشش حداقل ۱۰ میلیون دارنده سهام عدالت',
      },
      {
        title: 'یکپارچگی مدل‌های هوش مصنوعی زاینده بومی با تحلیل‌های بنیادی',
        description: 'بهره‌گیری از مدل‌های زبان بزرگ مالی آموزش‌دیده بر روی داده‌های کدال برای پاسخگویی تعاملی و مشاوره ۲۴ ساعته.',
        priority: 'بالا',
        deliverable: 'چت‌بات مالی تاییدشده تحت نظارت مشاور انسانی',
      },
      {
        title: 'بین‌المللی‌سازی و جذب سرمایه‌های منطقه‌ای',
        description: 'توسعه پلتفرم‌های الگوریتمی چندارزی برای اتصال به بازارهای مالی منطقه‌ای و جذب سرمایه‌های خرد خارجی.',
        priority: 'متوسط',
        deliverable: 'درگاه مدیریت دارایی فرامرزی',
      },
    ],
  },
];
