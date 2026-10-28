import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, PhoneCall, Zap, ShieldAlert, Sparkles, CheckCircle2, 
  ArrowLeft, Heart, Play, Pause, ChevronRight, ChevronLeft,
  Tv, Tag, ShoppingBag, Eye, Flame
} from 'lucide-react';
import { CAMPAIGN_ADS, CampaignAd } from '../data/campaignAds';

interface HeroBannerProps {
  onOpenPrescription: () => void;
  onOpenChat: () => void;
  onQuickOrderSent: (message: string) => void;
  onSelectCampaignOffer?: (ad: CampaignAd) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenPrescription,
  onOpenChat,
  onQuickOrderSent,
  onSelectCampaignOffer
}) => {
  // Quick order state
  const [quickInput, setQuickInput] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Billboard Ad Carousel State (3 seconds autoplay)
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedAdForModal, setSelectedAdForModal] = useState<CampaignAd | null>(null);
  const [progress, setProgress] = useState(0);

  // Touch swipe support for iOS & Android
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const activeAd = CAMPAIGN_ADS[currentAdIndex];

  // 3-second interval timer for auto-rotating the billboard images
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    // Reset progress on slide change
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / 30, 100)); // 30 ticks of 100ms = 3000ms
    }, 100);

    const slideTimer = setTimeout(() => {
      setCurrentAdIndex((prev) => (prev + 1) % CAMPAIGN_ADS.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(slideTimer);
    };
  }, [currentAdIndex, isPlaying, isHovered]);

  const handleNextAd = () => {
    setProgress(0);
    setCurrentAdIndex((prev) => (prev + 1) % CAMPAIGN_ADS.length);
  };

  const handlePrevAd = () => {
    setProgress(0);
    setCurrentAdIndex((prev) => (prev - 1 + CAMPAIGN_ADS.length) % CAMPAIGN_ADS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      // Swiped left in RTL = Next ad
      handleNextAd();
    } else if (distance < -40) {
      // Swiped right in RTL = Prev ad
      handlePrevAd();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

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

  const handleOrderAd = (ad: CampaignAd) => {
    if (onSelectCampaignOffer) {
      onSelectCampaignOffer(ad);
    } else {
      onQuickOrderSent(`أود الاستفادة من عرض الحملة: ${ad.title} (${ad.badge}) من صيدليات البنداري - الخط الساخن 01200400094`);
    }
  };

  return (
    <section className="bg-gradient-to-b from-bendary-950 via-bendary-900 to-slate-900 text-white pt-4 pb-8 sm:pt-8 sm:pb-12 px-3 sm:px-4 relative overflow-hidden shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-red-600/25 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        
        {/* Top Row: Mission Statement & Quick hotline */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-3 text-center lg:text-right max-w-2xl w-full">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-[11px] sm:text-xs font-black px-3 sm:px-4 py-1.5 rounded-full border border-white/20 shadow-sm max-w-full">
              <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400 animate-pulse shrink-0" />
              <span className="truncate">رعاية من القلب - 46 سنة • صيدليات البنداري منذ 1980</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight">
              طلب دوائك واستشارتك الطبية <br />
              <span className="text-amber-300">أسرع وأدق من أي وقت مضى</span>
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl font-light mx-auto lg:mx-0">
              تصفح أكثر من 22,000 دواء ومستحضر تجميلي مرخص مع خدمة توصيل فورية خلال 30-45 دقيقة من فروعنا الـ 11، واستشارات صيدلانية إكلينيكية مباشرة مع <strong className="font-bold underline decoration-amber-400 decoration-2">صيدلي البنداري المناوب</strong> على مدار 24 ساعة.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-2.5 justify-center lg:justify-start pt-1 w-full">
              <button
                onClick={onOpenPrescription}
                className="w-full sm:w-auto bg-white text-bendary-950 font-black px-5 py-2.5 rounded-xl shadow-xl hover:bg-slate-100 transition flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm"
              >
                <Upload className="w-4 h-4 text-bendary-600" />
                <span>اطلب بروشتة فورية</span>
              </button>

              <button
                onClick={onOpenChat}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg border border-emerald-400/40 transition flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>استشارة صيدلي البنداري 24 ساعة</span>
              </button>

              <a
                href="tel:01200400094"
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <PhoneCall className="w-4 h-4 text-slate-900" />
                <span className="font-mono dir-ltr">01200400094</span>
              </a>
            </div>
          </div>

          {/* Quick Hotline / Direct Order Widget */}
          <div className="w-full lg:w-80 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-2xl text-center">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h3 className="text-sm font-black text-white">الطلب السريع بالهاتف (دقيقتين)</h3>
            </div>
            <p className="text-[11px] text-slate-300 mb-3 font-light">
              اكتب اسم الدواء وسيتصل بك الصيدلي فوراً
            </p>

            {submitted ? (
              <div className="bg-emerald-500/25 border border-emerald-400 text-emerald-100 p-3 rounded-xl animate-in zoom-in-95 text-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-300 mx-auto mb-1" />
                <p className="font-bold text-xs">تم استلام طلبك بنجاح!</p>
                <p className="text-[10px] mt-0.5">يقوم الصيدلي بمراجعة طلبك والاتصال بك الآن.</p>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="space-y-2 text-right">
                <input
                  type="text"
                  placeholder="اسم الدواء أو المنتج المطلوب..."
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-bendary-500 shadow-inner"
                />
                <input
                  type="tel"
                  placeholder="رقم هاتفك المحمول (مثال: 01200400094)..."
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-bendary-500 shadow-inner"
                />
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-2.5 px-3 rounded-xl transition shadow-lg flex items-center justify-center gap-1.5 active:scale-95 text-xs"
                >
                  <span>إرسال للصيدلي فوراً</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* =========================================================================
            DIGITAL AD BILLBOARD SCREEN (شاشة عرض الإعلانات الرقمية - تقلب كل 3 ثواني)
            ========================================================================= */}
        <div className="pt-2">
          {/* Billboard Frame Top Bar */}
          <div className="bg-slate-950/90 border border-slate-700/80 rounded-t-3xl p-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-bendary-600 to-amber-500 flex items-center justify-center shadow-md">
                <Tv className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-white">شاشة عروض صيدليات البنداري الرقمية</span>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-300" />
                    تقلب تلقائياً كل 3 ثواني
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">عروض حصرية احتفالاً بـ 46 سنة رعاية من القلب • الخط الساخن: 01200400094</p>
              </div>
            </div>

            {/* Screen Controls */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="bg-white/10 px-2.5 py-1 rounded-lg text-amber-300 font-bold">
                {String(currentAdIndex + 1).padStart(2, '0')} / {String(CAMPAIGN_ADS.length).padStart(2, '0')}
              </span>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل العرض التلقائي'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-300" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevAd}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                  title="الإعلان السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextAd}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                  title="الإعلان التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3-Second Countdown Progress Bar */}
          <div className="w-full bg-slate-800 h-1 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-bendary-500 transition-all duration-100 ease-linear"
              style={{ width: `${isPlaying && !isHovered ? progress : 100}%` }}
            ></div>
          </div>

          {/* Main Display Screen Container */}
          <div 
            className="bg-black/95 border-x border-b border-slate-700/80 rounded-b-3xl overflow-hidden shadow-2xl relative group select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Visual Screen Bezel / Ambient Corner Lights */}
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{isPlaying ? 'بث العروض مباشر (3 ثوانٍ)' : 'متوقف مؤقتاً'}</span>
            </div>

            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={() => setSelectedAdForModal(activeAd)}
                className="bg-black/70 hover:bg-black/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 transition"
              >
                <Eye className="w-3 h-3 text-cyan-300" />
                <span>تكبير الإعلان</span>
              </button>
            </div>

            {/* Split Screen Layout: Left Ad Visual + Right Offer Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px] sm:min-h-[420px] items-stretch">
              
              {/* Ad Image Canvas (Left / Main Visual) */}
              <div 
                className="md:col-span-7 lg:col-span-8 relative bg-slate-950 flex items-center justify-center overflow-hidden p-2 sm:p-4 cursor-pointer"
                onClick={() => handleOrderAd(activeAd)}
              >
                {/* Floating Navigation Arrows directly on Image Canvas */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevAd();
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition active:scale-90 shadow-xl opacity-80 sm:opacity-0 group-hover:opacity-100"
                  aria-label="الإعلان السابق"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextAd();
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition active:scale-90 shadow-xl opacity-80 sm:opacity-0 group-hover:opacity-100"
                  aria-label="الإعلان التالي"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>

                <img
                  key={activeAd.id}
                  src={activeAd.image}
                  alt={activeAd.title}
                  className="max-h-[360px] sm:max-h-[440px] w-auto max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
                />

                {/* Offer floating badge on image */}
                <div className="absolute bottom-4 right-4 z-10 bg-bendary-950/85 backdrop-blur-md text-white border border-bendary-500/40 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-xs font-black text-amber-300">{activeAd.badge}</span>
                </div>
              </div>

              {/* Offer Info & Action Sidebar (Right Column) */}
              <div className="md:col-span-5 lg:col-span-4 bg-gradient-to-b from-slate-900 to-bendary-950 p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-r border-slate-800 text-right">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`${activeAd.badgeColor} text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm`}>
                      {activeAd.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-300 font-mono">
                      ماركة: {activeAd.brand}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {activeAd.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {activeAd.subtitle}
                  </p>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-[11px] text-slate-200">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>متوفر حالياً بجميع فروع صيدليات البنداري الـ 11</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 font-bold">
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span>توصيل فوري خلال 30-45 دقيقة</span>
                    </div>
                    <div className="text-slate-400 text-[10px] pt-1 border-t border-white/10">
                      {activeAd.tagline}
                    </div>
                  </div>
                </div>

                {/* Call to Actions for this specific Ad */}
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => handleOrderAd(activeAd)}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-3 px-4 rounded-xl shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95 transition"
                  >
                    <ShoppingBag className="w-4 h-4 text-slate-950" />
                    <span>{activeAd.ctaText}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <a
                      href="tel:01200400094"
                      className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-center"
                    >
                      <PhoneCall className="w-3 h-3 text-amber-300" />
                      <span>اتصل: 01200400094</span>
                    </a>
                    <button
                      onClick={onOpenChat}
                      className="bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-center"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-200" />
                      <span>استشر الصيدلي</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Thumbnail Strip / Navigation Dots (Bottom of Billboard) */}
            <div className="bg-slate-950 border-t border-slate-800 p-2.5 px-4 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {CAMPAIGN_ADS.map((ad, idx) => (
                  <button
                    key={ad.id}
                    onClick={() => {
                      setProgress(0);
                      setCurrentAdIndex(idx);
                    }}
                    className={`relative rounded-lg overflow-hidden border transition-all shrink-0 ${
                      currentAdIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/40 w-12 h-9 scale-105'
                        : 'border-slate-700 opacity-50 hover:opacity-100 w-9 h-7'
                    }`}
                    title={ad.title}
                  >
                    <img src={ad.image} alt={ad.brand} className="w-full h-full object-cover" />
                    {currentAdIndex === idx && (
                      <div className="absolute inset-0 bg-amber-400/20"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 whitespace-nowrap hidden sm:block font-bold">
                عرض {currentAdIndex + 1} من {CAMPAIGN_ADS.length} حملة إعلانية
              </div>
            </div>

          </div>
        </div>

        {/* Value Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs text-slate-200">
          <div className="flex items-center gap-2 bg-black/25 p-2.5 rounded-xl backdrop-blur-sm border border-white/10">
            <Zap className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="font-bold">توصيل 30-45 دقيقة</span>
          </div>
          <div className="flex items-center gap-2 bg-black/25 p-2.5 rounded-xl backdrop-blur-sm border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">أدوية أصلية 100%</span>
          </div>
          <div className="flex items-center gap-2 bg-black/25 p-2.5 rounded-xl backdrop-blur-sm border border-white/10">
            <PhoneCall className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="font-bold">الخط: 01200400094</span>
          </div>
          <div className="flex items-center gap-2 bg-black/25 p-2.5 rounded-xl backdrop-blur-sm border border-white/10">
            <ShieldAlert className="w-4 h-4 text-cyan-300 shrink-0" />
            <span className="font-bold">11 فرع معتمد</span>
          </div>
        </div>

      </div>

      {/* Full-view Modal for single Ad */}
      {selectedAdForModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 text-right relative shadow-2xl">
            <button
              onClick={() => setSelectedAdForModal(null)}
              className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className={`${selectedAdForModal.badgeColor} text-white text-xs font-black px-3 py-1 rounded-full`}>
                {selectedAdForModal.badge}
              </span>
              <h3 className="text-lg font-black text-white">{selectedAdForModal.title}</h3>
            </div>

            <div className="bg-black rounded-2xl p-2 mb-4 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selectedAdForModal.image}
                alt={selectedAdForModal.title}
                className="max-h-[55vh] w-auto object-contain rounded-xl"
              />
            </div>

            <p className="text-xs text-slate-300 mb-4">{selectedAdForModal.subtitle}</p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleOrderAd(selectedAdForModal);
                  setSelectedAdForModal(null);
                }}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>طلب هذا العرض الآن</span>
              </button>
              <a
                href="tel:01200400094"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span className="font-mono">01200400094</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
