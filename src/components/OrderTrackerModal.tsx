import React, { useState } from 'react';
import { X, Search, PackageCheck, Clock, CheckCircle2, Truck, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Order } from '../types/pharmacy';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  onOpenChatWithOrder: (orderId: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
  onOpenChatWithOrder
}) => {
  const [searchId, setSearchId] = useState(initialOrderId || 'MOS-1024');
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-search initial order on mount
  React.useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      handleSearch(initialOrderId);
    } else {
      handleSearch('MOS-1024');
    }
  }, [initialOrderId, isOpen]);

  const handleSearch = async (idToSearch?: string) => {
    const query = (idToSearch || searchId).trim();
    if (!query) return;

    setLoading(true);
    setNotFound(false);
    try {
      const found = await apiService.trackOrder(query);
      if (found) {
        setOrder(found);
      } else {
        setOrder(null);
        setNotFound(true);
      }
    } catch (e) {
      console.error(e);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { key: 'received', title: 'تم استلام الطلب', desc: 'تم تسجيل الطلب في نظام صيدليات البنداري', icon: CheckCircle2 },
    { key: 'pharmacy_review', title: 'المراجعة الصيدلانية', desc: 'مراجعة الجرعات والروشتة بواسطة د. مصطفى المرابعة', icon: UserCheck },
    { key: 'preparing', title: 'قيد التجهيز والتغليف الدوائي', desc: 'صرف الأدوية الأصلية وفحص تاريخ الصلاحية وسلسلة التبريد', icon: PackageCheck },
    { key: 'out_for_delivery', title: 'في الطريق مع مندوب التوصيل', desc: 'مندوب البنداري في طريقه إلى عنوانك', icon: Truck },
    { key: 'delivered', title: 'تم التسليم بنجاح', desc: 'نتمنى لك دوام الصحة والعافية', icon: CheckCircle2 }
  ];

  // Helper to determine step status
  const getStepStatus = (stepKey: string, currentStatus: Order['status']) => {
    const orderIndex = steps.findIndex(s => s.key === currentStatus);
    const stepIndex = steps.findIndex(s => s.key === stepKey);
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-base leading-tight">تتبع حالة طلب الدواء الفوري</h3>
              <span className="text-[11px] text-slate-400">نظام المتابعة الحية لصيدليات البنداري</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="أدخل رقم الطلب (مثال: MOS-1024 أو BND-xxxx)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 p-3 rounded-2xl border border-slate-300 text-xs font-mono uppercase focus:ring-2 focus:ring-bendary-500 focus:outline-none"
            />
            <button
              onClick={() => handleSearch()}
              className="bg-bendary-600 hover:bg-bendary-700 text-white text-xs font-bold px-5 rounded-2xl transition shadow flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>بحث</span>
            </button>
          </div>

          {loading && (
            <div className="py-8 text-center text-xs text-slate-500 font-bold animate-pulse">
              جاري فحص حالة الطلب في قاعدة البيانات...
            </div>
          )}

          {notFound && !loading && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
              <p className="font-bold">لم يتم العثور على طلب بهذا الرقم: {searchId}</p>
              <p className="text-[11px] text-slate-600">يمكنك تجربة البحث بالطلب التجريبي: <strong>MOS-1024</strong></p>
            </div>
          )}

          {order && !loading && (
            <div className="space-y-6">
              {/* Order Info Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">رقم الطلب</span>
                    <span className="text-base font-black text-slate-900 font-mono">{order.id}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-medium">الفرع المجهز</span>
                    <span className="text-xs font-bold text-bendary-700">{order.branchName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">اسم العميل:</span>
                    <span className="font-bold text-slate-800">{order.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">الوقت المتبقي المقدر:</span>
                    <span className="font-black text-emerald-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {order.estimatedDeliveryMinutes} دقيقة
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="border-t border-slate-200 pt-2 space-y-1">
                  <span className="text-[10px] text-slate-400 block">محتويات الطلبية:</span>
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-medium text-slate-700">
                      <span>• {it.product.nameAr} (الكمية: {it.quantity})</span>
                      <span className="font-bold text-slate-900">{(it.product.price * it.quantity).toFixed(2)} ج.م</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs font-black text-bendary-800 border-t border-slate-100 pt-1">
                    <span>الإجمالي الكلي:</span>
                    <span>{order.total.toFixed(2)} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Visual Timeline Progress */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900">خط سير الطلب والتحضير الدوائي:</h4>
                <div className="relative pr-6 space-y-6 before:absolute before:right-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {steps.map((st, i) => {
                    const status = getStepStatus(st.key, order.status);
                    const isCompleted = status === 'completed';
                    const isCurrent = status === 'current';

                    return (
                      <div key={st.key} className="relative flex items-start gap-3">
                        {/* Circle dot on line */}
                        <div
                          className={`absolute -right-6 w-5 h-5 rounded-full flex items-center justify-center transition ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-bendary-600 text-white ring-4 ring-bendary-100 animate-pulse'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px] font-bold">{i + 1}</span>
                          )}
                        </div>

                        <div>
                          <h5
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-bendary-700 text-sm'
                                : isCompleted
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {st.title} {isCurrent && <span className="text-[10px] bg-bendary-100 text-bendary-800 px-1.5 py-0.2 rounded font-bold mr-1">الحالة الحالية</span>}
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  onOpenChatWithOrder(order.id);
                  onClose();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 active:scale-95 text-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>محادثة الصيدلي المناوب بخصوص الطلب {order.id} (MoSTaa-ChaT)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
