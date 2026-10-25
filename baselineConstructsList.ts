/**
 * Approved Baseline Constructs Registry for Construct-by-Construct Validation
 * Preserves exact theoretical wording, definitions, dimensions, and relationships
 * from the literature-derived meta-synthesis.
 */

export interface BaselineConstructItem {
  id: string; // e.g., HD1, ST1, R1, C1
  code: string;
  category: 'higher_order_dimension' | 'second_order_theme' | 'systemic_relationship' | 'paradox_contradiction';
  categoryLabelFa: string;
  nameFa: string;
  nameEn: string;
  definitionFa: string;
  definitionEn: string;
  parentDimension?: string;
  coreMechanisms: string[];
  theoreticalRationaleFa?: string;
  literatureEvidence?: string;
}

export const BASELINE_CONSTRUCTS_REGISTRY: BaselineConstructItem[] = [
  // 1. HIGHER-ORDER DIMENSIONS (HD1 to HD4)
  {
    id: 'HD1',
    code: 'HD1',
    category: 'higher_order_dimension',
    categoryLabelFa: 'بُعد کلان اول',
    nameFa: 'روانشناسی سرمایه‌گذار، اعتماد و ریسک در سرمایه‌گذاری دیجیتال',
    nameEn: 'Trust, Risk & Investor Psychology in Digital Investment',
    definitionFa:
      'نحوه ادراک، اعتمادسازی و واکنش سرمایه‌گذاران به سامانه‌های دیجیتال، تلفیق سازوکارهای روانشناختی، رفتاری و رابطه‌ای که از طریق آن‌ها اعتماد شکل می‌گیرد، ریسک ارزیابی می‌شود و رفتارهای پذیرش یا مقاومت بروز می‌یابد.',
    definitionEn:
      'How investors perceive, trust, and respond to digital investment systems, integrating the psychological, behavioral, and relational mechanisms through which trust is formed, risk is assessed, and adoption or resistance behaviors emerge.',
    coreMechanisms: [
      'کالیبراسیون اعتماد (Trust Calibration)',
      'انتقال اعتبار از نهاد مالی به الگوریتم (Trust Transfer)',
      'پویایی‌های رفتاری و شناختی (Behavioral Dynamics)',
      'ادراک ریسک نوسان و ریزش (Risk Perception)',
      'مقاومت در برابر اتوماسیون (Algorithm Aversion)',
    ],
    theoreticalRationaleFa:
      'این بعد زیربنای روان‌شناختی تعامل کاربر با سیستم را تشکیل داده و مانع از تقلیل فناوری به یک ابزار ابزاری صرف می‌شود.',
    literatureEvidence: 'Balaskas (2026); Bianchi & Brière (2024); Cao et al. (2024)',
  },
  {
    id: 'HD2',
    code: 'HD2',
    category: 'higher_order_dimension',
    categoryLabelFa: 'بُعد کلان دوم',
    nameFa: 'معماری تصمیم انسان-الگوریتم',
    nameEn: 'Human–Algorithm Decision Architecture',
    definitionFa:
      'نحوه ساختاربندی، شخصی‌سازی و اجرای تصمیمات سرمایه‌گذاری از طریق ادغام قضاوت انسان و سیستم‌های الگوریتمی، شامل تفویض اختیار تصمیم‌گیری، شخصی‌سازی توصیه‌ها و مداخلات رفتاری شکل‌دهنده به نتایج.',
    definitionEn:
      'How investment decisions are structured, personalized, and executed through the integration of human judgment and algorithmic systems, including delegation of decision authority, personalization of advice, and behavioral interventions.',
    coreMechanisms: [
      'مشاوره ترکیبی هیبریدی (Hybrid Advisory)',
      'مدل مشاور-در-حلقه (Advisor-in-the-Loop - AITL)',
      'تفویض اختیار محاسباتی (Algorithmic Delegation)',
      'شخصی‌سازی سبد و توصیه‌ها (Data-Driven Personalization)',
      'مداخلات و تلنگرهای رفتاری هوشمند (Nudging)',
      'حفظ استقلال و اختیار سرمایه‌گذار (Investor Autonomy)',
    ],
    theoreticalRationaleFa:
      'این بعد هسته عملیاتی تصمیم‌گیری است و تعادل میان اتکای کورکورانه به الگوریتم و گریز غیرعقلایی از آن را ساختار می‌دهد.',
    literatureEvidence: 'Asemi et al. (2025); Scherer & Lehner (2023); Mahmud et al. (2025)',
  },
  {
    id: 'HD3',
    code: 'HD3',
    category: 'higher_order_dimension',
    categoryLabelFa: 'بُعد کلان سوم',
    nameFa: 'تحول ساختاری بازارهای سرمایه‌گذاری و دسترسی',
    nameEn: 'Structural Transformation of Investment Markets and Access',
    definitionFa:
      'نحوه دگرگونی ساختار بازارهای سرمایه‌گذاری توسط فناوری‌های دیجیتال، شامل واسطه‌گری، دسترسی، مشارکت و پویایی‌های سازمانی، و چگونگی اثرگذاری این دگرگونی‌ها بر این‌که چه کسانی می‌توانند مشارکت کنند و منافع چگونه توزیع می‌شود.',
    definitionEn:
      'How digital technologies transform the structure of investment markets, including intermediation, access, participation, and organizational dynamics, and how these structural changes affect who can participate and how benefits are distributed.',
    coreMechanisms: [
      'واسطه‌گری پلتفرمی دیجیتال (Platform Intermediation)',
      'حذف واسطه‌های سنتی ناکارآمد (Disintermediation)',
      'باز-واسطه‌گری و ظهور بازیگران جدید (Re-intermediation)',
      'دموکراتیزه‌سازی دسترسی به مدیریت ثروت (Democratization of Wealth)',
      'لایه‌بندی نابرابر دسترسی بر اساس سواد تحلیلی (Access Stratification)',
    ],
    theoreticalRationaleFa:
      'این بعد تغییرات بستر بازار و نیروهای رقابتی را که پلتفرم‌های سرمایه‌گذاری دیجیتال در آن به رقابت می‌پردازند، پوشش می‌دهد.',
    literatureEvidence: 'Kumar (2024); Rossi & Utkus (2024); Zarifis et al. (2025)',
  },
  {
    id: 'HD4',
    code: 'HD4',
    category: 'higher_order_dimension',
    categoryLabelFa: 'بُعد کلان چهارم',
    nameFa: 'حکمرانی چندسطحی رگولاتوری، نهادی و اخلاقی',
    nameEn: 'Multi-Level Regulatory, Institutional & Ethical Governance',
    definitionFa:
      'سازوکارهای حاکمیتی، تنظیمی و نهادی حاکم بر سرمایه‌گذاری دیجیتال، شامل استانداردهای الگوریتمی، چارچوب‌های اخلاقی، حمایت از سرمایه‌گذار و تعادل بین نوآوری و مدیریت ریسک سیستمی.',
    definitionEn:
      'The multi-level governance, regulatory, and institutional mechanisms governing digital investment, including algorithmic standards, ethical frameworks, investor protection, and the balance between innovation and systemic risk mitigation.',
    coreMechanisms: [
      'حکمرانی الگوریتمی و ممیزی سوگیری (Algorithmic Governance)',
      'دستورالعمل‌های اخلاقی و شفافیت مدل (Ethical AI Frameworks)',
      'صیانت از حقوق سرمایه‌گذار خرد (Investor Protection)',
      'سندباکس رگولاتوری و مجوزدهی هوشمند (Regulatory Sandboxes & Licensing)',
      'مدیریت ریسک‌های سیستمی و همبستگی رفتاری توده‌ها (Systemic Risk)',
    ],
    theoreticalRationaleFa:
      'این بعد چتر کلان حاکم بر سیستم است که شکست‌های خودتنظیم‌گری بازار را جبران نموده و زیرساخت اعتماد عمومی را پایه‌ریزی می‌کند.',
    literatureEvidence: 'Kofman (2025); Steennot (2022); Agliata & Hasso (2026)',
  },

  // 2. SEVEN SECOND-ORDER THEMES (ST1 to ST7)
  {
    id: 'ST1',
    code: 'ST1',
    category: 'second_order_theme',
    categoryLabelFa: 'مضمون سطح دوم',
    parentDimension: 'HD1',
    nameFa: 'کالیبراسیون اعتماد میانجی‌گری‌شده با فناوری',
    nameEn: 'Technology-Mediated Trust Calibration',
    definitionFa:
      'چگونگی ایجاد چالش‌های اعتماد ناشی از کدر بودن و پیچیدگی سیستم‌های دیجیتال، و چگونگی تلاش سازوکارهای شفافیت، تبیین‌پذیری، انسان‌انگاری و ابزارهای مرتبط برای کالیبره کردن اعتماد.',
    definitionEn:
      'How digital systems create trust challenges through opacity and complexity and how transparency, explainability, anthropomorphism and related mechanisms attempt to calibrate trust.',
    coreMechanisms: ['Trust calibration', 'Explainability (XAI)', 'Anthropomorphism', 'System trust transfer'],
    literatureEvidence: 'Balaskas (2026); Cao et al. (2024)',
  },
  {
    id: 'ST2',
    code: 'ST2',
    category: 'second_order_theme',
    categoryLabelFa: 'مضمون سطح دوم',
    parentDimension: 'HD2',
    nameFa: 'مذاکره تصمیم‌گیری انسان-الگوریتم',
    nameEn: 'Human–Algorithm Decision Negotiation',
    definitionFa:
      'مذاکره مجدد بر سر اختیارات تصمیم‌گیری میان انسان و الگوریتم، شامل مدل‌های هیبریدی، تفویض اختیار، استقلال، مداخلات رفتاری و نظارت مشاور انسانی.',
    definitionEn:
      'The renegotiation of decision authority between humans and algorithms, including hybrid models, delegation, autonomy, behavioral intervention, and human oversight.',
    coreMechanisms: ['Advisor-in-the-loop (AITL)', 'Autonomy negotiation', 'Human oversight', 'Veto power'],
    literatureEvidence: 'Asemi et al. (2025); Scherer & Lehner (2023)',
  },
  {
    id: 'ST3',
    code: 'ST3',
    category: 'second_order_theme',
    categoryLabelFa: 'مضمون سطح دوم',
    parentDimension: 'HD3',
    nameFa: 'بازپیکربندی دیجیتال واسطه‌گری سرمایه‌گذاری',
    nameEn: 'Digital Reconfiguration of Investment Intermediation',
    definitionFa:
      'چگونگی دگرگونی ساختارهای واسطه‌گری توسط پلتفرم‌های دیجیتال، الگوریتم‌ها و بلاک‌چین از طریق حذف واسطه‌ها، باز-واسطه‌گری، تطبیق دیجیتال و انطباق سازمانی.',
    definitionEn:
      'How digital platforms, algorithms and blockchain transform intermediation structures through disintermediation, re-intermediation, matching and organizational adaptation.',
    coreMechanisms: ['Platform intermediation', 'Disintermediation', 'Re-intermediation', 'Organizational adaptation'],
    literatureEvidence: 'Kumar (2024); Wexler & Oberlander (2021)',
  },
  {
    id: 'ST4',
    code: 'ST4',
    category: 'second_order_theme',
    categoryLabelFa: 'مضمون سطح دوم',
    parentDimension: 'HD3',
    nameFa: 'دموکراتیزه‌سازی و لایه‌بندی دسترسی سرمایه‌گذاری',
    nameEn: 'Democratization and Stratification of Investment Access',
    definitionFa:
      'اثرات دوگانه سرمایه‌گذاری دیجیتال بر دسترسی: کاهش موانع ورود همزمان با ایجاد اشکال جدید لایه‌بندی و نابرابری بر مبنای سواد مالی و قابلیت‌های دیجیتال.',
    definitionEn:
      'The dual effects of digital investment on access: reducing barriers while creating new forms of stratification based on financial literacy and digital capability.',
    coreMechanisms: ['Barrier reduction', 'Mass inclusion', 'Capability gap', 'Stratified benefit capture'],
    literatureEvidence: 'Rossi & Utkus (2024); Liu et al. (2023)',
  },
  {
    id: 'ST5',
    code: 'ST5',
    category: 'second_order_theme',
    categoryLabelFa: 'مضمون سطح دوم',
    parentDimension: 'HD1',
    nameFa: 'پویایی‌های رفتاری پذیرش و مقاومت در سرمایه‌گذاری دیجیتال',
    nameEn: 'Behavioral Dynamics of Digital Investment Adoption and Resistance',
    definitionFa:
      'عوامل روان‌شناختی و رفتاری شکل‌دهنده به این‌که آیا سرمایه‌گذاران خدمات سرمایه‌گذاری دیجیتال را می‌پذیرند، استفاده می‌کنند، ادامه می‌دهند، متوقف می‌سازند یا در برابر آن مقاومت می‌کنند.',
    definitionEn:
      'The psychological and behavioral factors that shape whether investors adopt, use, continue, discontinue or resist digital investment services.',
    coreMechanisms: ['Technology anxiety', 'Resistance to algorithms', 'Continued use intention', 'Cognitive biases'],
    literatureEvidence: 'Bianchi & Brière (2024); Zarifis et al. (2025)',
  },
  {
    id: 'ST6',
    code: 'ST6',
    category: 'second_order_theme',
    categoryLabelFa: 'مضمون سطح دوم',
    parentDimension: 'HD4',
    nameFa: 'حکمرانی الگوریتمی و پاسخگویی هنجاری',
    nameEn: 'Algorithmic Governance and Accountability',
    definitionFa:
      'چارچوب‌های تنظیمی، اخلاقی و پاسخگویی حاکم بر سرمایه‌گذاری دیجیتال، شامل سوگیری الگوریتمی، انصاف، صیانت از سرمایه‌گذار، شفافیت و تنش میان نوآوری و رگولاتوری.',
    definitionEn:
      'The regulatory, ethical and accountability frameworks that shape digital investment, including algorithmic bias, fairness, investor protection, transparency and innovation–regulation tension.',
    coreMechanisms: ['Algorithmic bias audit', 'Explainable AI compliance', 'Investor protection', 'Regulatory sandbox'],
    literatureEvidence: 'Kofman (2025); Steennot (2022)',
  },
  {
    id: 'ST7',
    code: 'ST7',
    category: 'second_order_theme',
    categoryLabelFa: 'مضمون سطح دوم',
    parentDimension: 'HD2',
    nameFa: 'شخصی‌سازی مبتنی بر داده و معماری انتخاب',
    nameEn: 'Data-Driven Personalization & Choice Architecture',
    definitionFa:
      'نحوه استفاده از داده‌های سرمایه‌گذار، یادگیری ماشین و اصول مالی رفتاری برای ایجاد پورتفوی‌های شخصی‌سازی‌شده و طراحی محیط‌های تصمیم‌گیری (معماری انتخاب).',
    definitionEn:
      'How investor data, machine learning and behavioral finance principles are used to create personalized portfolios and design decision environments (choice architecture).',
    coreMechanisms: ['Data-driven profiling', 'Personalized asset allocation', 'Nudge design', 'Goal-based investing'],
    literatureEvidence: 'Tahvildari (2025); Scherer & Lehner (2025)',
  },

  // 3. SYSTEMIC RELATIONSHIPS (R1 to R7)
  {
    id: 'R1',
    code: 'R1',
    category: 'systemic_relationship',
    categoryLabelFa: 'رابطه سیستمی تئوریک',
    nameFa: 'رابطه کالیبراسیون اعتماد (ST1) و پذیرش/مقاومت کاربر (ST5)',
    nameEn: 'Trust Calibration (ST1) ⟷ Adoption & Resistance (ST5)',
    definitionFa:
      'کالیبراسیون دقیق اعتماد (تطابق سطح اتکای ذهنی کاربر با قابلیت‌های عینی سامانه) شرط لازم برای پذیرش آگاهانه و پایدار است. از سوی دیگر، بازخورد تجارب واقعی کاربر در طول زمان سطح اعتماد را مجدداً تنظیم می‌کند (رابطه توانمندساز و متقابل).',
    definitionEn:
      'Trust calibration is an essential prerequisite for rational adoption, and user feedback through usage experiences dynamically refines trust (Enabling / Reciprocal).',
    coreMechanisms: ['Trust calibration', 'Adoption feedback loop', 'Rational reliance'],
    literatureEvidence: 'Balaskas (2026); Bianchi & Brière (2024)',
  },
  {
    id: 'R2',
    code: 'R2',
    category: 'systemic_relationship',
    categoryLabelFa: 'رابطه سیستمی تئوریک',
    nameFa: 'رابطه مذاکره تصمیم انسان-الگوریتم (ST2) و شخصی‌سازی سبد (ST7)',
    nameEn: 'Human–Algorithm Negotiation (ST2) ⟷ Personalization (ST7)',
    definitionFa:
      'معماری مشاور-در-حلقه (AITL) داده‌های لازم برای شخصی‌سازی سبد را غنی می‌سازد و شخصی‌سازی داده‌محور، چارچوب مذاکره و تفویض اختیار بهینه را هموار می‌سازد (رابطه مکمل و هم‌افزا).',
    definitionEn:
      'Advisor-in-the-loop structures feed rich preferences into personalization, while personalized algorithms facilitate effective human-algorithm collaboration (Complementary).',
    coreMechanisms: ['Advisor-in-the-loop', 'Preference elicitation', 'Complementary synergy'],
    literatureEvidence: 'Asemi et al. (2025); Mahmud et al. (2025)',
  },
  {
    id: 'R3',
    code: 'R3',
    category: 'systemic_relationship',
    categoryLabelFa: 'رابطه سیستمی تئوریک',
    nameFa: 'رابطه واسطه‌گری دیجیتال (ST3) و دموکراتیزه‌سازی دسترسی (ST4)',
    nameEn: 'Digital Intermediation (ST3) ⟶ Democratization of Access (ST4)',
    definitionFa:
      'پلتفرم‌های دیجیتال با کاهش هزینه‌های مبادله و حذف حداقل سرمایه‌گذاری سنتی، دسترسی توده‌ها را ممکن می‌سازند؛ مشروط بر این‌که شکاف سواد دیجیتال مانع از لایه‌بندی جدید نشود (رابطه توانمندساز و مشروط).',
    definitionEn:
      'Digital intermediation lowers transaction costs and access thresholds, enabling broader participation subject to literacy boundary conditions (Enabling / Conditional).',
    coreMechanisms: ['Disintermediation', 'Threshold reduction', 'Conditional inclusion'],
    literatureEvidence: 'Kumar (2024); Rossi & Utkus (2024)',
  },
  {
    id: 'R4',
    code: 'R4',
    category: 'systemic_relationship',
    categoryLabelFa: 'رابطه سیستمی تئوریک',
    nameFa: 'رابطه حکمرانی و رگولاتوری (ST6) و کالیبراسیون اعتماد (ST1)',
    nameEn: 'Governance & Accountability (ST6) ⟶ Trust Calibration (ST1)',
    definitionFa:
      'وجود رژیم‌های شفاف مجوزدهی، ممیزی بی‌طرفی الگوریتم و چتر حمایتی ناظر، زیرساخت نهادی لازم را برای کالیبراسیون اعتماد سرمایه‌گذاران به وجود می‌آورد (رابطه توانمندساز بنیادین).',
    definitionEn:
      'Regulatory oversight, licensing regimes, and bias auditing provide the necessary institutional foundation for investor trust calibration (Enabling).',
    coreMechanisms: ['Regulatory licensing', 'Auditability', 'Institutional trust foundation'],
    literatureEvidence: 'Kofman (2025); Steennot (2022)',
  },
  {
    id: 'R5',
    code: 'R5',
    category: 'systemic_relationship',
    categoryLabelFa: 'رابطه سیستمی تئوریک',
    nameFa: 'رابطه دموکراتیزه‌سازی دسترسی (ST4) و پیامدها و عملکرد سرمایه‌گذاری',
    nameEn: 'Democratization/Access (ST4) ⟶ Investment Performance & Outcomes',
    definitionFa:
      'گسترش دسترسی لزوماً به بهبود بازده یا رفاه مالی منجر نمی‌شود؛ پیامدهای مثبت مشروط به کیفیت فنی الگوریتم، عمق بازار و کنترل رفتارهای هیجانی است (رابطه مشروط به بافت).',
    definitionEn:
      'Expanded market access does not automatically translate into superior financial outcomes; benefits are contingent on algorithm quality and investor behavior (Conditional).',
    coreMechanisms: ['Market access', 'Behavioral discipline', 'Contingent outcomes'],
    literatureEvidence: 'Rossi & Utkus (2024); Gao et al. (2026)',
  },
  {
    id: 'R6',
    code: 'R6',
    category: 'systemic_relationship',
    categoryLabelFa: 'رابطه سیستمی تئوریک',
    nameFa: 'رابطه شخصی‌سازی و معماری تصمیم (ST7) و کالیبراسیون اعتماد (ST1)',
    nameEn: 'Personalization & Decision Architecture (ST7) ⟶ Trust Calibration (ST1)',
    definitionFa:
      'کیفیت فرآیند شناخت مشتری (KYC) و انطباق توصیه‌ها با نیازهای فردی، احساس امنیت و کالیبراسیون دقیق اتکای سرمایه‌گذار را شکل می‌دهد (رابطه شکل‌دهنده).',
    definitionEn:
      'High-quality profiling and customized portfolios directly shape appropriate investor reliance and confidence (Shaping).',
    coreMechanisms: ['KYC profiling', 'Needs alignment', 'Reliance calibration'],
    literatureEvidence: 'Tahvildari (2025); Scherer & Lehner (2025)',
  },
  {
    id: 'R7',
    code: 'R7',
    category: 'systemic_relationship',
    categoryLabelFa: 'رابطه سیستمی تئوریک',
    nameFa: 'تنش تئوریک: مالی رفتاری و تلنگرهای هوشمند در برابر استقلال سرمایه‌گذار',
    nameEn: 'Behavioral Nudging vs. Investor Autonomy (Theoretical Tension)',
    definitionFa:
      'مداخله الگوریتم برای تصحیح سوگیری‌های روانشناختی و هدایت سرمایه‌گذار به سمت تصمیمات عقلایی ممکن است در تعارض با اختیار، خودمختاری و استقلال اراده او قرار گیرد (تنش و تضاد دیالکتیکی).',
    definitionEn:
      'Algorithmic nudges designed to counter cognitive biases create a fundamental philosophical and regulatory tension with client autonomy (Tension).',
    coreMechanisms: ['Behavioral nudging', 'Autonomy infringement', 'Paternalism vs freedom'],
    literatureEvidence: 'Kofman (2025); Mahmud et al. (2025)',
  },

  // 4. SIX PARADOXES & DIALECTICAL CONTRADICTIONS (C1 to C6)
  {
    id: 'C1',
    code: 'C1',
    category: 'paradox_contradiction',
    categoryLabelFa: 'پارادوکس تئوریک اول',
    nameFa: 'شفافیت الزاماً مساوی با کالیبراسیون اعتماد نیست',
    nameEn: 'Transparency ≠ Trust Calibration Paradox',
    definitionFa:
      'افشای کدهای فنی یا جزئیات پیچیده الگوریتم برای سرمایه‌گذار خرد نه تنها درک او را بالا نمی‌برد، بلکه با ایجاد سربار شناختی می‌تواند سبب سردرگمی یا اعتماد کاذب و غیرعقلایی گردد.',
    definitionEn:
      'Technical transparency may increase perceived compliance but does not necessarily improve decision calibration or prevent blind reliance.',
    coreMechanisms: ['Cognitive overload', 'Superficial disclosure', 'Calibrated explainability'],
    literatureEvidence: 'Balaskas (2026); Kofman (2025)',
  },
  {
    id: 'C2',
    code: 'C2',
    category: 'paradox_contradiction',
    categoryLabelFa: 'پارادوکس تئوریک دوم',
    nameFa: 'اثرات متناقض و پیچیده سواد مالی و دیجیتال',
    nameEn: 'Complex Paradox of Financial and Digital Literacy',
    definitionFa:
      'سواد دیجیتال بالا کاربران جوان را به استفاده سریع از پلتفرم‌ها ترغیب می‌کند، اما فقدان سواد مالی عمیق باعث می‌شود ریسک‌های سنگین را بدون احتیاط بپذیرند.',
    definitionEn:
      'Digital savviness accelerates platform adoption but can amplify losses when detached from substantive financial acumen.',
    coreMechanisms: ['Digital overconfidence', 'Financial literacy gap', 'Reckless speculation'],
    literatureEvidence: 'Cao et al. (2024); Zarifis et al. (2025)',
  },
  {
    id: 'C3',
    code: 'C3',
    category: 'paradox_contradiction',
    categoryLabelFa: 'پارادوکس تئوریک سوم',
    nameFa: 'اتوماسیون کامل در برابر رضایت و اعتماد بلندمدت کاربر',
    nameEn: 'Full Automation vs. Long-term Client Satisfaction & Trust',
    definitionFa:
      'اتوماسیون ۱۰۰٪ در بازارهای صعودی سریع و ارزان است، اما در زمان ریزش‌های سنگین، سرمایه‌گذاران به شدت نیازمند پاسخگویی و همدلی مشاور انسانی هستند.',
    definitionEn:
      'Pure algorithmic execution delivers cost efficiency during bull markets but experiences sharp customer churn during market downturns absent human presence.',
    coreMechanisms: ['Automation bias', 'Crisis reassurance', 'Human emotional buffer'],
    literatureEvidence: 'Scherer & Lehner (2023); Bianchi & Brière (2024)',
  },
  {
    id: 'C4',
    code: 'C4',
    category: 'paradox_contradiction',
    categoryLabelFa: 'پارادوکس تئوریک چهارم',
    nameFa: 'کارایی الگوریتمی در برابر صلبیت و شکنندگی ساختاری',
    nameEn: 'Algorithmic Optimization vs. Structural Fragility',
    definitionFa:
      'بهینه‌سازی ریاضی پورتفوی بر داده‌های تاریخی کارایی موضعی ایجاد می‌کند، اما در مواجهه با شوک‌های برون‌زا و تغییر رژیم‌های اقتصادی به شدت شکننده است.',
    definitionEn:
      'Quantitative portfolio optimization achieves mathematical efficiency but suffers severe brittle failure under unprecedented macroeconomic regime shifts.',
    coreMechanisms: ['Historical overfitting', 'Model fragility', 'Regime shift shock'],
    literatureEvidence: 'Asemi et al. (2025); Gao et al. (2026)',
  },
  {
    id: 'C5',
    code: 'C5',
    category: 'paradox_contradiction',
    categoryLabelFa: 'پارادوکس تئوریک پنجم',
    nameFa: 'شمول مالی توده‌ای در برابر توزیع نامتقارن سود در بازار',
    nameEn: 'Mass Financial Inclusion vs. Asymmetric Market Gain Capture',
    definitionFa:
      'دموکراتیزه‌سازی دسترسی میلیون‌ها شهروند خرد را وارد بازار می‌کند، اما به دلیل عدم تقارن اطلاعاتی و توان تحلیلی، سودهای کلان معمولاً به بازیگران بزرگ و نهادی اختصاص می‌یابد.',
    definitionEn:
      'Lowering entry barriers incorporates retail investors into capital markets, yet systemic information asymmetries funnel supernormal profits to institutional players.',
    coreMechanisms: ['Retail participation asymmetry', 'Information disadvantage', 'Fee extraction'],
    literatureEvidence: 'Rossi & Utkus (2024); Kumar (2024)',
  },
  {
    id: 'C6',
    code: 'C6',
    category: 'paradox_contradiction',
    categoryLabelFa: 'پارادوکس تئوریک ششم',
    nameFa: 'نوآوری پرشتاب فین‌تک در برابر محافظه‌کاری و احتیاط رگولاتوری',
    nameEn: 'Pace of FinTech Innovation vs. Regulatory Precaution',
    definitionFa:
      'سرعت پیشرفت الگوریتم‌های هوش مصنوعی و مدل‌های ثروت دیجیتال بسیار فراتر از توان تدوین قوانین توسط نهادهای ناظر است که این فاصله زمانی، ریسک‌های حقوقی و سیستمی بزرگی پدید می‌آورد.',
    definitionEn:
      'The accelerating evolution of algorithmic models severely outpaces regulatory capacity, generating persistent regulatory friction and systemic lag.',
    coreMechanisms: ['Regulatory pacing problem', 'Sandbox latency', 'Compliance ambiguity'],
    literatureEvidence: 'Kofman (2025); Steennot (2022)',
  },
];
