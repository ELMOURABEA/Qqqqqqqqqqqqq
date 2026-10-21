import React, { useState } from 'react';
import { X, Upload, Camera, FileText, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiService } from '../services/apiService';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrescriptionSubmitted: (prescriptionId: string) => void;
  onOpenChatWithPrescription: (prescriptionId: string, details: string) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  onPrescriptionSubmitted,
  onOpenChatWithPrescription
}) => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('الجيزة');
  const [notes, setNotes] = useState('');
  const [useInsurance, setUseInsurance] = useState(false);
  const [insuranceProvider, setInsuranceProvider] = useState('AXA Egypt');
  const [insuranceCardNum, setInsuranceCardNum] = useState('');

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRxId, setCreatedRxId] = useState<string | null>(null);

  if (!isOpen) return null;

  const samplePrescriptions = [
    {
      title: 'روشتة باطنة وجهاز هضمي',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      detected: ['هيلسيك 20 مجم (14 كبسولة)', 'جافيسكون أكياس شراب (24 كيس)', 'أنتينال 200 مجم']
    },
    {
      title: 'روشتة مسكنات ورعاية عظام',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80',
      detected: ['بنادول إكسترا 24 قرص', 'فيتامين سنتروم مع لوتين', 'مرهم مسكن للأربطة']
    }
  ];

  const handleSelectSample = (sample: typeof samplePrescriptions[0]) => {
    setSelectedImage(sample.image);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedItems(sample.detected);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setIsScanning(true);
        setTimeout(() => {
          setIsScanning(false);
          setScannedItems(['هيلسيك 20 مجم كبسول', 'جافيسكون شراب معلق']);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage && !notes) {
      alert('يرجى إرفاق صورة الروشتة أو كتابة أسماء الأدوية المطلوبة في الملاحظات');
      return;
    }

    setIsSubmitting(true);
    try {
      const rx = await apiService.submitPrescription({
        patientName: patientName || 'عميل صيدليات البنداري',
        patientPhone: patientPhone || '+20 100 000 0000',
        address: address || 'المهندسين، الجيزة',
        governorate,
        notes: notes + (scannedItems.length ? ` (الأدوية المكتشفة: ${scannedItems.join('، ')})` : ''),
        insuranceProvider: useInsurance ? insuranceProvider : undefined,
        insuranceCardNumber: useInsurance ? insuranceCardNum : undefined,
        prescriptionImageName: 'prescription-' + Date.now() + '.jpg',
        prescriptionImageData: selectedImage || undefined
      });

      setCreatedRxId(rx.id);
      onPrescriptionSubmitted(rx.id);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-bendary-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-bendary-800 rounded-xl">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">طلب دواء بالروشتة الطبية</h3>
              <span className="text-[11px] text-bendary-200">خدمة التحضير والتوصيل الفوري من صيدليات البنداري</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-bendary-800 hover:bg-bendary-700 text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {createdRxId ? (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900">تم استلام روشتتك بنجاح!</h4>
              <p className="text-sm text-slate-600">
                رقم متابعة الروشتة الخاص بك هو: <span className="font-mono font-bold text-bendary-700 text-base">{createdRxId}</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-700 text-right space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">حالة الطلب:</span>
                <span className="font-bold text-amber-600">قيد المراجعة والتدقيق الصيدلاني</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">الصيدلي المشرف:</span>
                <span className="font-bold text-slate-800">د. مصطفى المرابعة (MoSTaa-ChaT)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">زمن التوصيل المقدر:</span>
                <span className="font-bold text-emerald-600">30 إلى 45 دقيقة</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  onOpenChatWithPrescription(createdRxId, `مرحباً د. مصطفى، قمت برفع الروشتة رقم ${createdRxId} وأود مراجعة الجرعات والبدائل.`);
                  onClose();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-5 h-5" />
                <span>متابعة الروشتة الآن في MoSTaa-ChaT مع الصيدلي</span>
              </button>

              <button
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition text-xs"
              >
                إغلاق والعودة للتسوق
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Upload Zone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                صورة الروشتة الطبية أو علبة الدواء:
              </label>

              {selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-bendary-500 bg-slate-900">
                  <img
                    src={selectedImage}
                    alt="Uploaded Prescription"
                    className="w-full h-44 object-cover opacity-90"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white space-y-2">
                      <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
                      <span className="text-xs font-bold animate-pulse">جاري فحص وتدقيق الروشتة بواسطة الذكاء الاصطناعي...</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => { setSelectedImage(null); setScannedItems([]); }}
                    className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 hover:border-bendary-500 rounded-2xl p-6 text-center space-y-3 transition bg-slate-50/50">
                  <div className="w-12 h-12 bg-bendary-100 text-bendary-700 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      اضغط لاختيار صورة من جهازك أو التقاط صورة بكاميرا الهاتف
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      يدعم صور الروشتات، تقارير التأمين، أو صور عبوات الأدوية (JPG, PNG, PDF)
                    </p>
                  </div>
                  <label className="inline-block bg-bendary-600 hover:bg-bendary-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition shadow-sm">
                    <span>اختيار صورة الروشتة</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Sample Prescriptions Picker */}
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  أو اختر روشتة تجريبية سريعة للاختبار:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {samplePrescriptions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(s)}
                      className="text-right p-2 rounded-xl border border-slate-200 hover:border-bendary-400 hover:bg-bendary-50/50 transition text-[11px]"
                    >
                      <div className="font-bold text-slate-800 truncate">{s.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{s.detected.join('، ')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detected Items Pill */}
              {scannedItems.length > 0 && (
                <div className="mt-3 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    تم التعرف على الأدوية التالية في الروشتة:
                  </span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {scannedItems.map((item, i) => (
                      <span key={i} className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md text-[11px]">
                        💊 {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Patient Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">اسم المريض:</label>
                <input
                  type="text"
                  placeholder="الاسم ثلاثي..."
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bendary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">رقم الهاتف المحمول:</label>
                <input
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bendary-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">المحافظة:</label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bendary-500 focus:outline-none bg-white"
                >
                  <option value="الجيزة">الجيزة (الدقي، المهندسين، أكتوبر، زايد)</option>
                  <option value="القاهرة">القاهرة (مدينة نصر، التجمع، المعادي)</option>
                  <option value="الإسكندرية">الإسكندرية (سموحة، الرمل، ميامي)</option>
                  <option value="الغربية">الغربية (طنطا، المحلة)</option>
                  <option value="الدقهلية">الدقهلية (المنصورة)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">عنوان التوصيل بالتفصيل:</label>
                <input
                  type="text"
                  placeholder="اسم الشارع، رقم العمارة، رقم الشقة..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bendary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Insurance Checkbox */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useInsurance}
                  onChange={(e) => setUseInsurance(e.target.checked)}
                  className="rounded text-bendary-600 focus:ring-bendary-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  أرغب في الصرف عبر شركة التأمين الطبي المتعاقدة
                </span>
              </label>

              {useInsurance && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-in fade-in">
                  <select
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="p-2 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    <option value="AXA Egypt">أكسا (AXA Egypt)</option>
                    <option value="MetLife">متلايف (MetLife Alico)</option>
                    <option value="NextCare">نكست كير (NextCare)</option>
                    <option value="MedNet">ميدنت (MedNet)</option>
                    <option value="Prime Health">برايم هيلث (Prime Health)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="رقم بطاقة التأمين الطبي..."
                    value={insuranceCardNum}
                    onChange={(e) => setInsuranceCardNum(e.target.value)}
                    className="p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              )}
            </div>

            {/* Patient Notes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                ملاحظات إضافية للصيدلي (أمراض مزمنة، استفسار عن بدائل أرخص، حساسية):
              </label>
              <textarea
                rows={2}
                placeholder="أمثلة: هل يوجد بديل مصري بنفس الكفاءة؟ أعاني من حساسية البنسلين..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bendary-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-bendary-600 hover:bg-bendary-700 disabled:bg-slate-400 text-white font-black py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 active:scale-95"
            >
              {isSubmitting ? (
                <span>جاري إرسال الروشتة...</span>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>تأكيد إرسال الروشتة للصيدلي</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
