import React, { useState } from 'react';
import { 
  X, ShoppingBag, Trash2, Plus, Minus, ArrowLeft, 
  CreditCard, Banknote, QrCode, ShieldCheck, CheckCircle2, 
  Truck, Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Product, Order } from '../types/pharmacy';
import { apiService } from '../services/apiService';
import { pharmacyBranches } from '../data/pharmacyData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess
}) => {
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedBranch, setSelectedBranch] = useState(pharmacyBranches[0].nameAr);
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('cash_on_delivery');
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('الجيزة');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = deliveryType === 'delivery' ? (subtotal > 350 ? 0 : 25) : 0;
  const discount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'BENDARY10') {
      setDiscountPercent(10);
      setCouponApplied(true);
      setCouponError('');
    } else if (code === 'DUAYA20') {
      setDiscountPercent(20);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('كود الخصم غير صحيح. جرب BENDARY10');
      setCouponApplied(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const order = await apiService.placeOrder({
        customerName: customerName || 'عميل صيدليات البنداري',
        customerPhone: customerPhone || '01200400094',
        address: deliveryType === 'delivery' ? (address || 'المهندسين، الجيزة') : `استلام من: ${selectedBranch}`,
        governorate,
        branchName: selectedBranch,
        items: cart.map(c => ({ product: c.product, quantity: c.quantity })),
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod
      });

      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      onClearCart();
      onOrderSuccess(order);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-bendary-400" />
            <h3 className="font-extrabold text-base">سلة الأدوية والمشتريات</h3>
            <span className="bg-bendary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((a, b) => a + b.quantity, 0)} عنصر
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-4xl">
                💊
              </div>
              <h4 className="text-base font-bold text-slate-800">سلتك الدوائية فارغة</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                تصفح كتالوج صيدليات البنداري وأضف الأدوية أو مستحضرات العناية المطلوبة
              </p>
              <button
                onClick={onClose}
                className="bg-bendary-600 hover:bg-bendary-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                تصفح المنتجات الآن
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-2.5">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl border border-slate-200 shrink-0">
                        {item.product.imageEmoji}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                          {item.product.nameAr}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-sans block truncate uppercase">
                          {item.product.nameEn}
                        </span>
                        <div className="text-xs font-black text-bendary-700 mt-0.5">
                          {(item.product.price * item.quantity).toFixed(2)} ج.م
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition"
                        title="حذف من السلة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery vs Pickup Selector */}
              <div className="bg-slate-100 p-1.5 rounded-2xl flex text-xs font-bold gap-1">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    deliveryType === 'delivery'
                      ? 'bg-white text-bendary-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>توصيل للمنزل (30-45 دقيقة)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    deliveryType === 'pickup'
                      ? 'bg-white text-bendary-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>استلام من الفرع</span>
                </button>
              </div>

              {/* Delivery info fields */}
              <div className="space-y-3 pt-1">
                {deliveryType === 'pickup' ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">اختر فرع الاستلام:</label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      {pharmacyBranches.map(b => (
                        <option key={b.id} value={b.nameAr}>{b.nameAr} - {b.cityAr}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">الاسم بالكامل:</label>
                        <input
                          type="text"
                          placeholder="اسم المشتري..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">رقم الهاتف:</label>
                        <input
                          type="tel"
                          placeholder="01xxxxxxxxx"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">العنوان بالتفصيل:</label>
                      <input
                        type="text"
                        placeholder="الشارع، رقم العمارة، رقم الشقة..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Coupon Code Section */}
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كود الخصم (جرب BENDARY10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-slate-300 text-xs uppercase"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      تطبيق
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تم تفعيل خصم {discountPercent}% بنجاح!
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[10px] text-red-500 font-bold mt-1">{couponError}</p>
                  )}
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">طريقة الدفع:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      paymentMethod === 'cash_on_delivery' ? 'border-bendary-600 bg-bendary-50/50 text-bendary-900 font-bold' : 'border-slate-200'
                    }`}>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={() => setPaymentMethod('cash_on_delivery')}
                        className="hidden"
                      />
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>دفع نقدي (كاش)</span>
                    </label>

                    <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      paymentMethod === 'instapay_vodafone' ? 'border-bendary-600 bg-bendary-50/50 text-bendary-900 font-bold' : 'border-slate-200'
                    }`}>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'instapay_vodafone'}
                        onChange={() => setPaymentMethod('instapay_vodafone')}
                        className="hidden"
                      />
                      <QrCode className="w-4 h-4 text-purple-600" />
                      <span>إنستاباي / فودافون كاش</span>
                    </label>

                    <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      paymentMethod === 'credit_card' ? 'border-bendary-600 bg-bendary-50/50 text-bendary-900 font-bold' : 'border-slate-200'
                    }`}>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                        className="hidden"
                      />
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>بطاقة بنكية / فيزا</span>
                    </label>

                    <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      paymentMethod === 'insurance' ? 'border-bendary-600 bg-bendary-50/50 text-bendary-900 font-bold' : 'border-slate-200'
                    }`}>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'insurance'}
                        onChange={() => setPaymentMethod('insurance')}
                        className="hidden"
                      />
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>مطالبة تأمين طبي</span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Summary & Submit */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-800">{subtotal.toFixed(2)} ج.م</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>الخصم المطبق:</span>
                  <span>-{discount.toFixed(2)} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>مصاريف التوصيل:</span>
                <span className="font-bold text-slate-800">
                  {deliveryFee === 0 ? 'توصيل مجاني' : `${deliveryFee.toFixed(2)} ج.م`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>المجموع الكلي:</span>
                <span className="text-base text-bendary-700">{total.toFixed(2)} ج.م</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full bg-bendary-600 hover:bg-bendary-700 disabled:bg-slate-400 text-white font-black py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 active:scale-95"
            >
              {isSubmitting ? (
                <span>جاري إرسال الطلب...</span>
              ) : (
                <>
                  <span>تأكيد الطلب الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
