/**
 * Exploratory Contextual Prompts for Iran-Specific Model Development
 * Important Research Rule: These are exploratory prompts to elicit expert judgments,
 * NOT predetermined or pre-validated constructs.
 */

export interface IranExploratoryPrompt {
  id: string; // EXP-IR-01 to 10
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  probingQuestionsFa: string[];
}

export const IRAN_EXPLORATORY_PROMPTS: IranExploratoryPrompt[] = [
  {
    id: 'EXP-IR-01',
    titleFa: '۱. الزامات رگولاتوری و نظارتی ناظر بازار سرمایه و پول',
    titleEn: 'Regulatory and Supervisory Arrangements',
    descriptionFa:
      'قوانین و مقررات فعلی سازمان بورس و اوراق بهادار، بانک مرکزی و دستورالعمل‌های سبدگردانی الگوریتمی و مشاور-در-حلقه (AITL).',
    probingQuestionsFa: [
      'آیا دستورالعمل فعلی سبدگردانی بورس با الزامات روبوادوایزری تمام‌الگوریتمی همخوانی دارد؟',
      'مسئولیت مدنی و کیفری ضررهای ناشی از باگ یا ریزش سیستم متوجه کیست؟',
    ],
  },
  {
    id: 'EXP-IR-02',
    titleFa: '۲. هماهنگی نهادی میان نهادهای ناظر (بانک مرکزی، سازمان بورس، شورای فضای مجازی)',
    titleEn: 'Institutional Coordination Across Regulators',
    descriptionFa:
      'تشتت یا همگرایی نهادی میان متولیان پولی، بانکی، بیمه و بازار سرمایه در پذیرش مدل‌های فین‌تک ثروت.',
    probingQuestionsFa: [
      'تعارض صلاحیت‌ها میان ناظر بانکی و ناظر بازار سرمایه چگونه مهار می‌شود؟',
      'آیا استقرار یک سندباکس رگولاتوری چندبخشی (Cross-Regulatory Sandbox) ضروری است؟',
    ],
  },
  {
    id: 'EXP-IR-03',
    titleFa: '۳. دسترسی به زیرساخت‌های مالی و فناورانه هسته معاملات و پرداخت',
    titleEn: 'Financial and Technological Infrastructure Access',
    descriptionFa:
      'کیفیت وب‌سرویس‌ها، پایداری هسته معاملات شرکت مدیریت فناوری بورس (TSETMC)، دسترسی به Open Banking و درگاه‌های واریز آنی.',
    probingQuestionsFa: [
      'آیا قطعی‌ها یا محدودیت‌های تاخیر زمانی (Latency) هسته معاملات مانع الگوریتم‌هاست؟',
      'پلتفرم‌های فین‌تک تا چه حد دسترسی عادلانه به زیرساخت کارگزاری‌ها دارند؟',
    ],
  },
  {
    id: 'EXP-IR-04',
    titleFa: '۴. دسترسی، کیفیت، شفافیت و هم‌کنش‌پذیری داده‌های مالی و شرکتی',
    titleEn: 'Data Availability, Interoperability, and Quality',
    descriptionFa:
      'قابلیت اتکای صورت‌های مالی کدال (Codal)، عمق داده‌های تاریخی، داده‌های اعتبارسنجی ایرانیان و کیفیت استانداردهای تبادل داده.',
    probingQuestionsFa: [
      'آیا داده‌های کدال و معاملات به اندازه کافی استاندارد و ماشین‌خوان هستند؟',
      'آیا امکان اتصال امن داده‌های بانکی و مالی برای پروفایل‌سازی جامع دارایی وجود دارد؟',
    ],
  },
  {
    id: 'EXP-IR-05',
    titleFa: '۵. نااطمینانی اقتصاد کلان، تورم مزمن و پناهگاه‌های دارایی (طلا، ارز، ملک)',
    titleEn: 'Macroeconomic Uncertainty, Inflation, and Multi-Asset Hedging',
    descriptionFa:
      'نرخ تورم بالا، نوسانات ارزی و لزوم تخصیص دارایی به کلاس‌های ضدتورمی فراتر از سهام ریالی ساده.',
    probingQuestionsFa: [
      'آیا یک روبوادوایزر ایرانی بدون امکان مدیریت طلا، صندوق‌های کالایی و ارز می‌تواند ثروت را حفظ کند؟',
      'مدل‌های تخصیص دارایی کلاسیک مانند مارکوویتز در شرایط تورم ۴۰٪ چگونه باید تعدیل شوند؟',
    ],
  },
  {
    id: 'EXP-IR-06',
    titleFa: '۶. انزوای بین‌المللی، تحریم‌های فناوری و محدودیت ابزارهای جهانی',
    titleEn: 'International Connectivity and External Restrictions',
    descriptionFa:
      'عدم دسترسی رسمی به سرویس‌های هوش مصنوعی و کلاد جهانی، تحریم‌های مالی و مسدود بودن تنوع‌بخشی بین‌المللی پورتفوی.',
    probingQuestionsFa: [
      'چگونه می‌توان وابستگی مدل‌های هوش مصنوعی را به APIهای خارجی مدیریت نمود؟',
      'آیا تحریم‌ها مانع استفاده از تجارب و بنچ‌مارک‌های جهانی است؟',
    ],
  },
  {
    id: 'EXP-IR-07',
    titleFa: '۷. ادراک ریسک عمومی، روانشناسی سرمایه‌گذار و بی‌اعتمادی تاریخی (تجربه ۱۳۹۹)',
    titleEn: 'Investor Trust, Risk Perception, and Historical Traumas',
    descriptionFa:
      'بی‌اعتمادی ناشی از بحران ریزش بورس در سال ۱۳۹۹، سوگیری‌های توده‌وار و تمایل به سودهای نجومی کوتاه‌مدت.',
    probingQuestionsFa: [
      'چگونه یک سیستم دیجیتال می‌تواند اعتماد سلب‌شده بعد از ۱۳۹۹ را بازسازی کند؟',
      'چه سازوکارهایی برای مهار رفتار گله‌ای (Herd Behavior) در بازار سرمایه ایران نیاز است؟',
    ],
  },
  {
    id: 'EXP-IR-08',
    titleFa: '۸. امنیت سایبری، تاب‌آوری عملیاتی و حفاظت از حریم داده‌های مالی',
    titleEn: 'Cybersecurity, Operational Resilience, and Data Privacy',
    descriptionFa:
      'حملات سایبری، نشت اطلاعات مالی سرمایه‌گذاران، قطع اینترنت و الزامات پدافند غیرعامل در حفاظت از هسته الگوریتم.',
    probingQuestionsFa: [
      'در صورت قطعی ارتباطات خارجی یا اینترنت ملی، تاب‌آوری پلتفرم چگونه تضمین می‌شود؟',
      'قوانین صیانت از حریم خصوصی داده‌های مالی در سامانه‌های روبوادوایزری چگونه باید باشد؟',
    ],
  },
  {
    id: 'EXP-IR-09',
    titleFa: '۹. تمرکز بازار، تعارض منافع و انحصار نهادهای مالی سنتی و خصولتی',
    titleEn: 'Market Concentration, Conflicts of Interest, and Incumbent Power',
    descriptionFa:
      'نفوذ هلدینگ‌های بزرگ، سهامداری ضربدری بانک‌ها و کارگزاری‌ها، و موانع ورود پیش‌روی استارتاپ‌های فین‌تک مستقل.',
    probingQuestionsFa: [
      'آیا مدل کارمزد کارگزاری‌ها مشوق توصیه‌های جانبدارانه به نفع معاملات مکرر است؟',
      'چگونه می‌توان استقلال تحلیلی الگوریتم را در برابر منافع سهامدار خصولتی تضمین کرد؟',
    ],
  },
  {
    id: 'EXP-IR-10',
    titleFa: '۱۰. سرمایه انسانی متخصص، شایستگی‌های هوش مصنوعی مالی و ظرفیت اجرا',
    titleEn: 'Talent, Financial AI Competencies, and Implementation Capacity',
    descriptionFa:
      'مهاجرت نخبگان فنی و داده‌ای، شکاف بین متخصصان مالی سنتی و دانشمندان هوش مصنوعی و توان شرکت‌ها در نگهداری مدل.',
    probingQuestionsFa: [
      'آیا اکوسیستم ایران از نظر مهندسان هوش مصنوعی مالی در سطح پاسخگویی به این معماری است؟',
      'فارغ‌التحصیلان رشته‌های مالی تا چه حد با الگوریتم و کدنویسی آشنا هستند؟',
    ],
  },
];
