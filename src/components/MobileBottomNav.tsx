import React from 'react';
import { Home, Grid, Upload, MessageSquare, ShoppingCart } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'catalog' | 'prescription' | 'chat' | 'cart';
  setActiveTab: (tab: 'home' | 'catalog' | 'prescription' | 'chat' | 'cart') => void;
  cartCount: number;
  unreadChatCount: number;
  onOpenPrescription: () => void;
  onOpenCart: () => void;
  onOpenChat: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  unreadChatCount,
  onOpenPrescription,
  onOpenCart,
  onOpenChat
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex justify-around items-center">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
          activeTab === 'home' ? 'text-bendary-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[11px]">الرئيسية</span>
      </button>

      <button
        onClick={() => setActiveTab('catalog')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
          activeTab === 'catalog' ? 'text-bendary-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Grid className="w-5 h-5 mb-0.5" />
        <span className="text-[11px]">الأقسام</span>
      </button>

      {/* Floating Center Action: Upload Rx */}
      <button
        onClick={onOpenPrescription}
        className="flex flex-col items-center justify-center -mt-5"
        title="ارفع الروشتة"
      >
        <div className="w-13 h-13 bg-gradient-to-tr from-bendary-700 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white active:scale-95 transition">
          <Upload className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-[10px] font-bold text-bendary-800 mt-0.5">روشتة فورية</span>
      </button>

      <button
        onClick={onOpenChat}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
          activeTab === 'chat' ? 'text-bendary-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 mb-0.5" />
          {unreadChatCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white animate-bounce">
              {unreadChatCount}
            </span>
          )}
        </div>
        <span className="text-[11px]">استشر صيدلي</span>
      </button>

      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 transition"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-bendary-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[11px]">السلة</span>
      </button>
    </div>
  );
};
