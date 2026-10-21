import React, { useState, useEffect } from 'react';
import { 
  Grid, Pill, Sparkles, Scissors, Smile, Baby, Zap, 
  Activity, Tag, HeartPulse, Upload, ShieldCheck, 
  MapPin, PackageCheck, MessageSquare, PhoneCall, 
  Clock, CheckCircle2, ChevronLeft, ArrowRight, Heart, Users
} from 'lucide-react';
import { Product, CartItem, Order } from './types/pharmacy';
import { catalogProducts, pharmacyCategories } from './data/pharmacyData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { InsuranceModal } from './components/InsuranceModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { BranchesModal } from './components/BranchesModal';
import { MostaChatPlugin } from './components/MostaChatPlugin';
import { MostaOpsPortal } from './components/MostaOpsPortal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingChatIcons } from './components/FloatingChatIcons';
import { BendaryLogo } from './components/BendaryLogo';

export default function App() {
  const [showTeamPortal, setShowTeamPortal] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'home' | 'catalog' | 'prescription' | 'chat' | 'cart'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bendary_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isInsuranceOpen, setIsInsuranceOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [trackingOrderId, setTrackingOrderId] = useState<string>('MOS-1024');
  const [chatPrefill, setChatPrefill] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('bendary_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart actions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Consult pharmacist helper
  const handleConsultPharmacist = (product: Product) => {
    setChatPrefill(`السلام عليكم دكتور، أود الاستفسار عن دواء: ${product.nameAr} (${product.nameEn})، ما هي الجرعة الصحيحة وهل يوجد له موانع استعمال؟`);
    setIsChatOpen(true);
  };

  // Filter products by category & search term
  const filteredProducts = catalogProducts.filter(p => {
    const matchesSearch = 
      p.nameAr.includes(searchTerm) || 
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'antacids') return p.category === 'مضادات الحموضة';
    if (selectedCategory === 'medicines') return p.category === 'الأدوية والوصفات الطبية' || p.requiresPrescription;
    if (selectedCategory === 'skincare') return p.category === 'العناية بالبشرة' || p.category === 'مستحضرات التجميل';
    if (selectedCategory === 'haircare') return p.category === 'العناية بالشعر';
    if (selectedCategory === 'personal_care') return p.category === 'العناية الشخصية';
    if (selectedCategory === 'mother_baby') return p.category === 'مستلزمات الأطفال والأمهات';
    if (selectedCategory === 'vitamins') return p.category === 'الفيتامينات والمكملات';
    if (selectedCategory === 'medical_devices') return p.category === 'الأجهزة والمستلزمات الطبية';
    if (selectedCategory === 'offers') return p.originalPrice && p.originalPrice > p.price;

    return true;
  });

  const cartItemsCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  // If in Team Portal mode (بوابة الفريق), render operations desk
  if (showTeamPortal) {
    return <MostaOpsPortal onBackToStore={() => setShowTeamPortal(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800" dir="rtl">
      {/* Header with (رعاية من القلب - 46 سنة) and Hotline 01200400094 */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOpenInsurance={() => setIsInsuranceOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenBranches={() => setIsBranchesOpen(true)}
        onOpenChat={() => {
          setChatPrefill('');
          setIsChatOpen(true);
        }}
        onOpenTeamPortal={() => setShowTeamPortal(true)}
        products={catalogProducts}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Categories Navigation Bar */}
      <nav className="bg-slate-900 text-slate-200 border-t border-slate-800 shadow-sm sticky top-[69px] z-20 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 py-2 text-xs font-bold whitespace-nowrap">
          {pharmacyCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-bendary-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{cat.nameAr}</span>
              {cat.id === 'offers' && (
                <span className="bg-red-500 text-white text-[9px] px-1 rounded-full animate-pulse">
                  خصومات
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-12">
        {/* Hero Banner */}
        <HeroBanner
          onOpenPrescription={() => setIsPrescriptionOpen(true)}
          onOpenChat={() => {
            setChatPrefill('السلام عليكم دكتور، أود استشارة صيدلانية عن الأدوية المناسبة لحالتي.');
            setIsChatOpen(true);
          }}
          onQuickOrderSent={(msg) => {
            setChatPrefill(msg);
            setIsChatOpen(true);
          }}
        />

        {/* Quick Service Cards */}
        <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Rx Upload */}
            <div 
              onClick={() => setIsPrescriptionOpen(true)}
              className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200/80 hover:border-bendary-500 cursor-pointer transition hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 bg-bendary-50 text-bendary-600 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 leading-tight">طلب بروشتة فورية</h3>
              <p className="text-[11px] text-slate-500 mt-1">ارفع صورة الروشتة وسنقوم بتحضيرها فوراً</p>
            </div>

            {/* Card 2: Pharmacist Consultation */}
            <div 
              onClick={() => {
                setChatPrefill('');
                setIsChatOpen(true);
              }}
              className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200/80 hover:border-emerald-500 cursor-pointer transition hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <h3 className="font-black text-sm text-slate-900 leading-tight">استشارة صيدلي البنداري</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">محادثة وصوت مع د. مصطفى المرابعة 24 ساعة</p>
            </div>

            {/* Card 3: Medical Insurance */}
            <div 
              onClick={() => setIsInsuranceOpen(true)}
              className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200/80 hover:border-teal-500 cursor-pointer transition hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 leading-tight">التأمين الطبي</h3>
              <p className="text-[11px] text-slate-500 mt-1">AXA, MetLife, NextCare وموافقات فورية</p>
            </div>

            {/* Card 4: Branches */}
            <div 
              onClick={() => setIsBranchesOpen(true)}
              className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200/80 hover:border-red-500 cursor-pointer transition hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 leading-tight">فروعنا الـ 11 المعتمدة</h3>
              <p className="text-[11px] text-slate-500 mt-1">المهندسين، الجلاء، البورصة، الأشرف والمحافظة</p>
            </div>
          </div>
        </section>

        {/* Product Catalog Grid */}
        <section className="max-w-7xl mx-auto px-4 pt-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedCategory === 'all' ? 'جميع الأدوية والمستلزمات' : pharmacyCategories.find(c => c.id === selectedCategory)?.nameAr}
                </h3>
                <span className="text-xs bg-bendary-100 text-bendary-800 px-2.5 py-0.5 rounded-full font-bold">
                  {filteredProducts.length} منتج
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                أسعار أصلية ومحدثة وفقاً لقاعدة بيانات صيدليات البنداري الرسمية
              </p>
            </div>

            {/* Filter tags shortcuts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 text-[11px]">أكثر طلباً:</span>
              <button
                onClick={() => setSelectedCategory('antacids')}
                className="bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-semibold"
              >
                مضادات الحموضة
              </button>
              <button
                onClick={() => setSelectedCategory('skincare')}
                className="bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-semibold"
              >
                العناية بالبشرة
              </button>
              <button
                onClick={() => setSelectedCategory('offers')}
                className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-lg border border-red-200 font-bold"
              >
                العروض الخاصة
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <div className="text-4xl">🔍</div>
              <h4 className="text-base font-bold text-slate-800">لم يتم العثور على أدوية مطابقة للبحث</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                يمكنك كتابة اسم الدواء في محادثة صيدلي البنداري وسيقوم بفحص توفره في الفروع فوراً!
              </p>
              <button
                onClick={() => {
                  setChatPrefill(`هل يتوفر لديكم دواء: ${searchTerm}؟`);
                  setIsChatOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                استفسر من الصيدلي عن "{searchTerm}"
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p, qty) => handleAddToCart(p, qty || 1)}
                  onOpenDetails={(p) => setSelectedProduct(p)}
                  onConsultPharmacist={handleConsultPharmacist}
                />
              ))}
            </div>
          )}
        </section>

        {/* Prescription Assurance Banner */}
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <div className="bg-gradient-to-r from-slate-900 to-bendary-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
            <div className="space-y-2 text-center md:text-right max-w-xl">
              <span className="bg-bendary-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                خدمة الصرف الدوائي المعتمدة
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                هل لديك روشتة طبية أو علاج شهري للأمراض المزمنة؟
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                فريق الصيادلة الإكلينيكيين بصيدليات البنداري يقوم بمراجعة الجرعات وتاريخ الصلاحية وتوفير الأدوية الناقصة مع بدائلها المصرحة من وزارة الصحة عبر فروعنا الـ 11.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                onClick={() => setIsPrescriptionOpen(true)}
                className="bg-white text-bendary-900 font-extrabold px-5 py-3 rounded-xl shadow hover:bg-slate-100 transition flex items-center gap-2 text-xs"
              >
                <Upload className="w-4 h-4 text-bendary-600" />
                <span>رفع الروشتة الآن</span>
              </button>

              <button
                onClick={() => setIsInsuranceOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl border border-slate-700 transition text-xs"
              >
                <span>صرف عبر التأمين الطبي</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Icons: Chat, WhatsApp, Call, Rx (Point 6) */}
      <FloatingChatIcons
        onOpenChat={() => {
          setChatPrefill('');
          setIsChatOpen(true);
        }}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6">
            <BendaryLogo size="lg" whiteTheme={true} />

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <a 
                href="tel:01200400094" 
                className="flex items-center gap-1.5 text-amber-300 font-black hover:underline font-mono"
              >
                <PhoneCall className="w-4 h-4 text-red-400" />
                <span>الخط الساخن: 01200400094</span>
              </a>

              <span className="text-slate-600">•</span>

              <button onClick={() => setIsBranchesOpen(true)} className="hover:text-white transition">
                فروعنا الـ 11 المعتمدة
              </button>

              <span className="text-slate-600">•</span>

              {/* Discreet Team Portal access for authorized 200 emails (Point 7) */}
              <button
                onClick={() => setShowTeamPortal(true)}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 bg-slate-900 hover:bg-slate-800 px-3 py-1 rounded-xl border border-slate-800 transition"
              >
                <Users className="w-3.5 h-3.5" />
                <span>بوابة الفريق (@bendaryph.com)</span>
              </button>
            </div>
          </div>

          <div className="text-center space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center justify-center gap-1.5 text-slate-300 font-black text-xs">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
              <span>صيدليات البنداري • رعاية من القلب - 46 سنة (1980 - 2026)</span>
            </div>
            <p>خدمة توصيل فورية 24 ساعة في جميع الفروع • الخط الساخن: 01200400094</p>
            <p className="text-[10px] text-slate-600">
              Co-ordinator: Dr. Mostafa Al-Marabaa • 🤍 Thanks to Allah for giving us the knowledge. 🤍
            </p>
            <p>© 2026 صيدليات البنداري مصر. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Bar on small screens */}
      <div className="md:hidden">
        <MobileBottomNav
          activeTab={mobileTab}
          setActiveTab={(tab) => {
            setMobileTab(tab);
            if (tab === 'catalog') setSelectedCategory('all');
            if (tab === 'prescription') setIsPrescriptionOpen(true);
            if (tab === 'chat') setIsChatOpen(true);
            if (tab === 'cart') setIsCartOpen(true);
          }}
          cartCount={cartItemsCount}
          unreadChatCount={1}
          onOpenPrescription={() => setIsPrescriptionOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenChat={() => {
            setChatPrefill('');
            setIsChatOpen(true);
          }}
        />
      </div>

      {/* ALL MODALS & FLYOUTS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
        onConsultPharmacist={handleConsultPharmacist}
      />

      <PrescriptionUploadModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        onPrescriptionSubmitted={(rxId) => {
          setTrackingOrderId(rxId);
        }}
        onOpenChatWithPrescription={(rxId, details) => {
          setChatPrefill(details);
          setIsChatOpen(true);
        }}
      />

      <InsuranceModal
        isOpen={isInsuranceOpen}
        onClose={() => setIsInsuranceOpen(false)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderSuccess={(order) => {
          setTrackingOrderId(order.id);
          setIsOrderTrackerOpen(true);
        }}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        initialOrderId={trackingOrderId}
        onOpenChatWithOrder={(ordId) => {
          setChatPrefill(`السلام عليكم دكتور، أود الاستفسار عن حالة طلبي الدوائي رقم ${ordId}.`);
          setIsChatOpen(true);
        }}
      />

      <BranchesModal
        isOpen={isBranchesOpen}
        onClose={() => setIsBranchesOpen(false)}
        onOpenChatWithBranch={(branchName) => {
          setChatPrefill(`مرحباً صيدلية البنداري - ${branchName}، هل يتوفر لديكم استلام أدوية من الفرع؟`);
          setIsChatOpen(true);
        }}
      />

      <MostaChatPlugin
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty || 1)}
        prefilledQuery={chatPrefill}
        patientName="المريض"
      />
    </div>
  );
}
