import React from 'react';
import {
  X,
  UserCheck,
  Calendar,
  Briefcase,
  Building,
  Clock,
  FileText,
  GraduationCap,
  Award,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { InterviewMetadata, isMetadataComplete } from '../data/questionnaire';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: InterviewMetadata;
  onSave: (meta: InterviewMetadata) => void;
}

export const MetadataModal: React.FC<MetadataModalProps> = ({
  isOpen,
  onClose,
  metadata,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<InterviewMetadata>(metadata);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFormData(metadata);
    setErrorMessage(null);
  }, [metadata, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMetadataComplete(formData)) {
      setErrorMessage(
        'لطفاً تمامی فیلدهای الزامی (نام، سازمان، سمت، مدرک/رشته تحصیلی و سابقه فعالیت) را تکمیل فرمایید.'
      );
      return;
    }
    setErrorMessage(null);
    onSave(formData);
    onClose();
  };

  const isFormComplete = isMetadataComplete(formData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-300">
        {/* Header */}
        <div className="bg-[#0b192c] text-white px-6 py-4 flex items-center justify-between border-b-2 border-emerald-500">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-black text-sm md:text-base text-white">
              شناسنامه خبره و اطلاعات مصاحبه تخصصی
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Requirement Notice */}
        <div className="p-3.5 bg-amber-50/90 border-b border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-black text-amber-900 block">
              تکمیل مشخصات خبره الزامی است
            </span>
            <p className="text-[0.72rem] text-slate-700 leading-normal">
              جهت حفظ روایی و استناد علمی پژوهش، پاسخ به ۵ فیلد ستاره‌دار زیر الزامی بوده و تا تکمیل آنها، امکان دانلود فایل اکسل وجود نخواهد داشت.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs md:text-sm max-h-[70vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-800 font-bold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                نام و نام خانوادگی خبره:
                <span className="text-red-500 font-black">*</span>
              </span>
              <span className="text-[0.65rem] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">الزامی</span>
            </label>
            <input
              type="text"
              required
              value={formData.expertName}
              onChange={(e) => setFormData({ ...formData, expertName: e.target.value })}
              placeholder="مثال: دکتر علیرضا ... (مدیرعامل شرکت سبدگردان ...)"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 font-bold mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-600" />
                  نهاد / سازمان متبوع:
                  <span className="text-red-500 font-black">*</span>
                </span>
                <span className="text-[0.65rem] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">الزامی</span>
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="مثال: سازمان بورس / شرکت سبدگردان / بانک"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  سمت سازمانی / جایگاه حرفه‌ای:
                  <span className="text-red-500 font-black">*</span>
                </span>
                <span className="text-[0.65rem] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">الزامی</span>
              </label>
              <input
                type="text"
                required
                value={formData.expertPosition}
                onChange={(e) => setFormData({ ...formData, expertPosition: e.target.value })}
                placeholder="مثال: مدیر سرمایه‌گذاری / عضو هیئت‌مدیره / استاد دانشگاه"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 font-bold mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  رشته و مقطع تحصیلی:
                  <span className="text-red-500 font-black">*</span>
                </span>
                <span className="text-[0.65rem] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">الزامی</span>
              </label>
              <input
                type="text"
                required
                value={formData.educationField}
                onChange={(e) => setFormData({ ...formData, educationField: e.target.value })}
                placeholder="مثال: دکتری مدیریت مالی / ارشد هوش مصنوعی"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  سابقه فعالیت در بازار مالی/فین‌تک:
                  <span className="text-red-500 font-black">*</span>
                </span>
                <span className="text-[0.65rem] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">الزامی</span>
              </label>
              <input
                type="text"
                required
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                placeholder="مثال: ۱۵ سال سابقه تحلیل و سبدگردانی"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 font-bold mb-1 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                تاریخ جلسه:
              </label>
              <input
                type="text"
                value={formData.interviewDate}
                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                مدت زمان جلسه:
              </label>
              <input
                type="text"
                value={formData.interviewDuration}
                onChange={(e) => setFormData({ ...formData, interviewDuration: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              توضیحات و یادداشت‌های پژوهشگر (اختیاری):
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="نکات تکمیلی درباره جلسه یا حوزه تخصصی خبره..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <div className="flex items-center gap-1 text-[0.7rem]">
              {isFormComplete ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  مشخصات کامل است
                </span>
              ) : (
                <span className="text-amber-700 font-bold">
                  تکمیل تمام فیلدهای ستاره‌دار الزامی است
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md transition cursor-pointer"
              >
                ذخیره اطلاعات خبره
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

