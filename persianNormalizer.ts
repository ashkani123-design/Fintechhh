/**
 * Real-time Persian speech-to-text normalizer
 * Instantly corrects colloquial speech-to-text slips, technical FinTech terms,
 * half-spaces (نیم‌فاصله) and numbers as the user speaks.
 */
export function normalizePersianSpeech(text: string): string {
  if (!text) return '';

  let res = text;

  // 1. FinTech, Robo-Advisory, and Financial Specialized Terminology
  res = res.replace(/روبو\s*ادوایزر(ها)?/g, 'روبوادوایزر$1');
  res = res.replace(/روبو\s*ادوایزری/g, 'روبوادوایزری');
  res = res.replace(/روبوت\s*ادوایزر/g, 'روبوادوایزر');
  res = res.replace(/فین\s*تک/g, 'فین‌تک');
  res = res.replace(/ولت\s*تک/g, 'ولث‌تک');
  res = res.replace(/رگ\s*تک/g, 'رگ‌تک');
  res = res.replace(/ای\s*آی\s*تی\s*ال|ای‌آی‌تی‌ال/gi, 'AITL');
  res = res.replace(/ای\s*آی\s*ار\s*ای\s*ال|ای‌آی‌آر‌ای‌ال/gi, 'AIRAL');
  res = res.replace(/ام\s*آی\s*اف\s*آی\s*دی|میفید/gi, 'MiFID II');
  res = res.replace(/وی\s*سی(ها)?|وی‌سی(ها)?/g, 'VC$1');
  res = res.replace(/سی\s*وی\s*سی/g, 'CVC');
  res = res.replace(/ای\s*تی\s*اف(ها)?|ای‌تی‌اف(ها)?/g, 'ETF$1');
  res = res.replace(/سبد\s*گردان(ی|ان)?/g, 'سبدگردان$1');
  res = res.replace(/باز\s*واسطه\s*گری/g, 'باز-واسطه‌گری');
  res = res.replace(/حذف\s*واسطه/g, 'حذف واسطه');
  res = res.replace(/سند\s*باکس/g, 'سندباکس');
  res = res.replace(/سهام\s*عدالت/g, 'سهام عدالت');
  res = res.replace(/سازمان\s*بورس/g, 'سازمان بورس');
  res = res.replace(/بانک\s*مرکزی/g, 'بانک مرکزی');
  res = res.replace(/شاخص\s*شارپ/g, 'شاخص شارپ');

  // 2. Common compound Persian finance & policy terms with half-space
  res = res.replace(/سرمایه\s*گذار(ی|ان)?/g, 'سرمایه‌گذار$1');
  res = res.replace(/سیاست\s*گذار(ی|ان)?/g, 'سیاست‌گذار$1');
  res = res.replace(/تصمیم\s*گیر(ی|ان)?/g, 'تصمیم‌گیر$1');
  res = res.replace(/برنامه\s*ریز(ی|ان)?/g, 'برنامه‌ریز$1');
  res = res.replace(/ریسک\s*پذیر(ی)?/g, 'ریسک‌پذیر$1');
  res = res.replace(/ریسک\s*گریز(ی)?/g, 'ریسک‌گریز$1');
  res = res.replace(/انطباق\s*پذیر(ی)?/g, 'انطباق‌پذیر$1');
  res = res.replace(/اعتبار\s*سنج(ی)?/g, 'اعتبارسنجی');
  res = res.replace(/شخصی\s*ساز(ی)?/g, 'شخصی‌سازی');
  res = res.replace(/مقیاس\s*پذیر(ی)?/g, 'مقیاس‌پذیری');

  // 3. Persian verbal prefixes (می / نمی) with half-space \u200c
  res = res.replace(/\b(می|نمی)\s+([آ-ی])/g, '$1\u200c$2');

  // 4. Persian plural and comparative suffixes with half-space
  res = res.replace(/([آ-ی])\s+(ها|های|هایم|هایت|هایش|هایمان|هایتان|هایشان)\b/g, '$1\u200c$2');
  res = res.replace(/([آ-ی])\s+(تر|ترین)\b/g, '$1\u200c$2');
  res = res.replace(/([آ-ی])\s+(ای|ایم|اید|اند)\b/g, '$1\u200c$2');

  // 5. Clean multiple spaces
  res = res.replace(/[ ]{2,}/g, ' ');

  return res.trim();
}
