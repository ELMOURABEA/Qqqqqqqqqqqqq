import React, { useState } from 'react';
import { 
  Sparkles, Tag, ShoppingBag, Eye, PhoneCall, CheckCircle2, 
  ChevronLeft, ChevronRight, X, Flame, Search
} from 'lucide-react';
import { CAMPAIGN_ADS, CampaignAd } from '../data/campaignAds';

interface CampaignAdsGalleryProps {
  onSelectOffer: (ad: CampaignAd) => void;
  onOpenChat: () => void;
}

export const CampaignAdsGallery: React.FC<CampaignAdsGalleryProps> = ({
  onSelectOffer,
  onOpenChat
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewAd, setPreviewAd] = useState<CampaignAd | null>(null);
  const [search, setSearch] = useState('');

  const filteredAds = CAMPAIGN_ADS.filter(ad => {
    const matchesSearch = 
      ad.title.includes(search) || 
      ad.brand.toLowerCase().includes(search.toLowerCase()) ||
      ad.subtitle.includes(search) ||
      ad.badge.includes(search);

    if (!matchesSearch) return false;

    if (selectedCategory !== 'all') {
      return ad.category === selectedCategory;
    }

    return true;
  });

  return (
    <section className="bg-slate-900 text-white py-12 px-4 rounded-3xl my-8 border border-slate-800 shadow-2xl relative overflow-hidden" dir="rtl">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-bendary-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-amber-400/30 mb-2">
              <Flame className="w-3.5 h-3.5 fill-amber-300" />
              <span>الحملات الإعلانية الحصرية الرسمية • {CAMPAIGN_ADS.length} عرض معتمد</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              كتالوج عروض صيدليات البنداري الرسمية (46 سنة رعاية من القلب)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              عروض وخصومات حصرية (1+1 مجاناً، Buy 2 Get 1 Free، وخصومات حتى 70%) متوفرة بجميع الفروع الـ 11
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:01200400094"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
            >
              <PhoneCall className="w-4 h-4 text-slate-900" />
              <span>الخط الساخن: 01200400094</span>
            </a>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-bendary-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              جميع العروض ({CAMPAIGN_ADS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('bluebell')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'bluebell'
                  ? 'bg-bendary-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              باقة Bluebell الطبية
            </button>
            <button
              onClick={() => setSelectedCategory('hair')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'hair'
                  ? 'bg-bendary-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              العناية بالشعر والتساقط
            </button>
            <button
              onClick={() => setSelectedCategory('skin')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'skin'
                  ? 'bg-bendary-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              البشرة والعناية الطبية
            </button>
            <button
              onClick={() => setSelectedCategory('suncare')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'suncare'
                  ? 'bg-bendary-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              الحماية من الشمس (Vacation / Melatime)
            </button>
            <button
              onClick={() => setSelectedCategory('body_care')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'body_care'
                  ? 'bg-bendary-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              العناية بالجسم والمكملات
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث في العروض والماركات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-amber-400/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div 
                className="relative bg-black h-48 overflow-hidden cursor-pointer"
                onClick={() => setPreviewAd(ad)}
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-2 right-2">
                  <span className={`${ad.badgeColor} text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md`}>
                    {ad.badge}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewAd(ad);
                  }}
                  className="absolute bottom-2 left-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition flex items-center gap-1"
                >
                  <Eye className="w-3 h-3 text-cyan-300" />
                  <span>تكبير</span>
                </button>
              </div>

              {/* Offer Details */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between text-right">
                <div>
                  <div className="text-[10px] font-mono text-amber-300 font-bold mb-0.5">
                    {ad.brand}
                  </div>
                  <h3 className="font-black text-xs text-white leading-snug line-clamp-2">
                    {ad.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-light">
                    {ad.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <button
                    onClick={() => onSelectOffer(ad)}
                    className="w-full bg-bendary-700 hover:bg-bendary-600 active:scale-95 text-white font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>طلب هذا العرض</span>
                  </button>

                  <div className="text-[10px] text-slate-500 text-center font-mono">
                    الخط الساخن: 01200400094
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal for full image preview */}
      {previewAd && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-5 text-right relative shadow-2xl">
            <button
              onClick={() => setPreviewAd(null)}
              className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`${previewAd.badgeColor} text-white text-xs font-black px-3 py-1 rounded-full`}>
                {previewAd.badge}
              </span>
              <h3 className="text-base font-black text-white">{previewAd.title}</h3>
            </div>

            <div className="bg-black rounded-2xl p-2 mb-3 flex items-center justify-center max-h-[55vh] overflow-hidden">
              <img
                src={previewAd.image}
                alt={previewAd.title}
                className="max-h-[50vh] w-auto object-contain rounded-xl"
              />
            </div>

            <p className="text-xs text-slate-300 mb-4">{previewAd.subtitle}</p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onSelectOffer(previewAd);
                  setPreviewAd(null);
                }}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>طلب هذا العرض الآن</span>
              </button>
              <a
                href="tel:01200400094"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-mono"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span>01200400094</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
