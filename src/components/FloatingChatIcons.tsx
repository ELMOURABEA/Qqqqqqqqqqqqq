import React, { useState } from 'react';
import { MessageSquare, PhoneCall, Upload, X, ChevronUp, Sparkles } from 'lucide-react';

interface FloatingChatIconsProps {
  onOpenChat: () => void;
  onOpenPrescription: () => void;
}

export const FloatingChatIcons: React.FC<FloatingChatIconsProps> = ({
  onOpenChat,
  onOpenPrescription
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="hidden md:flex fixed bottom-6 left-6 z-40 flex-col items-start gap-2.5 select-none" dir="rtl">
      {/* Sub-actions when expanded */}
      {isExpanded && (
        <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-3 duration-200">
          
          {/* 1. Direct Phone Call to Hotline */}
          <a
            href="tel:01200400094"
            className="flex items-center gap-2.5 bg-white text-slate-800 hover:text-red-700 px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/80 hover:shadow-2xl transition hover:-translate-y-0.5 group"
            title="اتصال فوري بالخط الساخن 01200400094"
          >
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition">
              <PhoneCall className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-black text-slate-900 block leading-tight">اتصل بالصيدلية</span>
              <span className="text-[10px] text-red-600 font-mono font-bold">01200400094</span>
            </div>
          </a>

          {/* 2. Direct WhatsApp to Hotline 01200400094 */}
          <a
            href="https://wa.me/201200400094?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%B5%D9%8A%D8%AF%D9%84%D9%8A%D8%A7%D8%AA%20%D8%A7%D9%84%D8%A8%D9%86%D8%AF%D8%A7%D8%B1%D9%8A%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D8%B5%D9%8A%D8%AF%D9%84%D8%A7%D9%86%D9%8A%D8%A9%20%D9%88%D8%B7%D9%84%D8%A8%20%D8%AF%D9%88%D8%A7%D8%A1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-white text-slate-800 hover:text-emerald-700 px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/80 hover:shadow-2xl transition hover:-translate-y-0.5 group"
            title="محادثة واتساب مباشرة مع الصيدلي"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-110 transition">
              💬
            </div>
            <div className="text-right">
              <span className="text-[11px] font-black text-slate-900 block leading-tight">واتساب الصيدلية</span>
              <span className="text-[10px] text-emerald-600 font-bold">استجابة فورية</span>
            </div>
          </a>

          {/* 3. Fast Prescription Upload */}
          <button
            onClick={onOpenPrescription}
            className="flex items-center gap-2.5 bg-white text-slate-800 hover:text-bendary-700 px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/80 hover:shadow-2xl transition hover:-translate-y-0.5 group"
            title="رفع روشتة سريعة"
          >
            <div className="w-8 h-8 rounded-xl bg-bendary-50 text-bendary-600 flex items-center justify-center group-hover:scale-110 transition">
              <Upload className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-black text-slate-900 block leading-tight">اطلب بروشتة</span>
              <span className="text-[10px] text-slate-500 font-medium">تصوير فوري</span>
            </div>
          </button>
        </div>
      )}

      {/* Main Floating Chat Trigger with Toggle */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenChat}
          className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-3 px-4 rounded-full shadow-2xl flex items-center gap-2.5 border-2 border-white hover:scale-105 active:scale-95 transition group"
          title="استشارة صيدلي البنداري - شات مباشر"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </span>
          </div>

          <div className="text-right">
            <div className="text-xs font-black leading-none flex items-center gap-1">
              <span>استشارة صيدلي البنداري</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <span className="text-[10px] text-emerald-100 font-light block mt-0.5">
              د. مصطفى المرابعة (متصل الآن 24/7)
            </span>
          </div>
        </button>

        {/* Mini expand/collapse trigger button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 shadow-md border border-slate-200 flex items-center justify-center transition text-xs"
          title={isExpanded ? 'إخفاء الخيارات السريعة' : 'إظهار خيارات الاتصال والواتساب'}
        >
          {isExpanded ? <X className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
