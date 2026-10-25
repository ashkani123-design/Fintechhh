/**
 * RESEARCH BASELINE MODEL (Framework Version 1.0)
 * From Meta-Synthesis to Ideal Digital Investment Architecture for Iran
 *
 * NOTE: As per academic research protocol, this baseline model is immutable.
 * All expert additions, revisions, and remappings are stored separately as
 * proposed candidates and require researcher/admin approval.
 */

export interface BaselineHD {
  id: 'HD1' | 'HD2' | 'HD3' | 'HD4';
  nameEn: string;
  nameFa: string;
  definitionEn: string;
  definitionFa: string;
  constituentThemes: ('ST1' | 'ST2' | 'ST3' | 'ST4' | 'ST5' | 'ST6' | 'ST7')[];
  coreMechanisms: { en: string; fa: string }[];
  boundaryConditions: { en: string; fa: string }[];
  rationaleFa: string;
}

export interface BaselineST {
  id: 'ST1' | 'ST2' | 'ST3' | 'ST4' | 'ST5' | 'ST6' | 'ST7';
  nameEn: string;
  nameFa: string;
  definitionEn: string;
  definitionFa: string;
  assignedHD: 'HD1' | 'HD2' | 'HD3' | 'HD4';
  coreMechanisms: string[];
}

export interface BaselineRelationship {
  id: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7';
  fromEn: string;
  fromFa: string;
  toEn: string;
  toFa: string;
  typeEn: 'Enabling / Reciprocal' | 'Complementary' | 'Enabling / Conditional' | 'Enabling' | 'Conditional' | 'Shaping' | 'Tension';
  typeFa: string;
  theoreticalRationaleFa: string;
  literatureEvidence: string;
}

export interface BaselineFeedbackLoop {
  id: 'FB1' | 'FB2';
  nameEn: string;
  nameFa: string;
  level: 'micro' | 'macro';
  stepsEn: string[];
  stepsFa: string[];
  descriptionFa: string;
  literatureEvidence: string;
}

export interface BaselineContradiction {
  id: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  code: string;
  titleEn: string;
  titleFa: string;
  meaningEn: string;
  meaningFa: string;
  literatureEvidence: string;
  iranianRelevanceFa: string;
}

export interface BaselineOutcome {
  id: 'OUT1' | 'OUT2' | 'OUT3';
  nameEn: string;
  nameFa: string;
  definitionEn: string;
  definitionFa: string;
  indicatorsFa: string[];
}

export interface IranDiscoveryQuestion {
  id: string; // Q-IR-01 to Q-IR-11
  code: string;
  titleFa: string;
  titleEn: string;
  promptFa: string;
  defaultTag: string;
  probingNotesFa: string;
}

export interface IranCandidateFactor {
  id: string; // IR-001, IR-002, etc.
  code: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  category: 'governance' | 'decision_architecture' | 'trust_behavior' | 'market_structure' | 'capability' | 'boundary_condition';
  assignedHD: 'HD1' | 'HD2' | 'HD3' | 'HD4';
  assignedST?: string;
  approvalStatus: 'approved' | 'pending_review' | 'merged' | 'rejected';
  proposedByExpertId?: string;
  sourceQuestionId?: string;
  // Quantitative defaults for analysis pipeline
  fuzzyTFN: { l: number; m: number; u: number };
  importance: number; // 1-7
  currentState: number; // 1-7
  feasibility: number; // 1-7
  urgency: number; // 1-7
  danpWeight?: number;
}

// =========================================================================
// 1. FOUR HIGHER-ORDER DIMENSIONS (HD1 to HD4)
// =========================================================================

export const BASELINE_HDS: Record<string, BaselineHD> = {
  HD1: {
    id: 'HD1',
    nameEn: 'Trust, Risk & Investor Psychology in Digital Investment',
    nameFa: 'روانشناسی سرمایه‌گذار، اعتماد و ریسک در سرمایه‌گذاری دیجیتال',
    definitionEn:
      'How investors perceive, trust, and respond to digital investment systems, integrating the psychological, behavioral, and relational mechanisms through which trust is formed, risk is assessed, and adoption or resistance behaviors emerge.',
    definitionFa:
      'نحوه ادراک، اعتمادسازی و واکنش سرمایه‌گذاران به سامانه‌های دیجیتال، تلفیق سازوکارهای روانشناختی، رفتاری و رابطه‌ای که از طریق آن‌ها اعتماد شکل می‌گیرد، ریسک ارزیابی می‌شود و رفتارهای پذیرش یا مقاومت بروز می‌یابد.',
    constituentThemes: ['ST1', 'ST5'],
    coreMechanisms: [
      { en: 'Trust calibration', fa: 'کالیبراسیون اعتماد (تطابق اتکا با شایستگی عینی سیستم)' },
      { en: 'Trust formation', fa: 'شکل‌گیری اعتماد اولیه' },
      { en: 'Trust transfer', fa: 'انتقال اعتبار از نهاد مالی/بانک به الگوریتم' },
      { en: 'Behavioral dynamics', fa: 'پویایی‌های رفتاری و احساسی' },
      { en: 'Adoption', fa: 'پذیرش و قصد استفاده مداوم' },
      { en: 'Resistance', fa: 'مقاومت در برابر اتوماسیون' },
      { en: 'Risk perception', fa: 'ادراک ریسک نوسان و زیان' },
    ],
    boundaryConditions: [
      { en: 'Investor experience', fa: 'تجربه قبلی سرمایه‌گذار' },
      { en: 'Financial literacy', fa: 'سواد مالی و دیجیتال' },
      { en: 'Cultural/contextual conditions', fa: 'بافت فرهنگی، نهادی و تاریخی' },
    ],
    rationaleFa: 'این بعد زیربنای روان‌شناختی تعامل کاربر با سیستم را تشکیل داده و مانع از تقلیل فناوری به یک ابزار ابزاری صرف می‌شود.',
  },
  HD2: {
    id: 'HD2',
    nameEn: 'Human–Algorithm Decision Architecture',
    nameFa: 'معماری تصمیم انسان-الگوریتم',
    definitionEn:
      'How investment decisions are structured, personalized, and executed through the integration of human judgment and algorithmic systems, including delegation of decision authority, personalization of advice, and behavioral interventions that shape decision outcomes.',
    definitionFa:
      'نحوه ساختاربندی، شخصی‌سازی و اجرای تصمیمات سرمایه‌گذاری از طریق ادغام قضاوت انسان و سیستم‌های الگوریتمی، شامل تفویض اختیار تصمیم‌گیری، شخصی‌سازی توصیه‌ها و مداخلات رفتاری شکل‌دهنده به نتایج.',
    constituentThemes: ['ST2', 'ST7'],
    coreMechanisms: [
      { en: 'Hybrid advisory', fa: 'مشاوره ترکیبی هیبریدی' },
      { en: 'Advisor-in-the-loop', fa: 'مدل مشاور-در-حلقه (AITL)' },
      { en: 'Human oversight', fa: 'نظارت و کنترل انسان بر تصمیم' },
      { en: 'Algorithmic delegation', fa: 'تفویض محاسبات به الگوریتم' },
      { en: 'Personalization', fa: 'شخصی‌سازی سبد و توصیه‌ها' },
      { en: 'Behavioral intervention', fa: 'مداخلات و تلنگرهای رفتاری هوشمند' },
      { en: 'Investor autonomy', fa: 'حفظ استقلال و اختیار تصمیم‌گیری سرمایه‌گذار' },
    ],
    boundaryConditions: [
      { en: 'User segment', fa: 'بخش‌بندی تیپ رفتاری و ثروت کاربران' },
      { en: 'Task type', fa: 'نوع وظیفه تحلیلی، معاملاتی یا بازچینی' },
      { en: 'Regulatory context', fa: 'الزامات قانونی مسئولیت مدیر سرمایه‌گذاری' },
    ],
    rationaleFa: 'این بعد هسته عملیاتی تصمیم‌گیری است و تعادل میان اتکای کورکورانه به الگوریتم و گریز غیرعقلایی از آن را ساختار می‌دهد.',
  },
  HD3: {
    id: 'HD3',
    nameEn: 'Structural Transformation of Investment Markets and Access',
    nameFa: 'تحول ساختاری بازارهای سرمایه‌گذاری و دسترسی',
    definitionEn:
      'How digital technologies transform the structure of investment markets, including intermediation, access, participation, and organizational dynamics, and how these structural changes affect who can participate and how benefits are distributed.',
    definitionFa:
      'نحوه دگرگونی ساختار بازارهای سرمایه‌گذاری توسط فناوری‌های دیجیتال، شامل واسطه‌گری، دسترسی، مشارکت و پویایی‌های سازمانی، و چگونگی اثرگذاری این دگرگونی‌ها بر این‌که چه کسانی می‌توانند مشارکت کنند و منافع چگونه توزیع می‌شود.',
    constituentThemes: ['ST3', 'ST4'],
    coreMechanisms: [
      { en: 'Platform intermediation', fa: 'واسطه‌گری پلتفرمی دیجیتال' },
      { en: 'Disintermediation', fa: 'حذف مقطعی واسطه‌های سنتی ناکارآمد' },
      { en: 'Re-intermediation', fa: 'باز-واسطه‌گری و ظهور واسطه‌های جدید پلتفرمی' },
      { en: 'Digital matching', fa: 'تطبیق دیجیتال سفارش‌ها و نیازهای مالی' },
      { en: 'Market participation', fa: 'ورود توده‌های جدید سرمایه‌گذاران خرد' },
      { en: 'Democratization', fa: 'دموکراتیزه‌سازی دسترسی به مدیریت ثروت' },
      { en: 'Access stratification', fa: 'لایه‌بندی نابرابر دسترسی بر اساس قابلیت تحلیلی' },
    ],
    boundaryConditions: [
      { en: 'Market type', fa: 'نوع بازار (سهام، ابزارهای درآمد ثابت، رمزارز)' },
      { en: 'Regulatory environment', fa: 'محیط مقرراتی و قواعد انحصار' },
      { en: 'Investor sophistication', fa: 'میزان پختگی و درک مالی کاربران' },
    ],
    rationaleFa: 'این بعد زنجیره ارزش اقتصاد مالی را بررسی کرده و نشان می‌دهد فناوری نه حذف‌کننده واسطه‌ها بلکه بازتعریف‌کننده موازنه قدرت پلتفرمی است.',
  },
  HD4: {
    id: 'HD4',
    nameEn: 'Algorithmic Governance & Normative Frameworks',
    nameFa: 'حکمرانی الگوریتمی و چارچوب‌های هنجاری',
    definitionEn:
      'The regulatory, ethical, and accountability frameworks that shape digital investment, including governance of algorithmic decision-making, detection and mitigation of algorithmic bias, investor protection, and tensions between innovation and regulation.',
    definitionFa:
      'چارچوب‌های رگولاتوری، اخلاقی و پاسخگویی که سرمایه‌گذاری دیجیتال را شکل می‌دهند، شامل حکمرانی تصمیم‌گیری الگوریتمی، کشف و مهار سوگیری الگوریتم‌ها، حفاظت از سرمایه‌گذار و تنش‌های میان نوآوری و رگولاتوری.',
    constituentThemes: ['ST6'],
    coreMechanisms: [
      { en: 'Algorithmic governance', fa: 'حکمرانی بر کدها و مدل‌های محاسباتی' },
      { en: 'Fairness', fa: 'انصاف سیستمی در ارائه توصیه‌ها' },
      { en: 'Bias detection', fa: 'کشف تورش و سوگیری داده‌ای/الگوریتمی' },
      { en: 'Fairness audits', fa: 'ممیزی‌های مستقل صحت و انصاف' },
      { en: 'Accountability', fa: 'پاسخگویی حقوقی در برابر تصمیمات الگوریتم' },
      { en: 'Investor protection', fa: 'حفاظت نظام‌مند از سرمایه‌گذار خرد' },
      { en: 'Licensing', fa: 'رژیم اعطای مجوز هوش مصنوعی مالی (AIRAL)' },
      { en: 'Transparency', fa: 'شفافیت و افشای ریسک‌های الگوریتم' },
      { en: 'Ethical governance', fa: 'حکمرانی اخلاقی و چارچوب‌های هنجاری' },
    ],
    boundaryConditions: [
      { en: 'Jurisdiction', fa: 'حوزه قضایی و حدود اختیارات ناظر بازار' },
      { en: 'Model type', fa: 'نوع مدل (یادگیری ماشین جعبه‌سیاه، GAI، مدل‌های خطی)' },
      { en: 'Investor vulnerability', fa: 'سطح آسیب‌پذیری اجتماعی-اقتصادی سرمایه‌گذار' },
    ],
    rationaleFa: 'این بعد چتر کلان حاکم بر سیستم است که شکست‌های خودتنظیم‌گری بازار را جبران نموده و زیرساخت اعتماد عمومی را پایه‌ریزی می‌کند.',
  },
};

// =========================================================================
// 2. SEVEN SECOND-ORDER THEMES (ST1 to ST7)
// =========================================================================

export const BASELINE_STS: Record<string, BaselineST> = {
  ST1: {
    id: 'ST1',
    nameEn: 'Technology-Mediated Trust Calibration',
    nameFa: 'کالیبراسیون اعتماد میانجی‌گری‌شده با فناوری',
    definitionEn:
      'How digital systems create trust challenges through opacity and complexity and how transparency, explainability, anthropomorphism and related mechanisms attempt to calibrate trust.',
    definitionFa:
      'چگونگی ایجاد چالش‌های اعتماد ناشی از کدر بودن و پیچیدگی سیستم‌های دیجیتال، و چگونگی تلاش سازوکارهای شفافیت، تبیین‌پذیری، انسان‌انگاری و ابزارهای مرتبط برای کالیبره کردن اعتماد.',
    assignedHD: 'HD1',
    coreMechanisms: ['Trust calibration', 'Explainability', 'Anthropomorphism', 'System trust transfer'],
  },
  ST2: {
    id: 'ST2',
    nameEn: 'Human–Algorithm Decision Negotiation',
    nameFa: 'مذاکره تصمیم‌گیری انسان-الگوریتم',
    definitionEn:
      'The renegotiation of decision authority between humans and algorithms, including hybrid models, delegation, autonomy, behavioral intervention, and human oversight.',
    definitionFa:
      'مذاکره مجدد بر سر اختیارات تصمیم‌گیری میان انسان و الگوریتم، شامل مدل‌های هیبریدی، تفویض اختیار، استقلال، مداخلات رفتاری و نظارت مشاور انسانی.',
    assignedHD: 'HD2',
    coreMechanisms: ['Advisor-in-the-loop (AITL)', 'Autonomy negotiation', 'Human oversight', 'Veto power'],
  },
  ST3: {
    id: 'ST3',
    nameEn: 'Digital Reconfiguration of Investment Intermediation',
    nameFa: 'بازپیکربندی دیجیتال واسطه‌گری سرمایه‌گذاری',
    definitionEn:
      'How digital platforms, algorithms and blockchain transform intermediation structures through disintermediation, re-intermediation, matching and organizational adaptation.',
    definitionFa:
      'چگونگی دگرگونی ساختارهای واسطه‌گری توسط پلتفرم‌های دیجیتال، الگوریتم‌ها و بلاک‌چین از طریق حذف واسطه‌ها، باز-واسطه‌گری، تطبیق دیجیتال و انطباق سازمانی.',
    assignedHD: 'HD3',
    coreMechanisms: ['Platform intermediation', 'Re-intermediation', 'VC certification', 'Organizational adaptation'],
  },
  ST4: {
    id: 'ST4',
    nameEn: 'Democratization and Stratification of Investment Access',
    nameFa: 'دموکراتیزه‌سازی و لایه‌بندی دسترسی سرمایه‌گذاری',
    definitionEn:
      'The dual effects of digital investment on access: reducing barriers while creating new forms of stratification based on financial literacy and digital capability.',
    definitionFa:
      'اثرات دوگانه سرمایه‌گذاری دیجیتال بر دسترسی: کاهش موانع ورود همزمان با ایجاد اشکال جدید لایه‌بندی و نابرابری بر مبنای سواد مالی و قابلیت‌های دیجیتال.',
    assignedHD: 'HD3',
    coreMechanisms: ['Barrier reduction', 'Mass inclusion', 'Capability gap', 'Stratified benefit capture'],
  },
  ST5: {
    id: 'ST5',
    nameEn: 'Behavioral Dynamics of Digital Investment Adoption and Resistance',
    nameFa: 'پویایی‌های رفتاری پذیرش و مقاومت در سرمایه‌گذاری دیجیتال',
    definitionEn:
      'The psychological and behavioral factors that shape whether investors adopt, use, continue, discontinue or resist digital investment services.',
    definitionFa:
      'عوامل روان‌شناختی و رفتاری شکل‌دهنده به این‌که آیا سرمایه‌گذاران خدمات سرمایه‌گذاری دیجیتال را می‌پذیرند، استفاده می‌کنند، ادامه می‌دهند، متوقف می‌سازند یا در برابر آن مقاومت می‌کنند.',
    assignedHD: 'HD1',
    coreMechanisms: ['Technology anxiety', 'Resistance to algorithms', 'Continued use intention', 'Cognitive biases'],
  },
  ST6: {
    id: 'ST6',
    nameEn: 'Algorithmic Governance and Accountability',
    nameFa: 'حکمرانی الگوریتمی و پاسخگویی هنجاری',
    definitionEn:
      'The regulatory, ethical and accountability frameworks that shape digital investment, including algorithmic bias, fairness, investor protection, transparency and innovation–regulation tension.',
    definitionFa:
      'چارچوب‌های رگولاتوری، اخلاقی و پاسخگویی حاکم بر سرمایه‌گذاری دیجیتال، شامل سوگیری الگوریتمی، انصاف، حفاظت از سرمایه‌گذار، شفافیت و تنش میان نوآوری و مقررات.',
    assignedHD: 'HD4',
    coreMechanisms: ['Fairness audits', 'Bias mitigation', 'AIRAL licensing', 'Investor protection regimes'],
  },
  ST7: {
    id: 'ST7',
    nameEn: 'Personalization and Decision Architecture in Digital Advisory',
    nameFa: 'شخصی‌سازی و معماری تصمیم در مشاوره دیجیتال',
    definitionEn:
      'How digital systems profile investors, personalize advice, construct portfolios and structure investment decisions through questionnaires, algorithms and decision architectures.',
    definitionFa:
      'چگونگی پروفایل‌سازی سرمایه‌گذاران، شخصی‌سازی توصیه‌ها، چینش سبدها و ساختاربندی تصمیمات توسط سیستم‌های دیجیتال از طریق پرسشنامه‌ها، الگوریتم‌ها و معماری‌های تصمیم.',
    assignedHD: 'HD2',
    coreMechanisms: ['Risk profiling', 'Portfolio construction', 'Personalization depth', 'Behavioral nudges'],
  },
};

// =========================================================================
// 3. BASELINE RELATIONSHIPS (R1 to R7)
// =========================================================================

export const BASELINE_RELATIONSHIPS: BaselineRelationship[] = [
  {
    id: 'R1',
    fromEn: 'Trust Calibration (ST1)',
    fromFa: 'کالیبراسیون اعتماد (ST1)',
    toEn: 'Adoption/Resistance (ST5)',
    toFa: 'پذیرش و مقاومت (ST5)',
    typeEn: 'Enabling / Reciprocal',
    typeFa: 'توانمندساز و متقابل (Enabling / Reciprocal)',
    theoreticalRationaleFa:
      'کالیبراسیون اعتماد پیش‌نیاز پذیرش عقلایی است، و بازخورد تجارب موفقیت‌آمیز استفاده، سطح اعتماد را تثبیت می‌کند.',
    literatureEvidence: 'Balaskas (2026); Bianchi & Brière (2024); Cao et al. (2024)',
  },
  {
    id: 'R2',
    fromEn: 'Human–Algorithm Negotiation (ST2)',
    fromFa: 'مذاکره تصمیم انسان-الگوریتم (ST2)',
    toEn: 'Personalization/Decision Architecture (ST7)',
    toFa: 'شخصی‌سازی و معماری تصمیم (ST7)',
    typeEn: 'Complementary',
    typeFa: 'مکمل و هم‌افزا (Complementary)',
    theoreticalRationaleFa:
      'معماری مشاور-در-حلقه، ورودی‌های لازم برای شخصی‌سازی واقعی را تامین کرده و شخصی‌سازی داده‌ها، تصمیم‌گیری ترکیبی را امکان‌پذیر می‌سازد.',
    literatureEvidence: 'Asemi et al. (2025); Scherer & Lehner (2023); Mahmud et al. (2025)',
  },
  {
    id: 'R3',
    fromEn: 'Digital Intermediation (ST3)',
    fromFa: 'واسطه‌گری دیجیتال (ST3)',
    toEn: 'Democratization/Access (ST4)',
    toFa: 'دموکراتیزه‌سازی و دسترسی (ST4)',
    typeEn: 'Enabling / Conditional',
    typeFa: 'توانمندساز و مشروط (Enabling / Conditional)',
    theoreticalRationaleFa:
      'ظهور پلتفرم‌های واسطه‌گری دیجیتال دسترسی را گسترش می‌دهد، مشروط به این‌که سواد دیجیتال و مالی مانع از نابرابری در بهره‌برداری نشود.',
    literatureEvidence: 'Kumar (2024); Rossi & Utkus (2024); Zarifis et al. (2025)',
  },
  {
    id: 'R4',
    fromEn: 'Governance/Accountability (ST6)',
    fromFa: 'حکمرانی و پاسخگویی (ST6)',
    toEn: 'Trust Calibration (ST1)',
    toFa: 'کالیبراسیون اعتماد (ST1)',
    typeEn: 'Enabling',
    typeFa: 'توانمندساز بنیادین (Enabling)',
    theoreticalRationaleFa:
      'وجود رژیم‌های مجوزدهی، ممیزی سوگیری و چتر اطمینان قانونی زیرساخت لازم برای کالیبراسیون دقیق اعتماد سرمایه‌گذاران را فراهم می‌سازد.',
    literatureEvidence: 'Kofman (2025); Steennot (2022); Agliata & Hasso (2026)',
  },
  {
    id: 'R5',
    fromEn: 'Democratization/Access (ST4)',
    fromFa: 'دموکراتیزه‌سازی و دسترسی (ST4)',
    toEn: 'Investment Performance / Outcomes',
    toFa: 'عملکرد سرمایه‌گذاری و پیامدها',
    typeEn: 'Conditional',
    typeFa: 'مشروط به زمینه (Conditional)',
    theoreticalRationaleFa:
      'ورود سرمایه‌گذاران خرد به بازار لزوماً منجر به سودآوری بیشتر نمی‌شود؛ بهره‌مندی واقعی مشروط به کیفیت الگوریتم، عمق بازار و سواد مالی کاربر است.',
    literatureEvidence: 'Rossi & Utkus (2024); Liu et al. (2023); Gao et al. (2026)',
  },
  {
    id: 'R6',
    fromEn: 'Personalization/Decision Architecture (ST7)',
    fromFa: 'شخصی‌سازی و معماری تصمیم (ST7)',
    toEn: 'Trust Calibration (ST1)',
    toFa: 'کالیبراسیون اعتماد (ST1)',
    typeEn: 'Shaping',
    typeFa: 'شکل‌دهنده (Shaping)',
    theoreticalRationaleFa:
      'کیفیت پرسشنامه‌های ارزیابی نیاز و انطباق توصیه‌ها با اهداف زندگی کاربر، احساس اطمینان و کالیبراسیون اعتماد را شکل می‌دهد.',
    literatureEvidence: 'Tahvildari (2025); Scherer & Lehner (2025); Cao et al. (2024)',
  },
  {
    id: 'R7',
    fromEn: 'Behavioral Finance / Nudging',
    fromFa: 'مالی رفتاری و تلنگرهای هوشمند',
    toEn: 'Investor Autonomy',
    toFa: 'استقلال و اختیار سرمایه‌گذار',
    typeEn: 'Tension',
    typeFa: 'تنش و تعارض بنیادین (Tension)',
    theoreticalRationaleFa:
      'استفاده از تلنگرهای الگوریتمی برای مهار سوگیری‌های رفتاری کاربر می‌تواند در تعارض با استقلال و حق تصمیم‌گیری آزادانه سرمایه‌گذار قرار گیرد.',
    literatureEvidence: 'Kofman (2025); Mahmud et al. (2025); Hodge et al. (2020)',
  },
];

// =========================================================================
// 4. BASELINE FEEDBACK LOOPS (FB1 & FB2)
// =========================================================================

export const BASELINE_FEEDBACK_LOOPS: BaselineFeedbackLoop[] = [
  {
    id: 'FB1',
    nameEn: 'Micro Feedback Loop: User Adoption & Trust Dynamics',
    nameFa: 'حلقه بازخورد خرد: پویایی‌های پذیرش و اعتماد کاربر',
    level: 'micro',
    stepsEn: ['Adoption', 'Experience', 'Trust Calibration', 'Continued Use'],
    stepsFa: ['پذیرش اولیه', 'تجربه استفاده و پیامدها', 'کالیبراسیون اعتماد', 'تداوم استفاده و اتکا'],
    descriptionFa:
      'سرمایه‌گذار سامانه را می‌پذیرد؛ بر اساس تجربه‌های عینی و بازدهی‌های واقعی، سطح اعتماد او تعدیل و کالیبره می‌شود؛ که این امر به نوبه خود وفاداری یا طرد الگوریتم را رقم می‌زند.',
    literatureEvidence: 'Bianchi & Brière (2024); Balaskas (2026)',
  },
  {
    id: 'FB2',
    nameEn: 'Macro Feedback Loop: Market Transformation & Institutional Adaptation',
    nameFa: 'حلقه بازخورد کلان: تحول بازار و انطباق نهادی',
    level: 'macro',
    stepsEn: ['Intermediation', 'Market Response', 'Organizational Adaptation'],
    stepsFa: ['واسطه‌گری پلتفرمی جدید', 'پاسخ و واکنش کلان بازار', 'انطباق سازمانی نهادهای سنتی'],
    descriptionFa:
      'ورود پلتفرم‌های روبوادوایزری و فین‌تک، ساختار عرضه بازار را متحول می‌سازد؛ در پاسخ به این تحول، نهادهای مالی سنتی (بانک‌ها و کارگزاری‌ها) مدل‌های خود را تغییر داده و به سمت استخدام مشاوران هیبریدی و مشارکت با فین‌تک‌ها حرکت می‌کنند.',
    literatureEvidence: 'Kumar (2024); Wexler & Oberlander (2021); Camelo & Duarte (2025)',
  },
];

// =========================================================================
// 5. BASELINE CONTRADICTIONS / NEGATIVE CASES (C1 to C6)
// =========================================================================

export const BASELINE_CONTRADICTIONS: BaselineContradiction[] = [
  {
    id: 'C1',
    code: 'C1',
    titleEn: 'Transparency ≠ Calibration',
    titleFa: 'شفافیت الزاماً مساوی با کالیبراسیون اعتماد نیست',
    meaningEn: 'Transparency may increase comfort or acceptance without necessarily improving judgment quality.',
    meaningFa:
      'افزایش شفافیت و افشای کدهای الگوریتم ممکن است راحتی روانی و پذیرش کاربر را بالا ببرد، اما الزاماً کیفیت قضاوت مالی یا تصمیم بهینه سرمایه‌گذاری را ارتقا نمی‌دهد.',
    literatureEvidence: 'Balaskas (2026); Kofman (2025)',
    iranianRelevanceFa:
      'در ایران افشای کدهای فنی برای سرمایه‌گذار خرد اثربخش نیست؛ کالیبراسیون نیازمند نمایش سناریوهای افت و تعهد به عدم مداخله سلیقه‌ای است.',
  },
  {
    id: 'C2',
    code: 'C2',
    titleEn: 'Financial Literacy Effects are Complex',
    titleFa: 'اثرات متناقض و پیچیده سواد مالی و دیجیتال',
    meaningEn: 'Literacy can facilitate adoption and benefits, but technology-oriented or younger users may still lack capability to benefit fully.',
    meaningFa:
      'سواد دیجیتال پذیرش را تسریع می‌کند، اما نسل جوان فناوری‌دوست ممکن است بدون داشتن مهارت تحلیلی مالی وارد معاملات پرریسک شده و زیان‌های سنگین متحمل گردند.',
    literatureEvidence: 'Cao et al. (2024); Zarifis et al. (2025)',
    iranianRelevanceFa:
      'جوانان ایرانی به سرعت وارد رمزارز یا پلتفرم‌های نوسان‌گیری می‌شوند اما در درک ریسک‌های سیستماتیک و مدیریت پورتفوی آسیب‌پذیرند.',
  },
  {
    id: 'C3',
    code: 'C3',
    titleEn: 'Automation Bias and Algorithm Aversion Coexist',
    titleFa: 'همزیستی همزمان خطای اتوماسیون و گریز از الگوریتم',
    meaningEn: 'Users may simultaneously exhibit excessive reliance on algorithms and rejection of algorithms.',
    meaningFa:
      'سرمایه‌گذاران به طور همزمان و متناقض، در روندهای سودآور دچار اتکای کورکورانه (Automation Bias) و در ریزش‌های مقطعی دچار طرد خشمگینانه الگوریتم (Algorithm Aversion) می‌شوند.',
    literatureEvidence: 'Mahmud et al. (2025); Hodge et al. (2020)',
    iranianRelevanceFa:
      'در بازار سهام تهران، در روزهای مثبت اعتماد کامل به سیگنال‌ها دیده می‌شود اما در روزهای قفل صف فروش، کل سیستم زیر سوال می‌رود.',
  },
  {
    id: 'C4',
    code: 'C4',
    titleEn: 'Performance is Contextual',
    titleFa: 'مشروط بودن عملکرد سرمایه‌گذاری دیجیتال به شرایط بازار',
    meaningEn: 'Digital investment performance benefits depend on investor and market conditions.',
    meaningFa:
      'مزیت روبوادوایزرها جهانشمول نیست؛ عملکرد درخشان آن‌ها در بازارهای رونددار یا شوک‌های موقت با روندهای پرنوسان و تورمی متفاوت است.',
    literatureEvidence: 'Liu et al. (2023); Gao et al. (2026); Horn & Oehler (2020)',
    iranianRelevanceFa:
      'در اقتصاد تورمی ایران با بازارهای موازی پرشتاب طلا، خودرو و دلار، الگوریتم‌های کلاسیک بورسی بدون تعدیل تورمی شکست می‌خورند.',
  },
  {
    id: 'C5',
    code: 'C5',
    titleEn: 'Algorithmic Bias Varies Across Models',
    titleFa: 'تنوع سوگیری‌های تعبیه‌شده در میان مدل‌های مختلف هوش مصنوعی',
    meaningEn: 'Different AI/LLM/algorithmic systems may exhibit different patterns of demographic or other bias.',
    meaningFa:
      'مدل‌های زبان بزرگ و الگوریتم‌های مختلف (GPT، Gemini، Claude) تعصبات متفاوتی در توصیه سهام بر مبنای جنسیت، تاهل یا وضعیت شغلی بروز می‌دهند.',
    literatureEvidence: 'Agliata & Hasso (2026)',
    iranianRelevanceFa:
      'استفاده بدون بومی‌سازی از مدل‌های زاینده خارجی می‌تواند توصیه‌های ناسازگار با ساختار دارایی و هنجارهای فرهنگی خانواده ایرانی تولید کند.',
  },
  {
    id: 'C6',
    code: 'C6',
    titleEn: 'Personalization Gap',
    titleFa: 'شکاف ادعا در برابر تحقق شخصی‌سازی واقعی',
    meaningEn: 'Personalization is often claimed more strongly than it is actually delivered, with systems relying heavily on basic risk and time-horizon inputs.',
    meaningFa:
      'پلتفرم‌ها ادعای شخصی‌سازی عمیق دارند، اما عملاً الگوریتم‌ها صرفاً بر افق زمانی و نمره کلیشه‌ای ریسک تکیه کرده و کل سبد ثروت واقعی خانوار را نادیده می‌گیرند.',
    literatureEvidence: 'Scherer & Lehner (2023, 2025); Tahvildari (2025)',
    iranianRelevanceFa:
      'پرسشنامه‌های فعلی سبدگردان‌های بورس تهران ۵ الی ۱۰ سوال صوری هستند و متغیرهای ملک، طلا و بدهی‌های اقساطی خانوار را مسکوت می‌گذارند.',
  },
];

// =========================================================================
// 6. BASELINE OUTCOMES
// =========================================================================

export const BASELINE_OUTCOMES: BaselineOutcome[] = [
  {
    id: 'OUT1',
    nameEn: 'Portfolio Performance',
    nameFa: 'عملکرد پورتفوی و نسبت‌های مالی',
    definitionEn: 'Financial performance indicators including risk-adjusted return, diversification, Sharpe ratio, and reduced home bias.',
    definitionFa: 'شاخص‌های بازدهی مالی تعدیل‌شده با ریسک، درجه تنوع‌بخشی سبد دارایی، نسبت شارپ و کاهش سوگیری تمایل به سهام داخلی.',
    indicatorsFa: ['نسبت شارپ پورتفوی', 'کاهش حداکثر افت سرمایه (Max Drawdown)', 'تنوع‌بخشی بین دارایی‌های بورسی و طلا'],
  },
  {
    id: 'OUT2',
    nameEn: 'Behavioral Shifts',
    nameFa: 'تغییرات و مهار سوگیری‌های رفتاری سرمایه‌گذار',
    definitionEn: 'Mitigation of behavioral biases such as overconfidence, panic selling, herd behavior, and disposition effect.',
    definitionFa: 'تعدیل و خنثی‌سازی خطاهای شناختی نظیر اعتمادبه‌نفس کاذب، رفتارهای گله‌ای در صف‌های بازار و هراس از زیان.',
    indicatorsFa: ['کاهش معاملات هیجانی در صف‌ها', 'پایبندی به استراتژی بلندمدت', 'کاهش اثر تمایل (Disposition Effect)'],
  },
  {
    id: 'OUT3',
    nameEn: 'Investor Welfare & Inclusion',
    nameFa: 'رفاه سرمایه‌گذار و شمول مالی همگانی',
    definitionEn: 'Broader societal welfare including expanded access, lower fee burdens, financial inclusion for retail investors, and protection from predatory schemes.',
    definitionFa: 'رفاه فراگیر اجتماعی شامل کاهش کارمزدهای سرمایه‌گذاری، شمول مالی دارندگان سهام عدالت و صیانت از سرمایه‌گذاران خرد در برابر کانال‌های غیررسمی.',
    indicatorsFa: ['کاهش هزینه دسترسی به خدمات مدیریت ثروت', 'شمول مالی دهک‌های متوسط و پایین', 'حفاظت در برابر سیگنال‌فروشی‌های فاقد صلاحیت'],
  },
];

// =========================================================================
// 7. IRAN CONTEXT DISCOVERY QUESTIONS (Q-IR-01 to Q-IR-11)
// =========================================================================

export const IRAN_DISCOVERY_QUESTIONS: IranDiscoveryQuestion[] = [
  {
    id: 'Q-IR-01',
    code: 'IR-INST',
    titleFa: 'ویژگی‌های نهادی و ساختار کلان اقتصاد ایران',
    titleEn: 'Institutional Characteristics',
    promptFa:
      'کدام ویژگی‌های نهادی، اقتصادی و سیاسی ایران (نظیر تورم مزمن ۴۰٪، نوسانات ارزی، تحریم‌ها و سلطه بانک‌ها) بیشترین تغییر را در نحوه طراحی سامانه‌های سرمایه‌گذاری دیجیتال ایجاد می‌کنند؟',
    defaultTag: 'ویژگی‌های نهادی کلان',
    probingNotesFa: 'تمرکز بر تغییر انگیزه سرمایه‌گذار از رشد سرمایه به حفظ قدرت خرید حقیقی در برابر تورم و طلا.',
  },
  {
    id: 'Q-IR-02',
    code: 'IR-UNTRANS',
    titleFa: 'سازوکارهای جهانی غیرقابل انتقال مستقیم به ایران',
    titleEn: 'Non-Transferable Global Mechanisms',
    promptFa:
      'کدام سازوکارهای شناخته‌شده در ادبیات جهانی سرمایه‌گذاری الگوریتمی (مانند مدل‌های کاملاً خودکار بدون انسان یا پرسشنامه‌های ریسک تک‌خطی) قابلیت انتقال مستقیم به بازار مالی ایران را ندارند؟',
    defaultTag: 'ناسازگاری سازوکارهای جهانی',
    probingNotesFa: 'دلایل ناکارآمدی مدل‌های غربی در بازارهای دارای دامنه نوسان محدود و شوک‌های سیستماتیک ناگهانی.',
  },
  {
    id: 'Q-IR-03',
    code: 'IR-REDESIGN',
    titleFa: 'سازوکارهای نیازمند بازطراحی بنیادین در ایران',
    titleEn: 'Mechanisms Requiring Fundamental Redesign',
    promptFa:
      'کدام مؤلفه‌های مدل باید متناسب با بافت ایران دچار بازطراحی بنیادین شوند؟ (به عنوان مثال، بازتعریف متغیرهای شخصی‌سازی برای پوشش دارایی‌های غیربورسی نظیر ملک و خودرو).',
    defaultTag: 'بازطراحی بنیادین مؤلفه‌ها',
    probingNotesFa: 'نحوه محاسبه ثروت واقعی خانوار ایرانی با ادغام دارایی‌های فیزیکی و تعهدات اقساطی.',
  },
  {
    id: 'Q-IR-04',
    code: 'IR-MISSING',
    titleFa: 'سازوکارهای ویژه و مفقود بافت ایران',
    titleEn: 'Missing Iran-Specific Mechanisms',
    promptFa:
      'چه سازوکارهای منحصر‌به‌فردی در بازار ایران وجود دارند که در ادبیات بین‌المللی مسکوت مانده‌اند اما برای زیست‌بوم داخلی نقشی حیاتی دارند؟',
    defaultTag: 'سازوکارهای بومی مفقود',
    probingNotesFa: 'پدیده‌هایی چون سهام عدالت ۴۹ میلیونی، صندوق‌های تضمین اصل سرمایه و کانال‌های تلگرامی نوسان‌گیری.',
  },
  {
    id: 'Q-IR-05',
    code: 'IR-BANKS',
    titleFa: 'نقش و جایگاه شبکه بانکی در زیست‌بوم ثروت‌تک',
    titleEn: 'Role of Banks & Payment Systems',
    promptFa:
      'بانک‌های بزرگ و شرکت‌های پرداخت (PSP) در زیست‌بوم سرمایه‌گذاری دیجیتال ایران باید در چه نقشی ظاهر شوند؟ (تامین‌کننده زیرساخت Open Banking، رقیب پلتفرم‌های مستقل، یا شریک کنسرسیومی؟)',
    defaultTag: 'نقش شبکه بانکی',
    probingNotesFa: 'مهار انحصار بانکی و تسهیل ارائه وب‌سرویس‌های آنلاین مانده‌گیری و جابجایی وجه به فین‌تک‌ها.',
  },
  {
    id: 'Q-IR-06',
    code: 'IR-BROKERS',
    titleFa: 'نقش کارگزاری‌ها، سبدگردان‌ها و پلتفرم‌های مستقل',
    titleEn: 'Role of Asset Managers & Brokerages',
    promptFa:
      'موازنه نقش و مدل همکاری میان پلتفرم‌های نوآور فین‌تک با شرکت‌های کارگزاری و سبدگردان‌های دارای مجوز رسمی از سازمان بورس چگونه باید سامان یابد؟',
    defaultTag: 'همکاری فین‌تک و نهادهای مالی',
    probingNotesFa: 'جلوگیری از انحصار هلدینگ‌های خصولتی و مدلسازی سهم درآمدی عادلانه (Revenue Sharing).',
  },
  {
    id: 'Q-IR-07',
    code: 'IR-HUMAN_AI',
    titleFa: 'نسبت اختیارات مشاور انسانی در برابر هوش مصنوعی',
    titleEn: 'Human Advisors vs. Algorithmic Systems',
    promptFa:
      'خط قرمز تفویض اختیار به الگوریتم و محدوده حق وتوی مدیر سرمایه‌گذاری دارای صلاحیت حرفه‌ای در شرایط بحران‌های اقتصادی کجاست؟',
    defaultTag: 'موازنه انسان و هوش مصنوعی',
    probingNotesFa: 'مسئولیت مدنی و کیفری ضرر ناشی از خطای کد و تعریف پروتکل قطع اضطراری (Circuit Breaker).',
  },
  {
    id: 'Q-IR-08',
    code: 'IR-GOV',
    titleFa: 'سازوکارهای حاکمیتی و رگولاتوری ضروری',
    titleEn: 'Essential Governance Mechanisms',
    promptFa:
      'سازمان بورس و اوراق بهادار، بانک مرکزی و شورای عالی فضای مجازی چه سازوکارهای رگولاتوری فوری و حیاتی (نظیر پروانه AIRAL، سندباکس مشترک یا صندوق جبران خطا) باید مستقر سازند؟',
    defaultTag: 'حکمرانی و رگولاتوری',
    probingNotesFa: 'رفع تشتت نهادی میان ناظر پولی و ناظر بازار سرمایه در مدیریت دارایی خرد شهروندان.',
  },
  {
    id: 'Q-IR-09',
    code: 'IR-CAPABILITY',
    titleFa: 'قابلیت‌ها و شایستگی‌های لازم در سمت سرمایه‌گذاران',
    titleEn: 'Investor Capabilities & Digital Literacy',
    promptFa:
      'چه قابلیت‌ها، آموزش‌ها و سواد مالی-دیجیتالی برای محافظت از سرمایه‌گذاران خرد ایرانی در برابر خطای اتوماسیون و فریب‌خوردگی ضروری است؟',
    defaultTag: 'توانمندی سرمایه‌گذار',
    probingNotesFa: 'نقش رابط‌های کاربری تعاملی، سناریوهای استرس تستی و تلنگرهای تصویری ساده.',
  },
  {
    id: 'Q-IR-10',
    code: 'IR-BARRIERS',
    titleFa: 'موانع نهادی، فناورانه، بازاری و رفتاری استقرار',
    titleEn: 'Implementation Barriers',
    promptFa:
      'چه موانع ساختاری (نظیر قطعی هسته معاملات بورس، فیلترینگ، عدم شفافیت شرکت‌ها، بی‌اعتمادی تاریخی ناشی از ۱۳۹۹) می‌توانند مانع تحقق این معماری شوند؟',
    defaultTag: 'موانع و چالش‌های استقرار',
    probingNotesFa: 'شناسایی گلوگاه‌های فلج‌کننده و راهکارهای مدیریت ریسک بحران.',
  },
  {
    id: 'Q-IR-11',
    code: 'IR-PRINCIPLE',
    titleFa: 'مهم‌ترین اصل راهنمای طراحی معماری بومی ایران',
    titleEn: 'Core Design Principle for Iran',
    promptFa:
      'اگر بخواهید یک «اصل راهنمای طلایی» برای تدوین معماری سرمایه‌گذاری دیجیتال و روبوادوایزری در ایران تعیین کنید، آن اصل چیست؟',
    defaultTag: 'اصل راهنمای بنیادین',
    probingNotesFa: 'شفافیت، بازده حقیقی ضدتورمی، صیانت از دارایی، یا نظارت مشاور انسانی؟',
  },
];

// =========================================================================
// 8. APPROVED IRAN CANDIDATE FACTORS (IR-001 to IR-012)
// =========================================================================

export const BASELINE_IRAN_CANDIDATE_FACTORS: IranCandidateFactor[] = [
  {
    id: 'IR-001',
    code: 'IR-001',
    titleFa: 'رژیم صدور پروانه هوش مصنوعی مالی (AIRAL بومی بورس)',
    titleEn: 'AI Robo-Advice Licensing (AIRAL Iran)',
    descriptionFa: 'دستورالعمل جامع صدور مجوز سبدگردانی و مشاوره هوشمند توسط سازمان بورس با احراز صلاحیت الگوریتم و آزمون تناسب.',
    category: 'governance',
    assignedHD: 'HD4',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.70, m: 0.88, u: 1.00 },
    importance: 6.8,
    currentState: 2.2,
    feasibility: 5.6,
    urgency: 6.9,
    danpWeight: 14.2,
  },
  {
    id: 'IR-002',
    code: 'IR-002',
    titleFa: 'سندباکس رگولاتوری چندنهادی (بورس، بانک مرکزی و بیمه)',
    titleEn: 'Cross-Regulatory WealthTech Sandbox',
    descriptionFa: 'محیط آزمون کنترل‌شده مشترک جهت رفع تعارضات قانونی میان شورای عالی بورس و شورای پول و اعتبار در سامانه‌های مدیریت دارایی.',
    category: 'governance',
    assignedHD: 'HD4',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.65, m: 0.82, u: 0.95 },
    importance: 6.5,
    currentState: 2.9,
    feasibility: 5.2,
    urgency: 6.4,
    danpWeight: 9.8,
  },
  {
    id: 'IR-003',
    code: 'IR-003',
    titleFa: 'معماری مشاور-در-حلقه منطبق بر مجوزهای سبدگردانی (AITL)',
    titleEn: 'Regulatory Advisor-in-the-Loop Operations',
    descriptionFa: 'سامانه‌دهی هوش مصنوعی به عنوان پردازشگر و پیشنهاددهنده و حفظ حق وتوی مدیر سرمایه‌گذاری دارای صلاحیت حرفه‌ای.',
    category: 'decision_architecture',
    assignedHD: 'HD2',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.75, m: 0.92, u: 1.00 },
    importance: 6.9,
    currentState: 3.4,
    feasibility: 6.1,
    urgency: 6.8,
    danpWeight: 16.5,
  },
  {
    id: 'IR-004',
    code: 'IR-004',
    titleFa: 'شخصی‌سازی چنددارایی با لحاظ طلا، مسکن، خودرو و تورم',
    titleEn: 'Multi-Asset Contextual Personalization',
    descriptionFa: 'فراتر رفتن از پرسشنامه‌های صوری و ادغام دارایی‌های غیربورسی و تعهدات اقساطی خانوار ایرانی در بازچینی پورتفوی پیشنهادی.',
    category: 'decision_architecture',
    assignedHD: 'HD2',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.72, m: 0.89, u: 0.98 },
    importance: 6.7,
    currentState: 2.6,
    feasibility: 5.4,
    urgency: 6.5,
    danpWeight: 11.4,
  },
  {
    id: 'IR-005',
    code: 'IR-005',
    titleFa: 'سوئیچ قطع اضطراری الگوریتم در شوک‌های سیستماتیک کلان',
    titleEn: 'Macro-Shock Circuit Breaker & Safeguards',
    descriptionFa: 'توقف خودکار سیگنال‌های الگوریتمی در زمان جهش‌های ارزی ناگهانی، تحریم‌ها یا بخشنامه‌های غافلگیرکننده دولتی.',
    category: 'decision_architecture',
    assignedHD: 'HD2',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.70, m: 0.85, u: 0.96 },
    importance: 6.6,
    currentState: 3.1,
    feasibility: 5.8,
    urgency: 6.3,
    danpWeight: 8.6,
  },
  {
    id: 'IR-006',
    code: 'IR-006',
    titleFa: 'سازوکار انتقال اعتبار از نهادهای مالی خوش‌نام بازار',
    titleEn: 'Institutional Trust Transfer Mechanisms',
    descriptionFa: 'بهره‌گیری از اعتبار بانک‌ها، سبدگردان‌ها و کارگزاری‌های باسابقه جهت ترمیم بی‌اعتمادی تاریخی سرمایه‌گذاران پس از ۱۳۹۹.',
    category: 'trust_behavior',
    assignedHD: 'HD1',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.74, m: 0.90, u: 0.98 },
    importance: 6.8,
    currentState: 3.6,
    feasibility: 6.2,
    urgency: 6.6,
    danpWeight: 13.1,
  },
  {
    id: 'IR-007',
    code: 'IR-007',
    titleFa: 'سنجش عملکرد بر مبنای بازده حقیقی، حفظ ارزش پول و طلا',
    titleEn: 'Inflation-Adjusted & Gold Benchmarking',
    descriptionFa: 'جایگزینی شاخص اسمی بورس با سنجه بازدهی حفظ قدرت خرید حقیقی در برابر نرخ تورم عمومی و طلا برای جلب اعتماد مردم.',
    category: 'trust_behavior',
    assignedHD: 'HD1',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.68, m: 0.86, u: 0.96 },
    importance: 6.5,
    currentState: 2.7,
    feasibility: 5.7,
    urgency: 6.2,
    danpWeight: 7.9,
  },
  {
    id: 'IR-008',
    code: 'IR-008',
    titleFa: 'کنسرسیوم‌های همزیستی فین‌تک‌های مستقل با هلدینگ‌های مالی',
    titleEn: 'FinTech-Incumbent Consortium Ecosystem',
    descriptionFa: 'مدل شراکت متقابل که مانع خفگی استارتاپ‌ها توسط غول‌های بانکی شده و دسترسی فین‌تک‌ها به مشتریان خرد را تسهیل نماید.',
    category: 'market_structure',
    assignedHD: 'HD3',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.65, m: 0.83, u: 0.95 },
    importance: 6.4,
    currentState: 3.0,
    feasibility: 5.3,
    urgency: 5.9,
    danpWeight: 6.2,
  },
  {
    id: 'IR-009',
    code: 'IR-009',
    titleFa: 'آزادسازی وب‌سرویس‌های آنلاین هسته معاملات و سپرده‌گذاری',
    titleEn: 'Open Finance & Real-Time Trading Core APIs',
    descriptionFa: 'الزام شرکت مدیریت فناوری بورس (TSETMC) و شرکت سپرده‌گذاری مرکزی به ارائه وب‌سرویس‌های پایدار و کم‌هزینه به فین‌تک‌ها.',
    category: 'market_structure',
    assignedHD: 'HD3',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.75, m: 0.93, u: 1.00 },
    importance: 6.9,
    currentState: 2.3,
    feasibility: 4.8,
    urgency: 7.0,
    danpWeight: 10.3,
  },
  {
    id: 'IR-010',
    code: 'IR-010',
    titleFa: 'دموکراتیزه‌سازی مدیریت دارایی برای ۴۹ میلیون دارنده سهام عدالت',
    titleEn: 'Mass Inclusion for Justice Share Owners (49M)',
    descriptionFa: 'توسعه پلتفرم‌های روبوادوایزری کم‌کارمزد برای ارتقای بازده دارایی‌های سهام عدالت دهک‌های پایین جامعه.',
    category: 'market_structure',
    assignedHD: 'HD3',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.66, m: 0.84, u: 0.95 },
    importance: 6.6,
    currentState: 2.1,
    feasibility: 4.9,
    urgency: 6.7,
    danpWeight: 8.1,
  },
  {
    id: 'IR-011',
    code: 'IR-011',
    titleFa: 'ممیزی مستقل سوگیری الگوریتم‌ها و آزمون جعبه‌سیاه',
    titleEn: 'Independent Algorithmic Fairness Audits',
    descriptionFa: 'ارزیابی ادواری خروجی مدل‌ها در مواجهه با نمادهای مختلف برای پیشگیری از دستکاری قیمت‌ها یا تعصب به شرکت‌های خاص.',
    category: 'governance',
    assignedHD: 'HD4',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.60, m: 0.78, u: 0.92 },
    importance: 6.3,
    currentState: 2.0,
    feasibility: 4.5,
    urgency: 6.1,
    danpWeight: 5.4,
  },
  {
    id: 'IR-012',
    code: 'IR-012',
    titleFa: 'صندوق تضمین خسارت ناشی از خطای سیستمی سامانه‌های مشاوره',
    titleEn: 'Investor Technical Error Compensation Fund',
    descriptionFa: 'سازوکار بیمه‌ای یا صندوق جبران خسارت برای زیان‌های ناشی از قطعی سرور یا خطاهای فاحش محاسباتی الگوریتم.',
    category: 'governance',
    assignedHD: 'HD4',
    approvalStatus: 'approved',
    fuzzyTFN: { l: 0.58, m: 0.74, u: 0.90 },
    importance: 6.4,
    currentState: 2.4,
    feasibility: 4.7,
    urgency: 5.8,
    danpWeight: 4.5,
  },
];

// =========================================================================
// 9. CONFIGURABLE METHODOLOGICAL SETTINGS
// =========================================================================

export interface ResearchPlatformConfig {
  consensusAgreementThreshold: number; // default 80% (ratings 6-7)
  consensusMedianThreshold: number; // default 6
  consensusIqrThreshold: number; // default 1
  fuzzyDelphiThreshold: number; // default 0.70
  fuzzyLinguisticMapping: {
    notNecessary: { l: number; m: number; u: number };
    lowNecessity: { l: number; m: number; u: number };
    moderateNecessity: { l: number; m: number; u: number };
    highNecessity: { l: number; m: number; u: number };
    veryHighNecessity: { l: number; m: number; u: number };
  };
  defuzzificationMethod: 'center_of_gravity' | 'graded_mean' | 'alpha_cut';
  dematelScaleMax: 4;
  dematelHierarchicalMaxCount: 12;
  dematelMode: 'fuzzy' | 'classical';
  anpConsistencyThreshold: 0.10;
  expertWeightingMode: 'equal' | 'profile_weighted' | 'sensitivity_analysis';
  commentsMandatoryForDisagreement: boolean;
}

export const DEFAULT_PLATFORM_CONFIG: ResearchPlatformConfig = {
  consensusAgreementThreshold: 80,
  consensusMedianThreshold: 6,
  consensusIqrThreshold: 1,
  fuzzyDelphiThreshold: 0.70,
  fuzzyLinguisticMapping: {
    notNecessary: { l: 0.0, m: 0.1, u: 0.3 },
    lowNecessity: { l: 0.1, m: 0.3, u: 0.5 },
    moderateNecessity: { l: 0.3, m: 0.5, u: 0.7 },
    highNecessity: { l: 0.5, m: 0.7, u: 0.9 },
    veryHighNecessity: { l: 0.7, m: 0.9, u: 1.0 },
  },
  defuzzificationMethod: 'graded_mean',
  dematelScaleMax: 4,
  dematelHierarchicalMaxCount: 12,
  dematelMode: 'fuzzy',
  anpConsistencyThreshold: 0.10,
  expertWeightingMode: 'equal',
  commentsMandatoryForDisagreement: true,
};

// =========================================================================
// 10. MODULE D — ORAL EXPERT CONSULTATION QUESTIONS (8 CANONICAL ITEMS)
// =========================================================================

export interface OralConsultationQuestionDef {
  id: string; // ORAL-01 to ORAL-08
  number: number;
  code: string;
  titleEn: string;
  titleFa: string;
  questionEn: string;
  questionFa: string;
  probingPromptFa: string;
  primaryConstructs?: string[];
}

export const BASELINE_ORAL_QUESTIONS: OralConsultationQuestionDef[] = [
  {
    id: 'ORAL-01',
    number: 1,
    code: 'ADEQUACY',
    titleEn: 'Overall Model Adequacy',
    titleFa: 'کفایت کلی مدل در تبیین پدیده',
    questionEn: 'Does the existing model adequately represent the phenomenon under investigation? Which parts are most convincing, and which parts require reconsideration?',
    questionFa: 'آیا مدل موجود پدیده سرمایه‌گذاری دیجیتال و روبوادوایزری را به شایستگی تبیین می‌کند؟ کدام بخش‌ها قانع‌کننده‌تر بوده و کدام بخش‌ها نیازمند بازنگری‌اند؟',
    probingPromptFa: 'بررسی کفایت تئوریک ۴ بعد کلان و ۷ تم متاسنتز؛ شناسایی نقاط قوت مدل جهانی و کاستی‌های مفهومی.',
    primaryConstructs: ['HD1', 'HD2', 'HD3', 'HD4'],
  },
  {
    id: 'ORAL-02',
    number: 2,
    code: 'OMISSIONS',
    titleEn: 'Major Omissions',
    titleFa: 'مؤلفه‌ها و سازوکارهای مفقود',
    questionEn: 'What important issue, construct, or mechanism is absent from the existing model?',
    questionFa: 'چه موضوع، سازوکار یا مؤلفه مهمی در مدل اولیه متاسنتز غایب است که باید حتماً افزوده شود؟',
    probingPromptFa: 'تمرکز بر متغیرهای نامرئی، دینامیک‌های پنهان بازار، یا پیوندهای فراموش‌شده میان فناوری و رفتار کاربر.',
    primaryConstructs: ['HD1', 'HD2', 'HD3', 'HD4'],
  },
  {
    id: 'ORAL-03',
    number: 3,
    code: 'IRAN_DIFF',
    titleEn: 'Iran-Specific Differences',
    titleFa: 'تمایزهای بنیادین بافتار ایران',
    questionEn: 'Which conditions in Iran make the application or interpretation of this model different from its application in other contexts?',
    questionFa: 'کدام شرایط ویژه ایران (تورم مزمن، رژیم رگولاتوری چندپاره، تحریم، بی‌اعتمادی تاریخی)، کاربرد یا تفسیر این مدل را با سایر کشورها متفاوت می‌سازد؟',
    probingPromptFa: 'تمایز بازار سرمایه ایران با بازارهای توسعه‌یافته؛ اثر تورم انتظاری بر رفتار الگوریتمی و سبد دارایی.',
    primaryConstructs: ['HD3', 'HD4'],
  },
  {
    id: 'ORAL-04',
    number: 4,
    code: 'STRUCT_CHANGE',
    titleEn: 'Structural Changes & Relocations',
    titleFa: 'اصلاحات ساختاری، ادغام و بازتعریف روابط',
    questionEn: 'Should any constructs be merged, divided, redefined, relocated, or connected differently? Please explain the theoretical or practical reason.',
    questionFa: 'آیا هیچ‌یک از مؤلفه‌ها باید ادغام، تفکیک، بازتعریف، جابه‌جا یا با پیوندی دیگر متصل شوند؟ با ذکر دلیل تئوریک یا تجربی.',
    probingPromptFa: 'پیشنهادهای ادغام تم‌ها، انتقال مقوله‌ها بین ابعاد، یا ایجاد مسیرهای علی جدید در نمودار روابط.',
    primaryConstructs: ['ST1', 'ST2', 'ST3', 'ST4', 'ST5', 'ST6', 'ST7'],
  },
  {
    id: 'ORAL-05',
    number: 5,
    code: 'CONTEXT_MECH',
    titleEn: 'Contextual Mechanisms & Moderators',
    titleFa: 'سازوکارهای تعدیل‌کننده نهادی، رفتاری و اقتصادی',
    questionEn: 'What institutional, economic, regulatory, technological, organizational, or behavioral mechanisms could change the relationships in the proposed framework?',
    questionFa: 'چه سازوکارهای نهادی، اقتصادی، رگولاتوری، فناورانه، سازمانی یا رفتاری می‌توانند روابط موجود در چارچوب را تعدیل کنند؟',
    probingPromptFa: 'بررسی نقش بانک مرکزی، سازمان بورس، شرکت‌های پرداخت (PSP) و ساختارهای قدرت خصولتی.',
    primaryConstructs: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'],
  },
  {
    id: 'ORAL-06',
    number: 6,
    code: 'FEASIBILITY',
    titleEn: 'Practical Feasibility & Barriers',
    titleFa: 'امکان‌پذیری عملیاتی و موانع استقرار در ایران',
    questionEn: 'Which parts of the proposed framework would be difficult to operationalize in Iran, and why?',
    questionFa: 'کدام بخش‌های چارچوب پیشنهادی در عمل برای پیاده‌سازی در ایران با موانع جدی ساختاری مواجه خواهند شد و چرا؟',
    probingPromptFa: 'موانع فنی هسته معاملات، عدم تقارن اطلاعاتی، رژیم صدور مجوز سبدگردانی و محدودیت‌های Open Banking.',
    primaryConstructs: ['HD4', 'IR-001', 'IR-002'],
  },
  {
    id: 'ORAL-07',
    number: 7,
    code: 'PRIORITIZATION',
    titleEn: 'Prioritization of Modifications',
    titleFa: 'اولویت‌بندی تغییرات و اصلاحات ضروری',
    questionEn: 'If only a limited number of modifications could be included, which changes would be most important and why?',
    questionFa: 'چنانچه تنها تعداد محدودی از اصلاحات قابل اعمال باشند، اولویت‌دارترین تغییرات کدام‌ها خواهند بود و چرا؟',
    probingPromptFa: 'شناسایی متغیرهای بحرانی درجه یک؛ چه تغییری بیشترین بازدهی را برای کارآمدی اکوسیستم دارد؟',
    primaryConstructs: ['HD2', 'HD4'],
  },
  {
    id: 'ORAL-08',
    number: 8,
    code: 'RECOMMENDATION',
    titleEn: 'Final Recommendations for Iran',
    titleFa: 'مهم‌ترین توصیه نهایی جهت چارچوب علمی و بومی',
    questionEn: 'What is the single most important recommendation you would make for constructing a scientifically defensible and contextually appropriate framework for Iran?',
    questionFa: 'مهم‌ترین توصیه نهایی شما برای تدوین یک معماری قابل‌دفاع علمی و متناسب با بافتار ایران چیست؟',
    probingPromptFa: 'توصیه کلیدی به سیاست‌گذاران بازار سرمایه و تیم پژوهشی جهت نگارش مانیفست معماری مطلوب.',
    primaryConstructs: ['HD1', 'HD2', 'HD3', 'HD4'],
  },
];

