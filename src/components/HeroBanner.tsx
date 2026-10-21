import React, { useState } from 'react';
import { Upload, PhoneCall, Zap, ShieldAlert, Sparkles, CheckCircle2, ArrowLeft, Heart } from 'lucide-react';

interface HeroBannerProps {
  onOpenPrescription: () => void;
  onOpenChat: () => void;
  onQuickOrderSent: (message: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenPrescription,
  onOpenChat,
  onQuickOrderSent
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput && !quickPhone) return;
    setSubmitted(true);
    onQuickOrderSent(`طلب سريع بالهاتف: ${quickInput || 'طلب صيدلاني'} - رقم الهاتف: ${quickPhone}`);
    setTimeout(() => {
      setSubmitted(false);
      setQuickInput('');
      setQuickPhone('');
    }, 4000);
  };

  return (
    <section className="bg-gradient-to-r from-bendary-950 via-bendary-800 to-red-700 text-white py-10 md:py-14 px-4 relative overflow-hidden shadow-md">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-500/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-bendary-500/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-8">
        
        {/* Left Column: Branding, Mission & CTAs */}
        <div className="space-y-4 max-w-2xl text-center lg:text-right">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs font-black px-4 py-1.5 rounded-full border border-white/20">
            <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400 animate-pulse" />
            <span>رعاية من القلب - 46 سنة • صيدليات البنداري منذ 1980</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            طلب دوائك واستشارتك الطبية <br />
            <span className="text-amber-300">أسرع وأدق من أي وقت مضى</span>
          </h2>

          <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-xl font-light">
            تصفح أكثر من 22,000 دواء ومستحضر تجميلي مرخص مع خدمة توصيل فورية خلال 30-45 دقيقة من فروعنا الـ 11، واستشارات صيدلانية إكلينيكية مباشرة مع <strong className="font-bold underline decoration-amber-400 decoration-2">صيدلي البنداري المناوب</strong> على مدار 24 ساعة.
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
            <button
              onClick={onOpenPrescription}
              className="bg-white text-bendary-900 font-extrabold px-6 py-3.5 rounded-2xl shadow-xl hover:bg-slate-100 transition flex items-center gap-2 active:scale-95 group text-sm"
            >
              <Upload className="w-5 h-5 text-bendary-600 group-hover:-translate-y-0.5 transition" />
              <span>اطلب بروشتة فورية الآن</span>
            </button>

            <button
              onClick={onOpenChat}
              className="bg-emerald-600/95 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg border border-emerald-400/40 transition flex items-center gap-2 active:scale-95 text-sm"
            >
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span>استشارة صيدلي البنداري 24 ساعة</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 text-xs text-slate-200">
            <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl backdrop-blur-sm">
              <Zap className="w-4 h-4 text-amber-300 shrink-0" />
              <span>توصيل 30-45 دقيقة</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>أدوية أصلية 100%</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl backdrop-blur-sm">
              <PhoneCall className="w-4 h-4 text-amber-300 shrink-0" />
              <span>الخط: 01200400094</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl backdrop-blur-sm">
              <ShieldAlert className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>11 فرع معتمد</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Hotline / Direct Order Widget */}
        <div className="w-full lg:w-96 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <h3 className="text-lg font-black text-white">خدمة الطلب السريع بالهاتف</h3>
          </div>
          <p className="text-xs text-slate-200 mb-4 font-light">
            اكتب اسم الدواء ورقم هاتفك وسيقوم صيدلي البنداري بالاتصال بك خلال دقيقتين لتأكيد الطلب
          </p>

          {submitted ? (
            <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-100 p-4 rounded-2xl animate-in zoom-in-95 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
              <p className="font-bold text-sm">تم استلام طلبك بنجاح!</p>
              <p className="mt-1">يقوم الصيدلي بمراجعة الطلب والاتصال بك الآن على الرقم المسجل.</p>
            </div>
          ) : (
            <form onSubmit={handleQuickSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="اسم الدواء أو المستحضر المطلوب..."
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-white text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-bendary-500 shadow-inner"
              />
              <input
                type="tel"
                placeholder="رقم هاتفك المحمول (مثل: 01200400094)..."
                value={quickPhone}
                onChange={(e) => setQuickPhone(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-white text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-bendary-500 shadow-inner"
              />
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-3 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <span>إرسال للصيدلي فوراً</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="text-[11px] text-slate-300 flex items-center justify-center gap-1.5 pt-1">
                <span>أو اتصل مباشرة بالخط الساخن</span>
                <a href="tel:01200400094" className="font-bold underline text-amber-300 font-mono">01200400094</a>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
