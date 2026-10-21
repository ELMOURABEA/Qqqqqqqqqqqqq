'use client';

import React, { useState } from 'react';
import { 
  Search, ShoppingCart, Upload, Grid, 
  PhoneCall, Heart, Clock, Menu, X, ShieldCheck, MapPin, ChevronLeft
} from 'lucide-react';

const catalogProducts = [
  { sku: "GA", nameEn: "GAVISCON LIQUID 24 SACHETS", nameAr: "جافيسكون أكياس شراب 24 كيس", category: "مضادات الحموضة", price: 288.0 },
  { sku: "0063657_2", nameEn: "HEALSEC 20 MG 14 CAP", nameAr: "هيلسيك 20 مجم 14 كبسولة", category: "مضادات الحموضة", price: 47.0 },
  { sku: "771643", nameEn: "GAVISCON SUSPENSION", nameAr: "جافيسكون شراب معلق", category: "مضادات الحموضة", price: 144.0 },
  { sku: "782300", nameEn: "VASELINE 50ML ORIGINAL", nameAr: "فازلين 50 ملل أصلي", category: "العناية بالبشرة", price: 85.0 },
  { sku: "0004521", nameEn: "LIFEBUOY MILD CARE HAND WASH 450ML", nameAr: "لايفبوي غسول اليدين 450 مل", category: "العناية الشخصية", price: 100.0 },
  { sku: "0038121", nameEn: "ADIDAS AFTER SPORT SHOWER GEL 250ML", nameAr: "أديداس شاور جل للرجال 250 مل", category: "العناية الشخصية", price: 175.0 },
  { sku: "771148", nameEn: "ACM DEPIWHITE CREAM SPF50+ 50ML", nameAr: "اي سي ام ديباي وايت كريم 50 مل", category: "مستحضرات التجميل", price: 450.0 },
  { sku: "0071491", nameEn: "ANUA PDRN HYALURONIC ACID SERUM 30ML", nameAr: "أنوا سيروم الهيالورونيك أسيد 30 مل", category: "العناية بالبشرة", price: 1700.0 },
  { sku: "0033037", nameEn: "ALPECIN TUNING SHAMPOO 200ML", nameAr: "البيسين شامبو للشعر 200 مل", category: "العناية بالشعر", price: 361.0 },
  { sku: "0040409", nameEn: "ART ANTI HAIR LOSS SHAMPOO 200ML", nameAr: "آرت شامبو ضد تساقط الشعر 200 مل", category: "العناية بالشعر", price: 500.0 }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = catalogProducts.filter(p => 
    p.nameAr.includes(searchTerm) || p.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800" dir="rtl">
      
      {/* Top Hotline Bar */}
      <div className="bg-bendary-900 text-white text-xs py-2 px-4 flex justify-between items-center shadow-inner">
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="flex items-center gap-1 font-semibold">
            <PhoneCall className="w-3.5 h-3.5 text-bendary-100" /> الخط الساخن: <a href="tel:16000" className="underline hover:text-red-200">خدمة العملاء والتوصيل</a>
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-200">صيدليات البنداري - رعاية متكاملة منذ 1980</span>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <span className="flex items-center gap-1 text-slate-200"><Clock className="w-3 h-3"/> خدمة 24 ساعة</span>
          <span className="bg-bendary-700 px-2 py-0.5 rounded text-[10px] font-bold">توصيل سريع</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-bendary-600 text-white p-2.5 rounded-2xl flex items-center justify-center shadow-md">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6"/>
                <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-bendary-800 tracking-tight leading-none">صيدليات البنداري</h1>
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">EL-BENDARY PHARMACIES</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن دواء، مستحضر تجميل، أو منتج عناية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 border border-slate-300 rounded-full py-2.5 pr-11 pl-4 text-sm focus:outline-none focus:border-bendary-600 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-2.5" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-bendary-600 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-bendary-600 transition">
              <Upload className="w-4 h-4 text-bendary-600" />
              <span>ارفع الروشتة</span>
            </button>

            <button className="relative p-2.5 bg-slate-100 rounded-full hover:bg-bendary-50 text-slate-700 hover:text-bendary-600 transition">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-bendary-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cart.length}
                </span>
              )}
            </button>

            <button className="p-2.5 bg-slate-100 rounded-full hover:bg-bendary-50 text-slate-700 hover:text-bendary-600 transition md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="bg-slate-900 text-slate-200 hidden md:block border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 text-sm font-semibold overflow-x-auto py-2.5">
            <a href="#" className="text-bendary-500 flex items-center gap-1 hover:text-white"><Grid className="w-4 h-4"/> كافة الأقسام</a>
            <a href="#" className="hover:text-bendary-500 transition">الأدوية والوصفات</a>
            <a href="#" className="hover:text-bendary-500 transition">العناية بالبشرة</a>
            <a href="#" className="hover:text-bendary-500 transition">العناية بالشعر</a>
            <a href="#" className="hover:text-bendary-500 transition">مستلزمات الأطفال والأمهات</a>
            <a href="#" className="hover:text-bendary-500 transition">الفيتامينات والمكملات</a>
            <a href="#" className="hover:text-bendary-500 transition">الأجهزة الطبية</a>
            <a href="#" className="hover:text-bendary-500 transition text-red-400">العروض والخصومات</a>
          </div>
        </nav>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-bendary-900 via-bendary-700 to-red-600 text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-right">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">رعايتكم مسؤوليتنا منذ 1980</span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">طلب دواؤك ومستلزماتك الطبية أصبح أسهل</h2>
            <p className="text-slate-100 text-sm md:text-base leading-relaxed">
              تصفح أكثر من 22,000 منتج طبي وتجميلي مع خدمة توصيل فورية وشاملة من صيدليات البنداري.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <button className="bg-white text-bendary-800 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-slate-100 transition flex items-center gap-2">
                <Upload className="w-5 h-5 text-bendary-600"/> اطلب بالروشتة الآن
              </button>
              <button className="bg-bendary-900/60 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-bendary-900 transition">
                تصفح الكتالوج
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
            <h3 className="text-lg font-bold mb-2">تأكيد طلب سريع</h3>
            <p className="text-xs text-slate-200 mb-4">اكتب اسم المنتج أو الدواء وسيعاود الصيدلي الاتصال بك فوراً</p>
            <input type="text" placeholder="اسم الدواء أو رقم الهاتف..." className="w-full p-3 rounded-lg text-slate-800 text-sm mb-3 focus:outline-none" />
            <button className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-lg transition shadow-md">
              إرسال للخدمة السريعة
            </button>
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900">المنتجات الأكثر طلباً</h3>
            <p className="text-xs text-slate-500">تم تحديث المنتجات والأسعار وفقاً لقاعدة بيانات صيدليات البنداري</p>
          </div>
          <span className="text-xs bg-bendary-100 text-bendary-800 px-3.5 py-1 rounded-full font-bold">
            22,258 منتج متوفر
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 hover:border-bendary-500 hover:shadow-xl transition-all p-4 flex flex-col justify-between group">
              <div>
                <div className="w-full h-36 bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2 relative">
                  <span className="text-4xl text-slate-300 font-black">💊</span>
                  <button className="absolute top-2 left-2 p-1.5 bg-white/80 rounded-full text-slate-400 hover:text-red-500 transition">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] font-bold text-bendary-600 bg-bendary-50 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <h4 className="font-bold text-sm text-slate-800 mt-2 line-clamp-2 group-hover:text-bendary-700 transition">
                  {product.nameAr}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider truncate">
                  {product.nameEn}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">السعر</span>
                  <span className="text-base font-extrabold text-slate-900">{product.price.toFixed(2)} <span className="text-[10px] font-normal">ج.م</span></span>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-bendary-600 hover:bg-bendary-700 text-white p-2.5 rounded-xl transition shadow-sm active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <p className="font-bold text-slate-200">صيدليات البنداري © 2026 - جميع الحقوق محفوظة.</p>
          <p>جاهز تماماً للنشر المباشر عبر Vercel والربط مع مستودع GitHub.</p>
        </div>
      </footer>
    </div>
  );
}
