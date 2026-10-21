import React, { useState, useEffect } from 'react';
import { 
  Inbox, Activity, Radio, CreditCard, FileSpreadsheet, 
  Settings, Lock, Unlock, Check, X, Send, Sparkles, 
  Download, ArrowLeft, RefreshCw, UserCheck, ShieldCheck, 
  PhoneCall, ExternalLink, MessageSquare, AlertCircle, 
  Upload, FileUp, FileDown, Plus, Trash2, Edit3, KeyRound, LogOut
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { apiService } from '../services/apiService';
import { MoSTaaState, Conversation, ChatChannel, PaymentRecord } from '../types/chat';
import { Product } from '../types/pharmacy';
import { catalogProducts as initialProducts, isApprovedTeamEmail } from '../data/pharmacyData';
import { BendaryLogo } from './BendaryLogo';

interface MostaOpsPortalProps {
  onBackToStore: () => void;
}

export const MostaOpsPortal: React.FC<MostaOpsPortalProps> = ({ onBackToStore }) => {
  // Staff Auth State (admin@bendaryph.com to admin200@bendaryph.com)
  const [authEmail, setAuthEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('bendary_team_auth_email') || '';
    } catch {
      return '';
    }
  });
  const [loginInputEmail, setLoginInputEmail] = useState('admin@bendaryph.com');
  const [loginPin, setLoginPin] = useState('bendary2026');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'products' | 'channels' | 'payments' | 'reports' | 'settings'>('overview');
  const [state, setState] = useState<MoSTaaState | null>(null);
  const [selectedConvId, setSelectedConvId] = useState<string>('c1');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  // Products Management & Excel State
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bendary_products_catalog');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });
  const [importStatus, setImportStatus] = useState<string>('');
  const [searchProduct, setSearchProduct] = useState<string>('');

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    setLoading(true);
    const data = await apiService.getState();
    setState(data);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const cleanEmail = loginInputEmail.trim().toLowerCase();

    if (!isApprovedTeamEmail(cleanEmail)) {
      setLoginError('عذراً، هذا البريد غير مصرح له! يجب أن يكون البريد مسجلاً ضمن الـ 200 بريد المعتمدين من admin@bendaryph.com إلى admin200@bendaryph.com');
      return;
    }

    setAuthEmail(cleanEmail);
    localStorage.setItem('bendary_team_auth_email', cleanEmail);
  };

  const handleLogout = () => {
    setAuthEmail('');
    localStorage.removeItem('bendary_team_auth_email');
  };

  // EXCEL EXPORT (Point 8)
  const handleExportExcel = () => {
    const rows = productsList.map(p => ({
      'كود الدواء (SKU)': p.sku,
      'الاسم بالعربي': p.nameAr,
      'الاسم بالإنجليزي': p.nameEn,
      'التصنيف': p.category,
      'السعر (ج.م)': p.price,
      'السعر قبل الخصم': p.originalPrice || '',
      'المادة الفعالة': p.activeIngredient,
      'شكل الجرعة': p.dosageForm,
      'يتطلب روشتة': p.requiresPrescription ? 'نعم' : 'لا',
      'متوفر بالمخزون': p.inStock ? 'نعم' : 'لا',
      'دواعي الاستعمال': p.descriptionAr
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الأدوية والمنتجات');
    XLSX.writeFile(workbook, 'El-Bendary_Pharmacies_Products_Catalog.xlsx');
  };

  // EXCEL IMPORT (Point 8)
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('جاري قراءة ملف الإكسيل...');
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!rawJson || rawJson.length === 0) {
          setImportStatus('الملف فارغ أو لا يحتوي على صفوف بيانات صالحة.');
          return;
        }

        const mappedProducts: Product[] = rawJson.map((row, idx) => {
          const sku = row['كود الدواء (SKU)'] || row['SKU'] || row['الكود'] || `SKU-${Date.now()}-${idx}`;
          const nameAr = row['الاسم بالعربي'] || row['NameAr'] || row['اسم الدواء'] || `دواء بنداري جديد ${idx + 1}`;
          const nameEn = row['الاسم بالإنجليزي'] || row['NameEn'] || `Medicine ${idx + 1}`;
          const category = row['التصنيف'] || row['Category'] || 'الأدوية والوصفات الطبية';
          const price = parseFloat(row['السعر (ج.م)'] || row['السعر'] || row['Price'] || '50') || 50;
          const originalPrice = row['السعر قبل الخصم'] ? parseFloat(row['السعر قبل الخصم']) : undefined;
          const activeIngredient = row['المادة الفعالة'] || row['ActiveIngredient'] || 'مادة فعالة صيدلانية';
          const dosageForm = row['شكل الجرعة'] || row['DosageForm'] || 'أقراص';
          const reqRx = row['يتطلب روشتة'] === 'نعم' || row['يتطلب روشتة'] === true || row['RequiresRx'] === true;

          return {
            id: 'imp-' + Date.now() + '-' + idx,
            sku: String(sku),
            nameAr: String(nameAr),
            nameEn: String(nameEn),
            category: String(category),
            categoryEn: 'Medicines',
            price,
            originalPrice,
            inStock: true,
            dosageForm: String(dosageForm),
            descriptionAr: row['دواعي الاستعمال'] || 'منتج طبي معتمد من صيدليات البنداري.',
            descriptionEn: 'Approved medication by El-Bendary Pharmacies.',
            activeIngredient: String(activeIngredient),
            requiresPrescription: reqRx,
            rating: 4.8,
            reviewCount: 50,
            imageEmoji: '💊',
            usageInstructionsAr: 'حسب إرشادات الطبيب أو الصيدلي.',
            sideEffectsAr: 'لا توجد آثار جانبية ملحوظة.'
          };
        });

        const updated = [...mappedProducts, ...productsList];
        setProductsList(updated);
        localStorage.setItem('bendary_products_catalog', JSON.stringify(updated));
        setImportStatus(`تم بنجاح استيراد وتحديث ${mappedProducts.length} منتج دوائي إلى الكتالوج!`);
      } catch (err: any) {
        console.error(err);
        setImportStatus(`خطأ في قراءة ملف الإكسيل: ${err?.message || 'تأكد من صيغة الملف'}`);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleClaim = async (convId: string) => {
    const updated = await apiService.claimConversation(convId, authEmail || 'د. مصطفى المرابعة (Mostafa Admin)');
    if (updated) loadState();
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConvId) return;
    await apiService.sendChatMessage(
      selectedConvId,
      replyText,
      `صيدلي البنداري (${authEmail || 'د. مصطفى المرابعة'})`,
      'text'
    );
    setReplyText('');
    loadState();
  };

  const handleToggleChannel = async (id: string) => {
    await apiService.toggleChannel(id);
    loadState();
  };

  const handlePaymentAction = async (id: string, action: 'approve' | 'reject') => {
    await apiService.updatePaymentStatus(id, action);
    loadState();
  };

  const selectedConv = state?.conversations.find(c => c.id === selectedConvId) || state?.conversations[0];

  // If Not Authenticated as Team Member, show Authorized Gate
  if (!authEmail) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 text-right">
          <div className="flex flex-col items-center text-center space-y-2">
            <BendaryLogo size="lg" />
            <h2 className="text-xl font-black text-white mt-3">بوابة الفريق - صيدليات البنداري</h2>
            <p className="text-xs text-slate-400">
              الدخول مقصور على الصيادلة والإداريين المصرح لهم (200 بريد إلكتروني معتمد)
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/20 border border-red-500/40 p-3 rounded-xl text-xs text-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                البريد الإلكتروني المعتمد (@bendaryph.com):
              </label>
              <input
                type="email"
                placeholder="مثال: admin@bendaryph.com أو admin1@bendaryph.com"
                value={loginInputEmail}
                onChange={(e) => setLoginInputEmail(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                متاح من admin@bendaryph.com وحتى admin200@bendaryph.com
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                رمز التحقق الداخلي / كلمة المرور:
              </label>
              <input
                type="password"
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>تسجيل الدخول إلى بوابة الفريق</span>
            </button>
          </form>

          {/* Quick test buttons */}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <span className="block text-slate-500">تجربة سريعة للبريد المصرح به:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setLoginInputEmail('admin@bendaryph.com')}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2.5 py-1 rounded-lg font-mono text-[10px]"
              >
                admin@bendaryph.com
              </button>
              <button
                type="button"
                onClick={() => setLoginInputEmail('admin25@bendaryph.com')}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2.5 py-1 rounded-lg font-mono text-[10px]"
              >
                admin25@bendaryph.com
              </button>
              <button
                type="button"
                onClick={() => setLoginInputEmail('admin200@bendaryph.com')}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2.5 py-1 rounded-lg font-mono text-[10px]"
              >
                admin200@bendaryph.com
              </button>
            </div>
          </div>

          <button
            onClick={onBackToStore}
            className="w-full text-center text-xs text-slate-400 hover:text-white pt-2 flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            <span>العودة إلى متجر صيدليات البنداري الرئيسي</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter products for the products tab
  const filteredProducts = productsList.filter(p => 
    p.nameAr.includes(searchProduct) || 
    p.nameEn.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Top Operations Navbar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <BendaryLogo size="sm" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white">بوابة الفريق - صيدليات البنداري</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                فريق الصيادلة الإكلينيكيين
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              المستخدم المصرح: <span className="text-emerald-400 font-bold">{authEmail}</span> • الخط الساخن: 01200400094
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadState}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onBackToStore}
            className="bg-bendary-700 hover:bg-bendary-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>متجر وتطبيق المرضى</span>
          </button>
        </div>
      </header>

      {/* Main Operations Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-slate-950/70 border-b md:border-b-0 md:border-l border-slate-800 p-3 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === 'overview' ? 'bg-bendary-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>نظرة عامة والتشغيل</span>
          </button>

          {/* TAB: Products & Excel (Point 8) */}
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === 'products' ? 'bg-bendary-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>المنتجات وملف الإكسيل (Excel)</span>
            </div>
            <span className="bg-emerald-900/60 text-emerald-300 text-[10px] px-2 py-0.2 rounded-full font-bold">
              {productsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === 'inbox' ? 'bg-bendary-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4" />
              <span>محادثات المرضى الواردة</span>
            </div>
            {state && (
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.2 rounded-full">
                {state.conversations.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === 'channels' ? 'bg-bendary-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>قنوات التواصل (Channels)</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === 'payments' ? 'bg-bendary-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4" />
              <span>المدفوعات والإيصالات</span>
            </div>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded">
              {state?.payments.filter(p => p.status === 'pending_verification').length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === 'settings' ? 'bg-bendary-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات النظام والـ 200 بريد</span>
          </button>

          {/* Pharmacist Logged-in badge */}
          <div className="pt-4 mt-4 border-t border-slate-800 px-2 text-[11px] text-slate-400 space-y-1">
            <span className="block text-slate-500 text-[10px]">المستخدم الحالي:</span>
            <div className="font-bold text-slate-200 flex items-center gap-1.5 font-mono text-[10px] truncate">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{authEmail}</span>
            </div>
            <span className="text-[10px] text-emerald-400 block">مصرح بالعمليات الصيدلانية</span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-xl font-black text-white">لوحة تحكم العمليات المركزية</h2>
                <p className="text-xs text-slate-400">صيدليات البنداري • رعاية من القلب - 46 سنة</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-slate-400 font-bold">المنتجات في الكتالوج</span>
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><FileSpreadsheet className="w-4 h-4" /></span>
                  </div>
                  <div className="text-3xl font-black text-white">{productsList.length}</div>
                  <span className="text-[10px] text-emerald-400 mt-1 block">متصل بملف الإكسيل الرئيسي</span>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-slate-400 font-bold">المحادثات النشطة</span>
                    <span className="p-2 rounded-xl bg-bendary-500/10 text-bendary-400"><MessageSquare className="w-4 h-4" /></span>
                  </div>
                  <div className="text-3xl font-black text-white">{state?.conversations.length || 0}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">متوسط زمن الاستجابة: 1.8 دقيقة</span>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-slate-400 font-bold">الفروع النشطة</span>
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><PhoneCall className="w-4 h-4" /></span>
                  </div>
                  <div className="text-3xl font-black text-white">11 فرع</div>
                  <span className="text-[10px] text-amber-300 mt-1 block">الخط الساخن: 01200400094</span>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-slate-400 font-bold">المستخدمون المصرح لهم</span>
                    <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><UserCheck className="w-4 h-4" /></span>
                  </div>
                  <div className="text-3xl font-black text-white">200 Admin</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">admin1@ إلى admin200@bendaryph.com</span>
                </div>
              </div>

              {/* Quick links to OneDrive Sheet */}
              <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="font-black text-sm text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                    شيت إكسيل المنتجات الرسمي (OneDrive)
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 font-light">
                    يمكنك الوصول المباشر لشيت الأدوية والأسعار على مايكروسوفت ون درايف أو تصديره واستيراده بنقرة واحدة.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportExcel}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>تصدير Excel</span>
                  </button>
                  <a
                    href="https://1drv.ms/x/c/dd8f720ddffeb858/IQAfxqjfqOphQ4T1iA_7PSY6AZUgCti90n7SlQmQsk9tM64?e=bxX3pX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs px-4 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <span>فتح في OneDrive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & EXCEL MANAGEMENT (Point 8) */}
          {activeTab === 'products' && (
            <div className="space-y-5 max-w-6xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                    <span>إدارة كتالوج المنتجات والإكسيل (Excel Import / Export)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    استيراد وتحديث الأدوية مباشرة من شيت إكسيل صيدليات البنداري
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Export Button */}
                  <button
                    onClick={handleExportExcel}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>تصدير الكتالوج إلى Excel (.xlsx)</span>
                  </button>

                  {/* Import Button */}
                  <label className="bg-bendary-700 hover:bg-bendary-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow">
                    <FileUp className="w-4 h-4" />
                    <span>استيراد ملف Excel (.xlsx)</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleImportExcel}
                      className="hidden"
                    />
                  </label>

                  {/* OneDrive Link */}
                  <a
                    href="https://1drv.ms/x/c/dd8f720ddffeb858/IQAfxqjfqOphQ4T1iA_7PSY6AZUgCti90n7SlQmQsk9tM64?e=bxX3pX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                    title="فتح شيت الإكسيل المرفوع على OneDrive"
                  >
                    <span>رابط OneDrive</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </a>
                </div>
              </div>

              {/* Status Message */}
              {importStatus && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-200 flex items-center justify-between">
                  <span>{importStatus}</span>
                  <button onClick={() => setImportStatus('')} className="text-slate-400 hover:text-white">✕</button>
                </div>
              )}

              {/* Search in products */}
              <div className="flex justify-between items-center gap-3">
                <input
                  type="text"
                  placeholder="ابحث في الكتالوج باسم الدواء أو الكود أو المادة الفعالة..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="w-full sm:w-96 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
                <span className="text-xs text-slate-400">إجمالي الأدوية: <strong className="text-white">{filteredProducts.length}</strong></span>
              </div>

              {/* Table of Products */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="p-3">الكود (SKU)</th>
                        <th className="p-3">اسم الدواء</th>
                        <th className="p-3">التصنيف</th>
                        <th className="p-3">المادة الفعالة</th>
                        <th className="p-3">السعر (ج.م)</th>
                        <th className="p-3">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredProducts.slice(0, 50).map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-900/60 transition">
                          <td className="p-3 font-mono text-emerald-400 text-[11px]">{prod.sku}</td>
                          <td className="p-3">
                            <div className="font-bold text-white">{prod.nameAr}</div>
                            <div className="text-[10px] text-slate-400 font-sans">{prod.nameEn}</div>
                          </td>
                          <td className="p-3">
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                              {prod.category}
                            </span>
                          </td>
                          <td className="p-3 text-slate-300 text-[11px]">{prod.activeIngredient}</td>
                          <td className="p-3 font-black text-amber-300">{prod.price.toFixed(2)} ج.م</td>
                          <td className="p-3">
                            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full">
                              متوفر
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INBOX */}
          {activeTab === 'inbox' && (
            <div className="h-[750px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col md:flex-row">
              {/* Conversations List */}
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-slate-800 flex flex-col">
                <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-300 flex justify-between items-center">
                  <span>المحادثات الواردة ({state?.conversations.length})</span>
                  <span className="text-[10px] text-emerald-400">تحديث فوري</span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                  {state?.conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`w-full p-3.5 text-right transition flex flex-col gap-1 ${
                        selectedConvId === conv.id ? 'bg-slate-800/90 border-r-4 border-bendary-500' : 'hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-white truncate">{conv.customer}</span>
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono uppercase">
                          {conv.channel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{conv.lastMessageSnippet}</p>
                      <div className="flex justify-between items-center text-[10px] pt-1">
                        <span className={conv.assignee ? 'text-emerald-400' : 'text-amber-400'}>
                          {conv.assignee ? `المسؤول: ${conv.assignee.split(' ')[0]}` : 'غير معين'}
                        </span>
                        {conv.lockedBy && (
                          <span className="text-slate-500 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5 text-amber-400" /> مقفول
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread Panel */}
              <div className="flex-1 flex flex-col bg-slate-900">
                {selectedConv ? (
                  <>
                    {/* Thread Header */}
                    <div className="p-3.5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-sm text-white">{selectedConv.customer}</h3>
                          <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                            {selectedConv.customerPhone || 'مريض مجهول'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          القناة: {selectedConv.channel} • الحالة: {selectedConv.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedConv.lockedBy ? (
                          <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            <span>مملوكة لـ {selectedConv.assignee}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleClaim(selectedConv.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>استلام المحادثة (Claim)</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/70">
                      {selectedConv.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex flex-col ${m.direction === 'outbound' ? 'items-end' : 'items-start'}`}
                        >
                          <div className="text-[10px] text-slate-400 mb-1 px-1">
                            <span>{m.sender}</span> • <span>{new Date(m.at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                              m.direction === 'outbound'
                                ? 'bg-bendary-700 text-white rounded-tr-none'
                                : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input Reply Box */}
                    <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                      <input
                        type="text"
                        placeholder="اكتب رد الصيدلي الإكلينيكي هنا..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                        className="flex-1 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-bendary-500"
                      />
                      <button
                        onClick={handleSendReply}
                        className="bg-bendary-600 hover:bg-bendary-700 text-white font-bold px-4 rounded-xl text-xs flex items-center gap-1.5 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                    اختر محادثة لعرض التفاصيل
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-4 max-w-4xl">
              <div>
                <h2 className="text-xl font-black text-white">إدارة قنوات التواصل الموحدة</h2>
                <p className="text-xs text-slate-400">تفعيل أو تعطيل القنوات ومزامنة الرسائل عبر Meta API والواتساب</p>
              </div>

              <div className="space-y-3">
                {state?.channels.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-4 bg-slate-800/70 border border-slate-700 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{ch.name}</h4>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono uppercase">
                          {ch.type}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono mt-0.5 block">{ch.accountHandle}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold ${ch.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {ch.enabled ? 'مفعل ويعمل' : 'معطل'}
                      </span>
                      <button
                        onClick={() => handleToggleChannel(ch.id)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          ch.enabled ? 'bg-emerald-600' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            ch.enabled ? 'right-1' : 'right-7'
                          }`}
                        ></span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-4 max-w-5xl">
              <div>
                <h2 className="text-xl font-black text-white">إدارة إيصالات الدفع والتحويلات</h2>
                <p className="text-xs text-slate-400">تحويلات فودافون كاش، إنستاباي، والتحقق البنكي</p>
              </div>

              <div className="space-y-3">
                {state?.payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-800/70 border border-slate-700 rounded-2xl flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-emerald-400 font-bold">{p.id}</span>
                        <span className="text-sm font-bold text-white">{p.company}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        الطريقة: <strong className="text-slate-200">{p.method}</strong> • المرجع: <span className="font-mono text-slate-300">{p.reference}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        p.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : p.status === 'rejected' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {p.status === 'approved' ? 'معتمد' : p.status === 'rejected' ? 'مرفوض' : 'بانتظار التحقق'}
                      </span>

                      {p.status === 'pending_verification' && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handlePaymentAction(p.id, 'approve')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
                          >
                            اعتماد الإيصال
                          </button>
                          <button
                            onClick={() => handlePaymentAction(p.id, 'reject')}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
                          >
                            رفض
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & 200 EMAILS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <h2 className="text-xl font-black text-white">إعدادات المنظومة وصلاحيات الـ 200 بريد</h2>
                <p className="text-xs text-slate-400">قائمة البريد المعتمدة (@bendaryph.com) لمديري الفروع والصيادلة</p>
              </div>

              <div className="p-6 bg-slate-800/60 border border-slate-700 rounded-3xl space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">المؤسسة الصيدلانية:</label>
                  <input
                    type="text"
                    readOnly
                    value="صيدليات البنداري (El-Bendary Pharmacies) - مصر"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">الخط الساخن المركزي:</label>
                  <input
                    type="text"
                    readOnly
                    value="01200400094"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white block text-sm">حسابات الـ 200 بريد المعتمدة:</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    تم ضبط النظام ليقبل دخول المستخدمين من نطاق المؤسسة المعتمد حصراً:
                    <br />
                    <code className="text-emerald-400 font-mono font-bold">admin@bendaryph.com</code>
                    <br />
                    <code className="text-emerald-400 font-mono font-bold">admin1@bendaryph.com</code> إلى <code className="text-emerald-400 font-mono font-bold">admin200@bendaryph.com</code>
                  </p>
                  <div className="text-[10px] text-slate-500 pt-1">
                    حالة ترخيص البريد الحالي: <strong className="text-emerald-400">{authEmail} (موثق)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Operations Branding Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 p-3 text-center text-[10px] text-slate-400">
        <div className="font-bold text-slate-300">صيدليات البنداري • رعاية من القلب - 46 سنة</div>
        <div className="text-slate-500 mt-0.5">الخط الساخن: 01200400094 • 11 فرع معتمد • بوابة الفريق الإدارية</div>
      </footer>
    </div>
  );
};
