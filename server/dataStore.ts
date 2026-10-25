import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeDematel, computeDanp, defuzzifyTFN } from '../src/utils/mathModels.js';
import {
  BASELINE_HDS,
  BASELINE_STS,
  BASELINE_RELATIONSHIPS,
  BASELINE_CONTRADICTIONS,
  BASELINE_IRAN_CANDIDATE_FACTORS,
} from '../src/data/researchBaselineModel.js';
import { QUESTIONNAIRE_DATA, OVERALL_QUESTIONS } from '../src/data/questionnaire.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'research_db.json');

export interface ProjectConfig {
  id: string;
  titleFa: string;
  titleEn: string;
  frameworkVersion: string;
  protocolDescription: string;
  methodologySettings: {
    fuzzyDelphiThreshold: number;
    fuzzyDelphiDefuzzMethod: 'graded_mean' | 'center_of_gravity';
    dematelThresholdAlpha: 'mean' | 'manual';
    dematelManualAlpha?: number;
    dematelAggregation: 'mean' | 'median' | 'trimmed_mean';
    consensusAgreementThreshold: number; // e.g. 70 (%)
    minExpertQuorum: number; // e.g. 15
    allowSecondRound: boolean;
    requireVoiceConsent: boolean;
    enablePseudonymousOutput: boolean;
  };
}

export interface ModeratorLogItem {
  id: string;
  timestamp: string;
  author: string;
  type: 'agreement' | 'disagreement' | 'decision' | 'note';
  topic: string;
  content: string;
  itemCode?: string;
}

export interface FrameworkDecisionItem {
  id: string;
  timestamp: string;
  itemType: 'HD' | 'ST' | 'Relationship' | 'Factor' | 'Contradiction';
  itemId: string;
  action: 'retain' | 'revise' | 'merge' | 'reposition' | 'exclude' | 'add_candidate';
  approvedBy: string;
  rationale: string;
}

export interface SessionState {
  id: string;
  projectId: string;
  title: string;
  status: 'draft' | 'testing' | 'active' | 'paused' | 'locked' | 'completed';
  currentStage: string;
  currentRound: number;
  isAggregateVisibleToExperts: boolean;
  activeScreenLock: boolean;
  targetItemIndex: number;
  createdAt: string;
  updatedAt: string;
  moderatorLogs: ModeratorLogItem[];
  frameworkDecisions: FrameworkDecisionItem[];
  auditTrail: Array<{ id: string; timestamp: string; actor: string; action: string; details: string }>;
}

export interface ExpertRecord {
  id: string; // e.g. EXP-001
  token: string;
  name: string;
  organization: string;
  position: string;
  academicDegree: string;
  yearsExperience: string;
  email?: string;
  isPseudonymous: boolean;
  isTestSample?: boolean;
  status: 'invited' | 'joined' | 'in_progress' | 'submitted';
  joinedAt?: string;
  submittedAt?: string;
  lastActive: string;
}

export interface ExpertSubmission {
  expertId: string;
  round: number;
  metadata: {
    expertName: string;
    organization: string;
    expertPosition: string;
    experienceYears: string;
    educationField: string;
    primaryRole?: string;
    familiarityScore?: number;
  };
  answers: Record<string, {
    score?: number;
    refinedText?: string;
    rawTranscript?: string;
    decision?: string;
    priorityLevel?: string;
    status?: string;
  }>;
  dematelMatrix: number[][]; // 4x4
  anpPriorities: Record<string, number>;
  iranCriteriaRatings: Record<string, {
    importance: number;
    currentState: number;
    feasibility: number;
    urgency: string;
  }>;
  qualitativeComments?: Record<string, string>;
  submittedAt: string;
  lastSavedAt: string;
}

export interface DatabaseSchema {
  project: ProjectConfig;
  session: SessionState;
  experts: ExpertRecord[];
  submissions: Record<string, ExpertSubmission>;
}

// Default initial database state
const DEFAULT_PROJECT: ProjectConfig = {
  id: 'PROJ-FINTECH-IRAN-01',
  titleFa: 'اعتبارسنجی متاسنتز سرمایه‌گذاری الگوریتمی و تدوین چارچوب ایده‌آل فین‌تک در ایران',
  titleEn: 'Meta-Synthesis Validation and Ideal Algorithmic Investment & Robo-Advisory Architecture for Iran',
  frameworkVersion: 'v1.0 (فراتحلیل ۲۸ مقاله بین‌المللی)',
  protocolDescription: 'پروتکل ترکیبی دو فازه: اعتبارسنجی تئوریک (فاز ۱) و ساختاربندی بومی ایران با دیمتل، ANP و دلفی فازی (فاز ۲)',
  methodologySettings: {
    fuzzyDelphiThreshold: 0.65,
    fuzzyDelphiDefuzzMethod: 'graded_mean',
    dematelThresholdAlpha: 'mean',
    dematelAggregation: 'mean',
    consensusAgreementThreshold: 70,
    minExpertQuorum: 15,
    allowSecondRound: true,
    requireVoiceConsent: true,
    enablePseudonymousOutput: true,
  },
};

const DEFAULT_SESSION: SessionState = {
  id: 'SESS-2026-PANEL-01',
  projectId: 'PROJ-FINTECH-IRAN-01',
  title: 'نشست رسمی پانل نخبگان سرمایه‌گذاری الگوریتمی و روبوادوایزری (۱۵ الی ۲۰ خبره)',
  status: 'active',
  currentStage: 'intro',
  currentRound: 1,
  isAggregateVisibleToExperts: false,
  activeScreenLock: false,
  targetItemIndex: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  moderatorLogs: [
    {
      id: 'MOD-01',
      timestamp: new Date().toISOString(),
      author: 'دکتر علوی (مدیر جلسه)',
      type: 'note',
      topic: 'افتتاح نشست',
      content: 'نشست رسمی با حضور اساتید مهندسی مالی، مدیران سبدگردان و متخصصان رگ‌تک رسماً آغاز شد. پروتکل دو فاز مستقل برای خبرگان تبیین گردید.',
    },
  ],
  frameworkDecisions: [],
  auditTrail: [
    {
      id: 'AUD-01',
      timestamp: new Date().toISOString(),
      actor: 'سیستم',
      action: 'راه‌اندازی پروژه',
      details: 'پایگاه داده پروژه و نشست شماره ۱ با موفقیت مقداردهی اولیه شد.',
    },
  ],
};

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadDatabase(): DatabaseSchema {
  ensureDataDirectory();
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      project: DEFAULT_PROJECT,
      session: DEFAULT_SESSION,
      experts: [],
      submissions: {},
    };
    saveDatabase(initialDb);
    return initialDb;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading research_db.json, recovering with defaults:', err);
    const fallbackDb: DatabaseSchema = {
      project: DEFAULT_PROJECT,
      session: DEFAULT_SESSION,
      experts: [],
      submissions: {},
    };
    return fallbackDb;
  }
}

export function saveDatabase(db: DatabaseSchema): void {
  ensureDataDirectory();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing research_db.json:', err);
  }
}

/**
 * Deterministically generates a realistic 15-expert panel test dataset
 * strictly adhering to domain realism (Finance Profs, Portfolio Managers, Fintech CTOs, Regulators).
 */
export function generateTestExpertPanel(): { experts: ExpertRecord[]; submissions: Record<string, ExpertSubmission> } {
  const expertProfilesData = [
    { name: 'دکتر محمدرضا صادقی', org: 'دانشگاه تهران - دانشکده مدیریت', pos: 'استاد تمام مهندسی مالی', exp: '۱۸ سال', deg: 'دکتری مدیریت مالی', role: 'آکادمیک' },
    { name: 'دکتر فرناز کیانی', org: 'دانشگاه صنعتی شریف', pos: 'دانشیار هوش مصنوعی و یادگیری ماشین', exp: '۱۲ سال', deg: 'دکتری علوم کامپیوتر', role: 'فناوری / هوش مصنوعی' },
    { name: 'مهندس آرش کریمی', org: 'شرکت سبدگردان فارابی', pos: 'مدیر سرمایه‌گذاری الگوریتمی', exp: '۱۴ سال', deg: 'کارشناسی ارشد مالی محاسباتی', role: 'صنعت سرمایه‌گذاری' },
    { name: 'دکتر حسین مرادی', org: 'سازمان بورس و اوراق بهادار', pos: 'رئیس اداره رگولاتوری و ریسک ابزارهای نوین', exp: '۱۶ سال', deg: 'دکتری حقوق مالی', role: 'رگولاتوری' },
    { name: 'مهندس نیما انصاری', org: 'فین‌تک ثروت‌سازان هوشمند', pos: 'بنیان‌گذار و مدیرعامل روبوادوایزر', exp: '۱۰ سال', deg: 'کارشناسی ارشد نرم‌افزار', role: 'استارتاپ فین‌تک' },
    { name: 'دکتر سارا یوسفی', org: 'دانشگاه علامه طباطبایی', pos: 'دانشیار اقتصاد رفتاری و روانشناسی مالی', exp: '۱۳ سال', deg: 'دکتری اقتصاد مالی', role: 'آکادمیک / رفتارشناسی' },
    { name: 'مهندس بهزاد رادمنش', org: 'کارگزاری مفید', pos: 'معاون فناوری اطلاعات و زیرساخت معاملات', exp: '۱۷ سال', deg: 'کارشناسی ارشد نرم‌افزار', role: 'زیرساخت بازار سرمایه' },
    { name: 'دکتر علیرضا جمشیدی', org: 'بانک مرکزی جمهوری اسلامی ایران', pos: 'مشاور فناوری‌های نوین بانکی و پرداخت', exp: '۱۹ سال', deg: 'دکتری سیستم‌های اطلاعاتی', role: 'رگولاتوری بانکی' },
    { name: 'مهندس پریسا طاهری', org: 'سبدگردان آگاه', pos: 'تحلیل‌گر ارشد کمی و طراح استراتژی‌های کمی (Quant)', exp: '۹ سال', deg: 'کارشناسی ارشد آمار کاربردی', role: 'معاملات الگوریتمی' },
    { name: 'دکتر مجید حیدری', org: 'دانشگاه شهید بهشتی', pos: 'استاد اقتصاد مالی و اقتصادسنجی', exp: '۲۱ سال', deg: 'دکتری علوم اقتصادی', role: 'آکادمیک' },
    { name: 'مهندس کاوه شریفی', org: 'روبوادوایزر مانیکو', pos: 'مدیر محصول سبدگردانی آنلاین', exp: '۸ سال', deg: 'کارشناسی ارشد MBA', role: 'محصول فین‌تک' },
    { name: 'دکتر الهام شمس', org: 'پژوهشکده پولی و بانکی', pos: 'مدیر گروه فین‌تک و نوآوری دیجیتال', exp: '۱۱ سال', deg: 'دکتری مدیریت فناوری', role: 'پژوهش سیاست‌گذاری' },
    { name: 'مهندس مسعود افشار', org: 'شرکت مدیریت فناوری بورس تهران (TSETMC)', pos: 'کارشناس ارشد معماری داده بازار', exp: '۱۵ سال', deg: 'کارشناسی ارشد مهندسی سیستم', role: 'زیرساخت بورس' },
    { name: 'دکتر کامران نادری', org: 'صندوق سرمایه‌گذاری جسورانه (VC)', pos: 'شریک سرمایه‌گذار در حوزه فین‌تک', exp: '۱۳ سال', deg: 'دکتری سرمایه‌گذاری جسورانه', role: 'سرمایه‌گذاری خطرپذیر' },
    { name: 'مهندس زهرا عسگری', org: 'کانون نهادهای سرمایه‌گذاری ایران', pos: 'دبیر کمیته فناوری و سبدگردانی دیجیتال', exp: '۱۰ سال', deg: 'کارشناسی ارشد مدیریت ریسک', role: 'نهاد صنفی مالی' },
  ];

  const experts: ExpertRecord[] = [];
  const submissions: Record<string, ExpertSubmission> = {};

  const baseDematelMatrix: number[][] = [
    [0, 3, 2, 3], // HD1 -> HD2, HD3, HD4
    [2, 0, 3, 2], // HD2 -> HD1, HD3, HD4
    [3, 3, 0, 3], // HD3 -> HD1, HD2, HD4
    [3, 2, 3, 0], // HD4 -> HD1, HD2, HD3
  ];

  expertProfilesData.forEach((profile, idx) => {
    const expertId = `EXP-${String(idx + 1).padStart(3, '0')}`;
    const token = `token-${expertId.toLowerCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    experts.push({
      id: expertId,
      token,
      name: profile.name,
      organization: profile.org,
      position: profile.pos,
      academicDegree: profile.deg,
      yearsExperience: profile.exp,
      isPseudonymous: false,
      isTestSample: true,
      status: 'submitted',
      joinedAt: new Date(Date.now() - (15 - idx) * 3600000).toISOString(),
      submittedAt: new Date(Date.now() - (15 - idx) * 1800000).toISOString(),
      lastActive: new Date().toISOString(),
    });

    // Generate realistic, consistent responses for all 18 questionnaire questions
    const answers: ExpertSubmission['answers'] = {};
    QUESTIONNAIRE_DATA.forEach((q, qIdx) => {
      // Scores between 4 and 5 with occasional 3 for realistic distribution
      const scoreVariance = ((idx * 7 + qIdx * 13) % 10) / 10;
      let score = 4;
      if (scoreVariance > 0.65) score = 5;
      else if (scoreVariance < 0.15) score = 3;

      answers[q.id] = {
        score,
        refinedText: `تحلیل خبره ${profile.name} پیرامون گویه «${q.title}»: چارچوب اولیه از جامعیت مفهومی بالایی برخوردار است. با این حال در بافت اقتصادی ایران، ابعاد اعتمادسازی و شفافیت الگوریتم نیازمند بازطراحی دقیق‌تری است.`,
        decision: score >= 4 ? 'retain' : 'revise',
        priorityLevel: q.phase === 'phase2_iran' ? (score === 5 ? 'urgent' : 'medium') : undefined,
      };
    });

    // 2 Overall Synthesis Questions
    answers['PHASE1_OVERALL'] = {
      score: 5,
      refinedText: `جمع‌بندی فاز ۱: چارچوب متاسنتز اولیه حاصل از ۲۸ مقاله بین‌المللی یک پایگاه تئوریک قوی و ساختاریافته ارائه می‌دهد. پیوند بین HD1 (روانشناسی) و HD2 (معماری تصمیم) ستون فقرات مدل است. پیشنهاد می‌شود شرایط مرزی ریزش‌های شارپ بازار در مدل پررنگ‌تر دیده شود.`,
    };
    answers['PHASE2_OVERALL'] = {
      score: 5,
      refinedText: `مانیفست راهبردی فاز ۲ برای ایران: ۱. اعطای مجوز مستقل سبدگردانی آنلاین به فین‌تک‌ها بدون شرط کف سرمایه نجومی، ۲. راه‌اندازی سندباکس تخصصی الگوریتم‌ها با رگ‌تک، ۳. آموزش عمومی سواد مالی برای گذار از معاملات هیجانی انفرادی به مدیریت ثروت قاعده‌مند.`,
    };

    // Realistic variation of DEMATEL matrix around consensus
    const expertMatrix = baseDematelMatrix.map((row, rI) =>
      row.map((val, cI) => {
        if (rI === cI) return 0;
        const delta = ((idx + rI * 3 + cI * 5) % 3) - 1; // -1, 0, or +1
        return Math.max(1, Math.min(4, val + delta));
      })
    );

    // Realistic Iran criteria ratings for all 30 candidate factors
    const criteriaRatings: ExpertSubmission['iranCriteriaRatings'] = {};
    BASELINE_IRAN_CANDIDATE_FACTORS.forEach((factor, fIdx) => {
      const imp = Math.min(7, Math.max(4, factor.importance + (((idx + fIdx) % 3) - 1)));
      const curr = Math.min(7, Math.max(1, factor.currentState + (((idx + fIdx * 2) % 3) - 1)));
      const feas = Math.min(7, Math.max(3, factor.feasibility + (((idx + fIdx * 3) % 3) - 1)));
      const urg =
        factor.urgency >= 6
          ? 'ضربتی (۱-۲ سال)'
          : factor.urgency >= 4
          ? 'میان‌مدت (۲-۳ سال)'
          : 'بلندمدت (۳-۵ سال)';
      criteriaRatings[factor.id] = {
        importance: imp,
        currentState: curr,
        feasibility: feas,
        urgency: urg,
      };
    });

    // ANP priorities
    const anpPriorities: Record<string, number> = {
      HD1: 28 + ((idx % 5) - 2),
      HD2: 24 + (((idx + 1) % 5) - 2),
      HD3: 26 + (((idx + 2) % 5) - 2),
      HD4: 22 + (((idx + 3) % 5) - 2),
    };

    submissions[expertId] = {
      expertId,
      round: 1,
      metadata: {
        expertName: profile.name,
        organization: profile.org,
        expertPosition: profile.pos,
        experienceYears: profile.exp,
        educationField: profile.deg,
        primaryRole: profile.role,
        familiarityScore: 6,
      },
      answers,
      dematelMatrix: expertMatrix,
      anpPriorities,
      iranCriteriaRatings: criteriaRatings,
      submittedAt: new Date(Date.now() - (15 - idx) * 1800000).toISOString(),
      lastSavedAt: new Date().toISOString(),
    };
  });

  return { experts, submissions };
}

/**
 * Computes live aggregate analytics across all submitted expert sessions.
 */
export function computeAggregateAnalytics(db: DatabaseSchema) {
  const submissions = Object.values(db.submissions);
  const totalSubmissions = submissions.length;

  if (totalSubmissions === 0) {
    return null;
  }

  // 1. Question-by-question statistical summary (Medians, IQR, Agreement %)
  const questionStats: Record<string, {
    id: string;
    scores: number[];
    median: number;
    iqr: number;
    mean: number;
    agreementPct: number; // % rating >= 4 out of 5
    distribution: Record<number, number>;
    transcriptsCount: number;
  }> = {};

  const allQIds = [
    ...QUESTIONNAIRE_DATA.map((q) => q.id),
    'PHASE1_OVERALL',
    'PHASE2_OVERALL',
  ];

  allQIds.forEach((qId) => {
    const scores: number[] = [];
    let transcriptsCount = 0;
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    submissions.forEach((sub) => {
      const ans = sub.answers[qId];
      if (ans && typeof ans.score === 'number' && ans.score >= 1 && ans.score <= 5) {
        scores.push(ans.score);
        distribution[ans.score] = (distribution[ans.score] || 0) + 1;
      }
      if (ans?.refinedText || ans?.rawTranscript) {
        transcriptsCount++;
      }
    });

    scores.sort((a, b) => a - b);
    const n = scores.length;
    let median = 0;
    let iqr = 0;
    let mean = 0;
    let agreementPct = 0;

    if (n > 0) {
      mean = Number((scores.reduce((a, b) => a + b, 0) / n).toFixed(2));
      median = n % 2 === 1 ? scores[Math.floor(n / 2)] : (scores[n / 2 - 1] + scores[n / 2]) / 2;
      const q1 = scores[Math.floor(n * 0.25)];
      const q3 = scores[Math.floor(n * 0.75)];
      iqr = Number((q3 - q1).toFixed(2));
      const agreeCount = scores.filter((s) => s >= 4).length;
      agreementPct = Number(((agreeCount / n) * 100).toFixed(1));
    }

    questionStats[qId] = {
      id: qId,
      scores,
      median,
      iqr,
      mean,
      agreementPct,
      distribution,
      transcriptsCount,
    };
  });

  // 2. DEMATEL Aggregation (Arithmetic mean across all expert matrices)
  const nDim = 4;
  const aggregatedDirectMatrix: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  let matrixCount = 0;
  submissions.forEach((sub) => {
    if (sub.dematelMatrix && sub.dematelMatrix.length === nDim) {
      matrixCount++;
      for (let i = 0; i < nDim; i++) {
        for (let j = 0; j < nDim; j++) {
          aggregatedDirectMatrix[i][j] += sub.dematelMatrix[i][j] || 0;
        }
      }
    }
  });

  if (matrixCount > 0) {
    for (let i = 0; i < nDim; i++) {
      for (let j = 0; j < nDim; j++) {
        aggregatedDirectMatrix[i][j] = Number((aggregatedDirectMatrix[i][j] / matrixCount).toFixed(3));
      }
    }
  }

  const dematelResult = computeDematel(aggregatedDirectMatrix);
  const danpResult = computeDanp(dematelResult.totalRelationMatrix);

  // 3. Fuzzy Delphi Factor Screening (30 candidate factors)
  const factorScreening: Array<{
    id: string;
    code: string;
    titleFa: string;
    category: string;
    meanImportance: number;
    meanMaturity: number;
    meanFeasibility: number;
    tfn: { l: number; m: number; u: number };
    defuzzifiedScore: number;
    consensusRate: number;
    status: 'accepted' | 'borderline' | 'rejected';
    sensitivity: Record<string, boolean>; // e.g. '0.60': true, '0.65': true, '0.70': false
  }> = [];

  const threshold = db.project.methodologySettings.fuzzyDelphiThreshold || 0.65;

  BASELINE_IRAN_CANDIDATE_FACTORS.forEach((factor) => {
    const impRatings: number[] = [];
    const matRatings: number[] = [];
    const feasRatings: number[] = [];

    submissions.forEach((sub) => {
      const r = sub.iranCriteriaRatings?.[factor.id];
      if (r) {
        if (typeof r.importance === 'number') impRatings.push(r.importance);
        if (typeof r.currentState === 'number') matRatings.push(r.currentState);
        if (typeof r.feasibility === 'number') feasRatings.push(r.feasibility);
      }
    });

    const meanImp = impRatings.length > 0 ? Number((impRatings.reduce((a, b) => a + b, 0) / impRatings.length).toFixed(2)) : factor.importance;
    const meanMat = matRatings.length > 0 ? Number((matRatings.reduce((a, b) => a + b, 0) / matRatings.length).toFixed(2)) : factor.currentState;
    const meanFeas = feasRatings.length > 0 ? Number((feasRatings.reduce((a, b) => a + b, 0) / feasRatings.length).toFixed(2)) : factor.feasibility;

    // Normalize 1-7 scale to [0, 1] for TFN:
    const normImp = meanImp / 7;
    const l = Math.max(0, normImp - 0.15);
    const m = normImp;
    const u = Math.min(1, normImp + 0.15);
    const defuzz = Number(defuzzifyTFN(l, m, u).toFixed(3));

    const consensusCount = impRatings.filter((r) => r >= 5).length;
    const consensusRate = impRatings.length > 0 ? Number(((consensusCount / impRatings.length) * 100).toFixed(1)) : 80;

    let status: 'accepted' | 'borderline' | 'rejected' = 'accepted';
    if (defuzz >= threshold) {
      status = 'accepted';
    } else if (defuzz >= threshold - 0.08) {
      status = 'borderline';
    } else {
      status = 'rejected';
    }

    const sensitivity: Record<string, boolean> = {
      '0.55': defuzz >= 0.55,
      '0.60': defuzz >= 0.60,
      '0.65': defuzz >= 0.65,
      '0.70': defuzz >= 0.70,
      '0.75': defuzz >= 0.75,
    };

    factorScreening.push({
      id: factor.id,
      code: factor.code,
      titleFa: factor.titleFa,
      category: factor.category,
      meanImportance: meanImp,
      meanMaturity: meanMat,
      meanFeasibility: meanFeas,
      tfn: { l: Number(l.toFixed(3)), m: Number(m.toFixed(3)), u: Number(u.toFixed(3)) },
      defuzzifiedScore: defuzz,
      consensusRate,
      status,
      sensitivity,
    });
  });

  return {
    totalSubmissions,
    totalExperts: db.experts.length,
    activeQuorumMet: totalSubmissions >= (db.project.methodologySettings.minExpertQuorum || 15),
    questionStats,
    dematelResult,
    danpResult,
    factorScreening,
    calculatedAt: new Date().toISOString(),
  };
}
