import React, { useState } from 'react';
import { 
  PhoneCall, Clock, Search, Upload, ShoppingCart, 
  ShieldCheck, MapPin, PackageCheck, MessageSquare, 
  Menu, X, Heart, Users
} from 'lucide-react';
import { Product } from '../types/pharmacy';
import { BendaryLogo } from './BendaryLogo';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenPrescription: () => void;
  onOpenInsurance: () => void;
  onOpenOrderTracker: () => void;
  onOpenBranches: () => void;
  onOpenChat: () => void;
  onOpenTeamPortal: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  cartCount,
  onOpenCart,
  onOpenPrescription,
  onOpenInsurance,
  onOpenOrderTracker,
  onOpenBranches,
  onOpenChat,
  onOpenTeamPortal,
  products,
  onSelectProduct
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const matchedProducts = searchTerm.trim().length > 1
    ? products.filter(p => 
        p.nameAr.includes(searchTerm) || 
        p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <>
      {/* Top Banner: رعاية من القلب - 46 سنة & الخط الساخن 01200400094 بشكل بارز */}
      <div className="bg-gradient-to-r from-bendary-950 via-bendary-900 to-red-950 text-white py-2 px-3 sm:px-4 shadow-md border-b-2 border-red-700/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          {/* Care from the Heart Badge - 46 Years */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-bendary-700 text-white px-3.5 py-1 rounded-full font-black text-xs sm:text-sm shadow-md border border-red-400/50 tracking-wide">
              <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
              <span>رعاية من القلب - 46 سنة</span>
            </span>
            <span className="hidden md:inline text-slate-300 text-xs font-semibold">
              صيدليات البنداري • في خدمتكم منذ 1980 وحتى اليوم 2026
            </span>
          </div>

          {/* Prominent Hotline 01200400094 Display */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a 
              href="tel:01200400094" 
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-bendary-950 px-3.5 sm:px-4 py-1.5 rounded-full font-black transition shadow-lg ring-2 ring-amber-300/60 active:scale-95 group"
              title="اتصل بالخط الساخن المباشر 01200400094"
            >
              <div className="w-5 h-5 rounded-full bg-bendary-950 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <PhoneCall className="w-3 h-3 animate-bounce" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[11px] sm:text-xs font-bold hidden xs:inline">الخط الساخن:</span>
                <span className="font-mono text-sm sm:text-base font-black tracking-wider">01200400094</span>
              </div>
            </a>

            {/* Quick Links */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-200">
              <button 
                onClick={onOpenBranches}
                className="flex items-center gap-1 hover:text-amber-300 transition text-[11px] font-bold"
              >
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>11 فرع</span>
              </button>

              <span className="text-slate-500">|</span>

              <button 
                onClick={onOpenOrderTracker}
                className="flex items-center gap-1 hover:text-amber-300 transition text-[11px] font-bold"
              >
                <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>تتبع الطلب</span>
              </button>

              <span className="text-slate-500">|</span>

              <span className="flex items-center gap-1 text-slate-300 text-[11px] font-medium">
                <Clock className="w-3 h-3 text-amber-300" />
                24 ساعة
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-[42px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          
          {/* Logo Section with Official PDF Extracted Logo */}
          <div 
            className="cursor-pointer transition hover:opacity-95" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <BendaryLogo size="md" />
          </div>

          {/* Search Bar with live autocomplete */}
          <div className="flex-1 max-w-2xl mx-2 hidden md:block relative">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن دواء (مثل: هيلسيك، جافيسكون، بنادول)، مستحضر تجميل، أو مادة فعالة..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-slate-100 border border-slate-300 rounded-full py-2.5 pr-11 pl-4 text-sm focus:outline-none focus:border-bendary-600 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-2.5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-3.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showSearchDropdown && matchedProducts.length > 0 && (
              <div className="absolute top-full mt-1.5 right-0 left-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 flex justify-between items-center">
                  <span>منتجات متطابقة مع البحث:</span>
                  <button onClick={() => setShowSearchDropdown(false)} className="text-slate-400 hover:text-slate-600">
                    إغلاق ✕
                  </button>
                </div>
                {matchedProducts.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      setShowSearchDropdown(false);
                    }}
                    className="p-3 hover:bg-bendary-50/60 cursor-pointer flex items-center justify-between border-b border-slate-100 last:border-0 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{prod.imageEmoji}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{prod.nameAr}</div>
                        <div className="text-[11px] text-slate-400 font-sans">{prod.nameEn} • {prod.activeIngredient}</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-extrabold text-bendary-700">{prod.price.toFixed(2)} ج.م</div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {prod.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Prescription Button */}
            <button
              onClick={onOpenPrescription}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-bendary-600 hover:bg-bendary-700 px-3.5 py-2.2 rounded-xl shadow-sm hover:shadow transition active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">ارفع الروشتة</span>
              <span className="sm:hidden">روشتة</span>
            </button>

            {/* Insurance Button */}
            <button
              onClick={onOpenInsurance}
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-bendary-700 bg-slate-100 hover:bg-bendary-50 px-3 py-2 rounded-xl border border-slate-200 transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>التأمين الطبي</span>
            </button>

            {/* El-Bendary Pharmacist Consultation Trigger */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 shadow-sm transition active:scale-95"
              title="استشارة صيدلي البنداري المباشرة 24 ساعة"
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              </div>
              <span className="hidden md:inline">استشارة صيدلي البنداري</span>
              <span className="md:hidden">استشر صيدلي</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-slate-100 rounded-full hover:bg-bendary-50 text-slate-700 hover:text-bendary-600 transition active:scale-95"
              aria-label="سلة المشتريات"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-bendary-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-700 transition md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input when on phone */}
        <div className="px-4 pb-2.5 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن أدوية، مستحضرات، أو فيتامينات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-full py-2 pr-10 pl-4 text-xs focus:outline-none focus:border-bendary-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-2.5" />
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-white px-4 py-3 space-y-2 text-sm border-t border-slate-800 animate-in fade-in duration-150">
            <a
              href="tel:01200400094"
              className="w-full flex items-center justify-between py-2.5 px-3 bg-amber-400 text-bendary-950 rounded-xl font-black text-xs"
            >
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                <span>الخط الساخن المباشر</span>
              </span>
              <span className="font-mono text-sm">01200400094</span>
            </a>

            <button
              onClick={() => { onOpenPrescription(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 py-2 border-b border-slate-800 text-right hover:text-red-300 text-xs"
            >
              <Upload className="w-4 h-4 text-bendary-400" /> اطلب بروشتة فورية
            </button>
            <button
              onClick={() => { onOpenInsurance(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 py-2 border-b border-slate-800 text-right hover:text-red-300 text-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> تعاقدات التأمين الطبي
            </button>
            <button
              onClick={() => { onOpenOrderTracker(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 py-2 border-b border-slate-800 text-right hover:text-red-300 text-xs"
            >
              <PackageCheck className="w-4 h-4 text-amber-400" /> تتبع شحنة دواء
            </button>
            <button
              onClick={() => { onOpenBranches(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 py-2 border-b border-slate-800 text-right hover:text-red-300 text-xs"
            >
              <MapPin className="w-4 h-4 text-red-400" /> فروع صيدليات البنداري الـ 11
            </button>
            <button
              onClick={() => { onOpenChat(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 py-2 border-b border-slate-800 text-right text-emerald-300 font-bold text-xs"
            >
              <MessageSquare className="w-4 h-4" /> استشارة صيدلي البنداري 24 ساعة
            </button>
            <button
              onClick={() => { onOpenTeamPortal(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 py-2 text-right text-slate-400 hover:text-white text-xs"
            >
              <Users className="w-4 h-4 text-emerald-400" /> بوابة الفريق (دخول الموظفين)
            </button>
          </div>
        )}
      </header>
    </>
  );
};
