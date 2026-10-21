import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, PhoneCall, FileText, ArrowLeft, Building2 } from 'lucide-react';
import { insuranceProviders } from '../data/pharmacyData';

interface InsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrescription: () => void;
}

export const InsuranceModal: React.FC<InsuranceModalProps> = ({
  isOpen,
  onClose,
  onOpenPrescription
}) => {
  const [selectedProvider, setSelectedProvider] = useState(insuranceProviders[0].id);
  const [estimatedCost, setEstimatedCost] = useState(500);

  if (!isOpen) return null;

  const currentProvider = insuranceProviders.find(p => p.id === selectedProvider) || insuranceProviders[0];
  const coveragePercent = 85;
  const insurancePays = (estimatedCost * coveragePercent) / 100;
  const patientPays = estimatedCost - insurancePays;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-700 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">شبكة التأمين الطبي المعتمدة</h3>
              <span className="text-[11px] text-emerald-200">صيدليات البنداري - شريك معتمد لأكبر شركات التأمين في مصر</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Intro Card */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-950 space-y-1.5">
            <p className="font-black text-sm flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              موافقات فورية وصرف مباشر لأدويتك الشهرية والروشتات
            </p>
            <p className="text-slate-600 leading-relaxed font-light">
              يمكنك صرف أدويتك بأعلى نسبة تغطية تأمينية وبدون عناء الانتظار. نقوم بإرسال طلب الموافقة مباشرة إلى شركة التأمين وتوصيل الأدوية حتى باب منزلك مع فاتورة ضريبية رسمية.
            </p>
          </div>

          {/* Insurance Companies Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              الشركات المتعاقدة حالياً:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {insuranceProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between ${
                    selectedProvider === provider.id
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-xs text-slate-800">{provider.logoText}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {provider.coverageRatio}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 leading-snug truncate">
                    {provider.nameAr}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <PhoneCall className="w-2.5 h-2.5" />
                    <span>{provider.hotline}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Simulator */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>حاسبة التحمل التأميني التقديرية ({currentProvider.logoText}):</span>
              <span className="text-[11px] text-emerald-700 font-bold">تغطية {coveragePercent}%</span>
            </h4>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">قيمة الروشتة الإجمالية المتوقعة:</span>
                <span className="font-extrabold text-slate-900">{estimatedCost} ج.م</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">تتحمله شركة التأمين:</span>
                <span className="text-base font-black text-emerald-600">{insurancePays.toFixed(0)} ج.م</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">نسبة تحمّلك عند الاستلام:</span>
                <span className="text-base font-black text-slate-900">{patientPays.toFixed(0)} ج.م</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              onClose();
              onOpenPrescription();
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 active:scale-95"
          >
            <FileText className="w-5 h-5" />
            <span>ارفع روشتتك وبطاقة التأمين للبدء الفوري</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
