import React, { useState } from 'react';
import { X, ShoppingCart, Heart, ShieldAlert, Sparkles, Plus, Minus, Check, MessageSquare, AlertCircle } from 'lucide-react';
import { Product } from '../types/pharmacy';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onConsultPharmacist: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onConsultPharmacist
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="bg-bendary-100 text-bendary-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Product Hero Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-tr from-slate-50 to-bendary-50 rounded-2xl flex items-center justify-center shadow-inner border border-slate-100 shrink-0">
              <span className="text-7xl select-none">{product.imageEmoji}</span>
            </div>

            <div className="space-y-2 text-center sm:text-right flex-1">
              <h2 className="text-2xl font-black text-slate-900 leading-snug">
                {product.nameAr}
              </h2>
              <p className="text-sm text-slate-500 font-sans tracking-wide uppercase">
                {product.nameEn}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                  {product.dosageForm}
                </span>
                {product.requiresPrescription ? (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    يلزم روشتة طبية معتمدة
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                    صرف مباشر بدون روشتة (OTC)
                  </span>
                )}
              </div>

              {/* Price section */}
              <div className="pt-2 flex items-baseline justify-center sm:justify-start gap-3">
                <span className="text-3xl font-black text-bendary-700">{product.price.toFixed(2)}</span>
                <span className="text-sm font-bold text-slate-600">جنيه مصري</span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {product.originalPrice.toFixed(2)} ج.م
                  </span>
                )}
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  متوفر بالمخزون
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Sheet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-bendary-600" />
                المادة الفعالة والتركيب
              </h4>
              <p className="text-sm font-bold text-slate-800">{product.activeIngredient}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                طريقة الاستخدام والجرعة
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{product.usageInstructionsAr}</p>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-sm font-black text-slate-900">دواعي الاستعمال ونبذة عن الدواء:</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{product.descriptionAr}</p>
            <p className="text-xs text-slate-400 font-sans italic border-t border-slate-100 pt-2">{product.descriptionEn}</p>
          </div>

          {/* Warnings & Side Effects */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1 text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              التحذيرات والآثار الجانبية:
            </span>
            <p>{product.sideEffectsAr}</p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 sticky bottom-0 rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">الكمية:</span>
            <div className="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden shadow-inner">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-slate-100 text-slate-600 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm font-bold text-slate-800">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-slate-100 text-slate-600 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs font-black text-slate-900">
              الإجمالي: {(product.price * quantity).toFixed(2)} ج.م
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onConsultPharmacist(product);
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>استشر صيدلي MoSTaa-ChaT</span>
            </button>

            <button
              onClick={handleAdd}
              className={`text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition active:scale-95 ${
                added ? 'bg-emerald-600 text-white' : 'bg-bendary-600 hover:bg-bendary-700 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تمت الإضافة!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>أضف إلى السلة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
