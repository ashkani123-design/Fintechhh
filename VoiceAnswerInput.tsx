import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  Square,
  RotateCcw,
  CheckCircle2,
  Lock,
  RefreshCw,
  Sparkles,
  Infinity as InfinityIcon,
  Loader2,
  Volume2,
  Play,
  FileAudio,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { blobToBase64 } from '../utils/audioHelper';
import { normalizePersianSpeech } from '../utils/persianNormalizer';
import { AnswerState } from '../data/questionnaire';
import { apiPost } from '../config/apiConfig';

interface VoiceAnswerInputProps {
  questionId: string;
  questionTitle: string;
  questionText: string;
  contextText?: string;
  currentAnswer?: AnswerState;
  onUpdateAnswer: (answer: AnswerState) => void;
}

function getBestSupportedAudioMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return 'audio/webm';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/aac',
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return '';
}

export const VoiceAnswerInput: React.FC<VoiceAnswerInputProps> = ({
  questionId,
  questionTitle,
  questionText,
  contextText,
  currentAnswer,
  onUpdateAnswer,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  const [polishMessage, setPolishMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
    currentAnswer?.audioUrl || null
  );

  // Synchronous state ref for active recording
  const isRecordingRef = useRef(false);

  // Audio capture refs
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastRecordedBlobRef = useRef<Blob | null>(currentAnswer?.audioBlob || null);

  const textValue = currentAnswer?.refinedText || '';
  const textValueRef = useRef(textValue);
  textValueRef.current = textValue;

  // Auto-resize textarea to support completely unlimited length answers without cramped scrollbars
  const autoResizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.max(96, textareaRef.current.scrollHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, []);

  useEffect(() => {
    autoResizeTextarea();
  }, [textValue, autoResizeTextarea]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          // ignore
        }
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Format seconds to mm:ss or hh:mm:ss for extended long interviews
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m
        .toString()
        .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Audio visualizer setup
  const setupAudioVisualizer = (stream: MediaStream) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!isRecordingRef.current) {
          setAudioLevel(0);
          return;
        }
        analyser.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i];
        }
        const avg = sum / buffer.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        requestAnimationFrame(updateVolume);
      };
      requestAnimationFrame(updateVolume);
    } catch (e) {
      // visualizer is non-critical
    }
  };

  // 1. START COMPLETE AUDIO RECORDING
  const startRecording = async () => {
    setMicPermissionDenied(false);
    setTranscribeError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicPermissionDenied(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1, // Mono channel for voice cuts audio payload by 50%
          sampleRate: 24000, // Optimal speech sampling rate for fastest AI decoding
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = getBestSupportedAudioMimeType();
      const recorderOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 32000, // 32kbps compressed Opus: studio voice clarity + 4x faster upload!
      };
      if (mimeType) {
        recorderOptions.mimeType = mimeType;
      }

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, recorderOptions);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      isRecordingRef.current = true;
      setIsRecording(true);
      setRecordDuration(0);

      // Start volume visualizer
      setupAudioVisualizer(stream);

      // Collect data every 500ms
      recorder.start(500);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      isRecordingRef.current = false;
      setIsRecording(false);
      setMicPermissionDenied(true);
    }
  };

  // 2. Transcribe an Audio Blob completely via the server with ultra-fast latency
  const transcribeAudioBlob = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    setTranscribeError(null);
    const startTime = Date.now();

    try {
      const base64 = await blobToBase64(blob);

      const res = await apiPost('/transcribe-audio', {
        audioBase64: base64,
        mimeType: mimeType || 'audio/webm',
        questionTitle,
        questionText,
        context: contextText,
      }, { timeoutMs: 25000 });

      const data = res.data;
      const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

      if (res.ok && data?.text) {
        const normalized = normalizePersianSpeech(data.text.trim());
        const existing = textValueRef.current.trim();
        const combined = existing ? `${existing}\n\n${normalized}` : normalized;

        onUpdateAnswer({
          ...currentAnswer,
          rawTranscript: normalized,
          refinedText: combined,
          audioBlob: blob,
          updatedAt: new Date().toISOString(),
          isAiRefined: true,
        });

        setPolishMessage(`پاسخ با سرعت بالا و کیفیت عالی (${elapsedSeconds} ثانیه) پیاده‌سازی و درج شد.`);
        setTimeout(() => setPolishMessage(null), 4500);
      } else {
        const errMsg = data.error || 'خطا در استخراج متن از فایل صوتی.';
        setTranscribeError(errMsg);
      }
    } catch (err: any) {
      console.error('Transcription request failed:', err);
      setTranscribeError('خطای ارتباط با سرور. فایل صوتی ذخیره شد و می‌توانید دکمه تلاش مجدد را بزنید.');
    } finally {
      setIsTranscribing(false);
      setTimeout(autoResizeTextarea, 50);
    }
  };

  // 3. STOP RECORDING AND TRIGGER FULL TRANSCRIPTION
  const stopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') {
      recorder.onstop = () => {
        const chunks = audioChunksRef.current;
        const mimeType = recorder.mimeType || 'audio/webm';
        const fullAudioBlob = new Blob(chunks, { type: mimeType });
        lastRecordedBlobRef.current = fullAudioBlob;

        // Generate playable preview URL
        const audioUrl = URL.createObjectURL(fullAudioBlob);
        setRecordedAudioUrl(audioUrl);

        // Update answer state with the audio link
        onUpdateAnswer({
          ...currentAnswer,
          refinedText: textValueRef.current,
          audioUrl,
          audioBlob: fullAudioBlob,
          updatedAt: new Date().toISOString(),
        });

        // Release mic stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        if (audioContextRef.current) {
          try {
            audioContextRef.current.close();
          } catch (e) {
            // ignore
          }
          audioContextRef.current = null;
        }

        // Transcribe the entire audio file completely!
        if (fullAudioBlob.size > 2000) {
          transcribeAudioBlob(fullAudioBlob, mimeType);
        } else {
          setTranscribeError('طول فایل صوتی بسیار کوتاه بود.');
        }
      };

      try {
        recorder.stop();
      } catch (e) {
        console.warn('Error stopping recorder:', e);
      }
    }
  };

  // Re-transcribe previously recorded audio blob
  const handleRetryTranscribe = () => {
    if (lastRecordedBlobRef.current) {
      transcribeAudioBlob(
        lastRecordedBlobRef.current,
        lastRecordedBlobRef.current.type || 'audio/webm'
      );
    }
  };

  // Optional AI Polish of text
  const handleAiRefine = async () => {
    if (!textValue.trim() || isAiPolishing) return;

    setIsAiPolishing(true);
    setPolishMessage(null);

    try {
      const res = await apiPost('/ai-refine', {
        text: textValue,
        questionTitle,
        questionText,
        context: contextText,
      }, { timeoutMs: 25000 });

      if (res.ok && res.data?.refinedText) {
        const data = res.data;
        onUpdateAnswer({
          ...currentAnswer,
          refinedText: data.refinedText,
          updatedAt: new Date().toISOString(),
          isAiRefined: true,
        });
        setPolishMessage(
          data.quotaExceeded
            ? 'متن با موفقیت ثبت شد (سهمیه هوش مصنوعی به سقف رسید، متن دست‌نخورده حفظ گردید).'
            : 'متن با هوش مصنوعی پالایش و ویرایش شد.'
        );
        setTimeout(() => setPolishMessage(null), 4000);
      }
    } catch (err) {
      console.warn('AI Refine request failed:', err);
    } finally {
      setIsAiPolishing(false);
      setTimeout(autoResizeTextarea, 50);
    }
  };

  // Handle manual textarea change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateAnswer({
      ...currentAnswer,
      refinedText: e.target.value,
      updatedAt: new Date().toISOString(),
    });
    autoResizeTextarea();
  };

  const wordCount = textValue.trim() ? textValue.trim().split(/\s+/).length : 0;
  const charCount = textValue.length;

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/80">
      {/* Control Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        {/* Record & Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              disabled={isTranscribing}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0a192f] hover:bg-[#172a45] text-[#c5a880] text-xs font-bold transition shadow-sm hover:shadow active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Mic className="w-4 h-4 text-[#c5a880]" />
              <span>ضبط صدا (تبدیل فوق‌سریع و با کیفیت بالا)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black transition animate-pulse shadow-md cursor-pointer"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>پایان ضبط و استخراج سریع متن ({formatTime(recordDuration)})</span>
            </button>
          )}

          {/* Optional AI Polish Button */}
          {textValue.trim() && !isRecording && !isTranscribing && (
            <button
              type="button"
              onClick={handleAiRefine}
              disabled={isAiPolishing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c5a880]/15 hover:bg-[#c5a880]/25 text-[#0a192f] border border-[#c5a880]/40 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              title="پالایش و ویرایش اصطلاحات تخصصی و نگارشی با هوش مصنوعی"
            >
              {isAiPolishing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0a192f]" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
              )}
              <span>{isAiPolishing ? 'در حال پالایش...' : 'پالایش با هوش مصنوعی'}</span>
            </button>
          )}
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 text-[0.7rem]">
          <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
            <InfinityIcon className="w-3 h-3 text-[#c5a880]" />
            طول پاسخ: کاملاً نامحدود
          </span>

          {polishMessage && (
            <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold animate-in fade-in">
              {polishMessage}
            </span>
          )}

          {textValue.trim() && !polishMessage && !isTranscribing && (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              متن ثبت‌شده
            </span>
          )}
        </div>
      </div>

      {/* Microphone permission denied banner */}
      {micPermissionDenied && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>مجوز میکروفن در مرورگر صادر نشده است</span>
          </div>
          <p className="text-[0.75rem] leading-relaxed text-amber-900 text-justify">
            برای فعال‌سازی ضبط زنده: روی علامت <strong>قفل (🔒)</strong> یا آیکون تنظیمات در کنار آدرس سایت در بالای مرورگر کلیک کنید و دسترسی <strong>Microphone</strong> را روی <strong>Allow (مجاز)</strong> بگذارید.
          </p>
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[0.7rem] cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>تلاش مجدد برای اتصال میکروفن</span>
            </button>
          </div>
        </div>
      )}

      {/* Live recording active indicator bar with Real-time Sound Wave Meter */}
      {isRecording && (
        <div className="mb-2 p-2.5 bg-red-50/95 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-900 shadow-xs">
          <div className="flex items-center gap-2.5 font-bold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span>در حال ضبط کامل صوت... (بدون محدودیت زمانی)</span>
            <span className="font-mono text-red-700 font-extrabold mr-1 bg-red-100 px-1.5 py-0.5 rounded">
              {formatTime(recordDuration)}
            </span>

            {/* Dynamic Sound Wave Volume Meter */}
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-red-200">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div className="flex items-end gap-0.5 h-3 w-16">
                {[20, 45, 75, 55, 90, 60, 30].map((h, i) => {
                  const activeHeight = Math.max(
                    15,
                    Math.min(100, audioLevel * (i % 2 === 0 ? 1.2 : 0.8) + h * 0.2)
                  );
                  return (
                    <div
                      key={i}
                      style={{ height: `${activeHeight}%` }}
                      className={`w-1 rounded-xs transition-all duration-75 ${
                        audioLevel > 10 ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <span className="text-[0.7rem] text-red-700 font-medium">
            (با زدن دکمه پایان ضبط، کل صحبت به صورت یکپارچه به متن پیاده‌سازی می‌شود)
          </span>
        </div>
      )}

      {/* Transcription In Progress Banner */}
      {isTranscribing && (
        <div className="mb-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between gap-2 text-xs text-indigo-900 font-bold animate-pulse">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-500 animate-bounce shrink-0" />
            <div>
              <span className="flex items-center gap-1.5">
                <span>در حال تبدیل فوق‌سریع صوت به متن با هوش مصنوعی...</span>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              </span>
              <span className="block text-[0.7rem] font-normal text-indigo-700 mt-0.5">
                پردازش با مدل کم‌تاخیر و استخراج بدون فوت وقت متن دقیق فارسی
              </span>
            </div>
          </div>
          <span className="text-[0.7rem] text-indigo-600 bg-white px-2 py-1 rounded border border-indigo-200 shrink-0">
            پردازش پرسرعت...
          </span>
        </div>
      )}

      {/* Transcription Error Banner with Retry */}
      {transcribeError && (
        <div className="mb-2 p-2.5 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-between gap-2 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{transcribeError}</span>
          </div>
          {lastRecordedBlobRef.current && (
            <button
              type="button"
              onClick={handleRetryTranscribe}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[0.7rem] cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>تلاش مجدد برای استخراج متن</span>
            </button>
          )}
        </div>
      )}

      {/* Embedded Player for Recorded Audio */}
      {recordedAudioUrl && !isRecording && (
        <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <FileAudio className="w-4 h-4 text-[#c5a880]" />
            <span>صوت ضبط‌شده این پاسخ:</span>
          </div>
          <audio controls src={recordedAudioUrl} className="h-7 max-w-xs" />
        </div>
      )}

      {/* Answer Textarea with Dynamic Auto-expansion */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          dir="rtl"
          value={textValue}
          onChange={handleTextChange}
          placeholder="پاسخ را اینجا تایپ کنید یا دکمه ضبط صدا را بزنید تا کل پاسخ به صورت صوتی ضبط و پس از پایان، به طور کامل به متن تبدیل شود..."
          rows={3}
          style={{ minHeight: '96px' }}
          className={`w-full text-xs md:text-[0.85rem] leading-relaxed p-3 bg-white border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0a192f] focus:border-transparent text-slate-800 placeholder:text-slate-400 transition resize-y ${
            isRecording ? 'border-red-400 ring-2 ring-red-200 bg-red-50/10' : 'border-slate-300'
          }`}
        />

        {/* Bottom toolbar inside textarea container */}
        <div className="flex flex-wrap items-center justify-between text-[0.68rem] text-slate-500 mt-1.5 px-1 gap-2">
          <div className="flex items-center gap-3">
            <span className="font-medium">
              تعداد واژگان: <strong className="text-slate-700">{wordCount}</strong> کلمه
              <span className="text-slate-400 mx-1">({charCount} نویسه)</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <InfinityIcon className="w-3 h-3" />
              حجم پاسخ: کاملاً نامحدود
            </span>
            {currentAnswer?.updatedAt && (
              <>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400">
                  آخرین ثبت: {new Date(currentAnswer.updatedAt).toLocaleTimeString('fa-IR')}
                </span>
              </>
            )}
          </div>

          {textValue && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('آیا از پاک کردن متن پاسخ این پرسش مطمئن هستید؟')) {
                  onUpdateAnswer({
                    ...currentAnswer,
                    refinedText: '',
                    rawTranscript: '',
                    updatedAt: new Date().toISOString(),
                  });
                  setTimeout(autoResizeTextarea, 50);
                }
              }}
              className="text-slate-400 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>پاک‌کردن متن</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
