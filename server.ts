import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  loadDatabase,
  saveDatabase,
  generateTestExpertPanel,
  computeAggregateAnalytics,
  ExpertSubmission,
} from './server/dataStore.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = express();
  app.use(express.json({ limit: '60mb' }));

  // Enable CORS for reverse proxies & Cloudflare Workers in Iran
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Helper to generate content with fallback models
  async function generateWithFallback(params: any) {
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const res = await ai.models.generateContent({
          ...params,
          model,
          config: {
            maxOutputTokens: 8192,
            ...(params.config || {}),
          },
        });
        if (res && res.text) {
          return res.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt note:`, err?.status || err?.message || 'failed');
        // If 429 quota exhausted, break out to avoid spamming the free-tier limit
        if (err?.status === 429 || String(err?.message || '').includes('429') || String(err?.message || '').includes('quota')) {
          break;
        }
      }
    }
    throw lastError;
  }

  // Dedicated helper for audio transcription tasks optimized for ultra-fast response
  async function transcribeAudioWithFallback(audioBase64: string, mimeType: string, promptText: string) {
    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      'gemini-3.5-transcribe',
      'gemini-3.8-flash',
    ];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const config: any = {
          maxOutputTokens: 8192,
          temperature: 0.1, // Deterministic decoding for maximum speed and accuracy
        };

        // Disable reasoning/thinking tokens to eliminate 4-8 second latency delays
        if (model.includes('gemini-3')) {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
        }

        const res = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'audio/webm',
                  data: audioBase64,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config,
        });

        if (res && res.text) {
          return res.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Transcription model ${model} note:`, err?.status || err?.message || 'failed');
        continue;
      }
    }
    throw lastError;
  }

  // API Route: Complete Audio Recording Transcription using Gemini
  app.post('/api/transcribe-audio', async (req, res) => {
    try {
      const { audioBase64, mimeType, questionTitle, questionText, context } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: 'فایل صوتی ارسال نشده است.' });
      }

      const prompt = `شما سریع‌ترین و دقیق‌ترین سیستم تبدیل گفتار به متن فارسی برای مصاحبه‌های تخصصی نخبگان در حوزه فین‌تک، سرمایه‌گذاری دیجیتال، بورس و مشاوره الگوریتمی (Robo-Advisory) هستید.
عنوان پرسش: "${questionTitle || ''} - ${questionText || ''}"
${context ? `زمینه پژوهشی: "${context}"` : ''}

وظیفه: تمام کلمات این فایل صوتی را فوراً و با نهایت دقت به زبان فارسی پیاده‌سازی و تایپ کن.
دستورالعمل‌ها:
۱. اصطلاحات تخصصی مالی، فین‌تک و هوش مصنوعی (مانند: روبوادوایزر، سبدگردانی الگوریتمی، کالیبراسیون اعتماد، مشاور-در-حلقه AITL، خطای اتوماسیون، گریز از الگوریتم، باز-واسطه‌گری، مجوز AIRAL، آزمون تناسب MiFID II، شاخص شارپ، سرمایه‌گذاری جسورانه VC، سندباکس رگولاتوری، رگ‌تک، عدم تقارن اطلاعاتی، سازمان بورس، بانک مرکزی) را با املای استاندارد و نیم‌فاصله‌ها ثبت کن.
۲. علائم نگارشی و پاراگراف‌بندی مناسب را برای خوانایی رعایت کن.
۳. فقط و فقط متن پیاده‌شده نهایی را بدون هیچ مقدمه، توضیح اضافه یا علامت نقل‌قول خروجی بده.`;

      const transcribed = await transcribeAudioWithFallback(audioBase64, mimeType, prompt);
      return res.json({ text: (transcribed || '').trim() });
    } catch (err: any) {
      console.warn('Full transcription error:', err?.status || err?.message);
      const isQuota = err?.status === 429 || String(err?.message || '').includes('429');
      return res.status(isQuota ? 429 : 500).json({
        error: isQuota
          ? 'سهمیه موقت هوش مصنوعی تکمیل شده است.'
          : 'خطا در ارتباط با سرویس پیاده‌سازی صوت.',
        quotaExceeded: isQuota,
      });
    }
  });

  // API Route: AI Text refinement & Speech polish
  app.post('/api/ai-refine', async (req, res) => {
    try {
      const { text, questionTitle, questionText, context, audioBase64, mimeType } = req.body;

      if (!text && !audioBase64) {
        return res.status(400).json({ error: 'متن یا صوت برای تحلیل ارسال نشده است.' });
      }

      // If audio base64 is provided directly
      if (audioBase64) {
        try {
          const refinedText = await generateWithFallback({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType || 'audio/webm',
                      data: audioBase64,
                    },
                  },
                  {
                    text: `این یک فایل صوتی از مصاحبه نخبگانی و تخصصی پیرامون "اعتبارسنجی متاسنتز سرمایه‌گذاری دیجیتال و تدوین چارچوب ایده‌آل فین‌تک و روبوادوایزری در ایران" است.
پرسش مطرح شده: "${questionTitle || ''} - ${questionText || ''}"
زمینه پرسش: "${context || ''}"

لطفاً صدای مصاحبه‌شونده را دقیقاً به زبان فارسی پیاده‌سازی و نگارش کن. با توجه به اینکه ممکن است کیفیت ضبط نامطلوب باشد، کلمات بریده یا خطای تلفظ باشد، با حفظ اصالت دقیق نظرات و ادعاهای فرد، متن را با رعایت اصطلاحات تخصصی فین‌تک و مالی (مانند روبوادوایزر، سبدگردانی، کالیبراسیون اعتماد، AITL، اتوماسیون، گریز از الگوریتم، باز-واسطه‌گری، مجوز AIRAL، شاخص شارپ، سندباکس، رگ‌تک، بورس و بانکداری) ویرایش و بدون افزودن هیچ توضیح اضافی، فقط متن نهایی ویراسته را خروجی بده.`,
                  },
                ],
              },
            ],
          });

          return res.json({ refinedText: refinedText.trim() });
        } catch (audioErr: any) {
          console.warn('Audio transcription fallback triggered:', audioErr?.status || audioErr?.message);
          return res.json({
            refinedText: text || 'صوت دریافت شد.',
            fallback: true,
          });
        }
      }

      // If raw transcript text is provided to be refined & polished
      const prompt = `متن زیر پیش‌نویس حاصل از تبدیل گفتار به متن در مصاحبه نخبگانی ارزیابی چارچوب فین‌تک و روبوادوایزری است.
با حفظ کامل نظرات و ساختار محتوایی گوینده، خطاهای شنیداری، فاصله‌گذاری، نیم‌فاصله‌ها و اصطلاحات تخصصی مالی، فین‌تک و الگوریتمی (نظیر روبوادوایزر، سبدگردانی الگوریتمی، کالیبراسیون اعتماد، AITL، باز-واسطه‌گری، مجوز AIRAL، شاخص شارپ، سندباکس رگولاتوری، سازمان بورس، بانک مرکزی) را سریع و دقیق تصحیح کن.
تنها متن نهایی ویراسته را بدون هیچ کلمه، مقدمه یا توضیح اضافی خروجی بده:
"${text}"`;

      try {
        const refined = await generateWithFallback({
          contents: prompt,
        });

        return res.json({ refinedText: (refined || text).trim() });
      } catch (genErr: any) {
        console.warn('AI models unavailable, returning original text:', genErr?.status || genErr?.message);
        return res.json({ refinedText: text, fallback: true, quotaExceeded: genErr?.status === 429 });
      }
    } catch (error: any) {
      console.warn('Error in /api/ai-refine:', error?.status || error?.message);
      return res.json({ refinedText: req.body?.text || '', fallback: true });
    }
  });

  // =========================================================================
  // RESEARCH PROJECT & SESSION MANAGEMENT APIS
  // =========================================================================

  // GET /api/project - Retrieve project config
  app.get('/api/project', (_req, res) => {
    try {
      const db = loadDatabase();
      return res.json({ project: db.project });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در بارگذاری پروژه' });
    }
  });

  // POST /api/project - Update project config & methodology settings
  app.post('/api/project', (req, res) => {
    try {
      const db = loadDatabase();
      db.project = {
        ...db.project,
        ...req.body,
        methodologySettings: {
          ...db.project.methodologySettings,
          ...(req.body.methodologySettings || {}),
        },
      };
      saveDatabase(db);
      return res.json({ success: true, project: db.project });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در ذخیره تنظیمات پروژه' });
    }
  });

  // GET /api/session - Retrieve active session state
  app.get('/api/session', (_req, res) => {
    try {
      const db = loadDatabase();
      return res.json({ session: db.session, expertCount: db.experts.length, submissionCount: Object.keys(db.submissions).length });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در دریافت وضعیت نشست' });
    }
  });

  // PUT /api/session - Update session state (stage, status, round, lock, visibility)
  app.put('/api/session', (req, res) => {
    try {
      const db = loadDatabase();
      const updates = req.body;
      db.session = {
        ...db.session,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Add audit entry if status or stage changed
      if (updates.status || updates.currentStage || updates.isAggregateVisibleToExperts !== undefined) {
        db.session.auditTrail.push({
          id: 'AUD-' + Date.now(),
          timestamp: new Date().toISOString(),
          actor: req.body.operatorName || 'تسهیل‌گر نشست',
          action: 'تغییر وضعیت نشست',
          details: `وضعیت: ${db.session.status} | مرحله: ${db.session.currentStage} | دور: ${db.session.currentRound} | نتایج تجمیعی: ${db.session.isAggregateVisibleToExperts ? 'آشکار' : 'پنهان'}`,
        });
      }

      saveDatabase(db);
      return res.json({ success: true, session: db.session });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در به‌روزرسانی نشست' });
    }
  });

  // POST /api/session/moderator-note - Add facilitator discussion note / decision
  app.post('/api/session/moderator-note', (req, res) => {
    try {
      const db = loadDatabase();
      const { author, type, topic, content, itemCode } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'متن یادداشت نمی‌تواند خالی باشد.' });
      }

      const newNote = {
        id: 'MOD-' + Date.now(),
        timestamp: new Date().toISOString(),
        author: author || 'تسهیل‌گر نشست',
        type: type || 'note',
        topic: topic || 'نکته عمومی',
        content,
        itemCode,
      };

      db.session.moderatorLogs.unshift(newNote);
      saveDatabase(db);
      return res.json({ success: true, note: newNote, logs: db.session.moderatorLogs });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در ثبت یادداشت تسهیل‌گر' });
    }
  });

  // POST /api/session/framework-decision - Record researcher approved framework decision
  app.post('/api/session/framework-decision', (req, res) => {
    try {
      const db = loadDatabase();
      const { itemType, itemId, action, approvedBy, rationale } = req.body;

      const newDecision = {
        id: 'DEC-' + Date.now(),
        timestamp: new Date().toISOString(),
        itemType: itemType || 'Factor',
        itemId,
        action: action || 'retain',
        approvedBy: approvedBy || 'پژوهشگر ارشد',
        rationale: rationale || 'مصوب نشست پنل خبرگان',
      };

      db.session.frameworkDecisions.unshift(newDecision);
      saveDatabase(db);
      return res.json({ success: true, decision: newDecision, decisions: db.session.frameworkDecisions });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در ثبت تصمیم چارچوب' });
    }
  });

  // GET /api/experts - List all registered/invited experts
  app.get('/api/experts', (_req, res) => {
    try {
      const db = loadDatabase();
      return res.json({
        experts: db.experts,
        total: db.experts.length,
        submittedCount: db.experts.filter((e) => e.status === 'submitted').length,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در دریافت فهرست خبرگان' });
    }
  });

  // POST /api/experts/invite - Register or invite a new expert
  app.post('/api/experts/invite', (req, res) => {
    try {
      const db = loadDatabase();
      const { name, organization, position, academicDegree, yearsExperience, email, isPseudonymous } = req.body;
      const nextNum = db.experts.length + 1;
      const id = `EXP-${String(nextNum).padStart(3, '0')}`;
      const token = `inv-${id.toLowerCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const newExpert = {
        id,
        token,
        name: name || `خبره ارجمند شماره ${nextNum}`,
        organization: organization || 'سازمان / دانشگاه',
        position: position || 'متخصص مالی / فین‌تک',
        academicDegree: academicDegree || 'دکتری',
        yearsExperience: yearsExperience || '۱۰ سال',
        email,
        isPseudonymous: Boolean(isPseudonymous),
        status: 'invited' as const,
        lastActive: new Date().toISOString(),
      };

      db.experts.push(newExpert);
      saveDatabase(db);
      return res.json({ success: true, expert: newExpert });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در ایجاد دعوت‌نامه خبره' });
    }
  });

  // GET /api/expert-session/:idOrToken - Fetch expert session submission
  app.get('/api/expert-session/:idOrToken', (req, res) => {
    try {
      const db = loadDatabase();
      const param = req.params.idOrToken;
      const expert = db.experts.find((e) => e.id === param || e.token === param);
      const expertId = expert ? expert.id : param;
      const submission = db.submissions[expertId];

      return res.json({
        expert: expert || null,
        submission: submission || null,
        session: {
          currentStage: db.session.currentStage,
          currentRound: db.session.currentRound,
          status: db.session.status,
          isAggregateVisibleToExperts: db.session.isAggregateVisibleToExperts,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در بازیابی نشست خبره' });
    }
  });

  // POST /api/expert-session/:idOrToken - Save/Update expert responses and metadata
  app.post('/api/expert-session/:idOrToken', (req, res) => {
    try {
      const db = loadDatabase();
      const param = req.params.idOrToken;
      let expert = db.experts.find((e) => e.id === param || e.token === param);

      // If expert not yet registered, auto-register
      if (!expert) {
        const id = param.startsWith('EXP-') ? param : `EXP-${String(db.experts.length + 1).padStart(3, '0')}`;
        expert = {
          id,
          token: param,
          name: req.body.metadata?.expertName || 'خبره مصاحبه‌شونده',
          organization: req.body.metadata?.organization || '',
          position: req.body.metadata?.expertPosition || '',
          academicDegree: req.body.metadata?.educationField || '',
          yearsExperience: req.body.metadata?.experienceYears || '',
          isPseudonymous: false,
          status: 'in_progress',
          joinedAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };
        db.experts.push(expert);
      }

      const { metadata, answers, dematelMatrix, anpPriorities, iranCriteriaRatings, isFinalSubmit } = req.body;

      const existingSub = db.submissions[expert.id] || {
        expertId: expert.id,
        round: db.session.currentRound || 1,
        metadata: {},
        answers: {},
        dematelMatrix: [],
        anpPriorities: {},
        iranCriteriaRatings: {},
        submittedAt: new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
      };

      const updatedSub: ExpertSubmission = {
        ...existingSub,
        metadata: { ...existingSub.metadata, ...(metadata || {}) },
        answers: { ...existingSub.answers, ...(answers || {}) },
        dematelMatrix: dematelMatrix || existingSub.dematelMatrix,
        anpPriorities: anpPriorities || existingSub.anpPriorities,
        iranCriteriaRatings: iranCriteriaRatings || existingSub.iranCriteriaRatings,
        lastSavedAt: new Date().toISOString(),
        submittedAt: isFinalSubmit ? new Date().toISOString() : existingSub.submittedAt,
      };

      db.submissions[expert.id] = updatedSub;

      // Update expert status
      expert.status = isFinalSubmit ? 'submitted' : 'in_progress';
      expert.lastActive = new Date().toISOString();
      if (metadata?.expertName) expert.name = metadata.expertName;
      if (metadata?.organization) expert.organization = metadata.organization;
      if (metadata?.expertPosition) expert.position = metadata.expertPosition;

      saveDatabase(db);
      return res.json({ success: true, submission: updatedSub, expert });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در ذخیره‌سازی پاسخ‌های خبره' });
    }
  });

  // POST /api/session/seed-test-data - Populate realistic 15-expert panel test dataset
  app.post('/api/session/seed-test-data', (_req, res) => {
    try {
      const db = loadDatabase();
      const { experts, submissions } = generateTestExpertPanel();
      db.experts = experts;
      db.submissions = submissions;
      db.session.status = 'testing';
      db.session.auditTrail.push({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toISOString(),
        actor: 'پژوهشگر ارشد (حالت آزمون)',
        action: 'تولید داده‌های شبیه‌سازی‌شده',
        details: '۱۵ نمایه خبره واقع‌گرایانه با پاسخ‌های کامل، ماتریس‌های DEMATEL، اولویت‌های ANP و غربالگری دلفی فازی در پایگاه داده بارگذاری شد.',
      });

      saveDatabase(db);
      return res.json({ success: true, message: '۱۵ خبره شبیه‌سازی‌شده با موفقیت بارگذاری شدند.', expertCount: experts.length });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در بارگذاری داده‌های شبیه‌سازی' });
    }
  });

  // POST /api/session/reset-test-data - Clear test data safely
  app.post('/api/session/reset-test-data', (_req, res) => {
    try {
      const db = loadDatabase();
      db.experts = [];
      db.submissions = {};
      db.session.status = 'draft';
      db.session.auditTrail.push({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toISOString(),
        actor: 'پژوهشگر ارشد',
        action: 'پاک‌سازی داده‌های آزمون',
        details: 'پایگاه داده برای اجرای نشست رسمی زنده و ثبت پاسخ‌های واقعی خبرگان پاک‌سازی گردید.',
      });

      saveDatabase(db);
      return res.json({ success: true, message: 'پایگاه داده برای نشست واقعی بازنشانی شد.' });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در بازنشانی پایگاه داده' });
    }
  });

  // GET /api/session/aggregate-analytics - Compute comprehensive multi-expert analytics
  app.get('/api/session/aggregate-analytics', (_req, res) => {
    try {
      const db = loadDatabase();
      const analytics = computeAggregateAnalytics(db);
      return res.json({
        success: true,
        analytics,
        hasData: Boolean(analytics),
        session: db.session,
        project: db.project,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'خطا در محاسبه آمارهای تجمیعی' });
    }
  });

  // GET /api/health - Health check endpoint for reverse proxies and monitoring
  app.get('/api/health', (_req, res) => {
    return res.json({
      status: 'ok',
      service: 'fintech-expert-system',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
    });
  });

  // Setup Vite or static serving
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist'), { maxAge: '7d', etag: true }));
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Application server listening on port ${PORT}`);
  });
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
