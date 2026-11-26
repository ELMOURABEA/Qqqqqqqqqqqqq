import React, { useState } from 'react';
import { ArrowLeft, BookOpen, HeartPulse, MessageCircle, ShieldCheck, X } from 'lucide-react';

type Guide = {
  title: string;
  category: string;
  summary: string;
  advice: string[];
};

const guides: Guide[] = [
  {
    title: 'فيتامين د: متى تحتاج إلى تحليل؟',
    category: 'التغذية',
    summary: 'التعب وآلام العظام قد تكون لها أسباب كثيرة؛ التحليل هو ما يحدد إن كان هناك نقص.',
    advice: [
      'لا تبدأ جرعات مرتفعة من فيتامين د دون مراجعة مختص أو نتيجة تحليل.',
      'الجرعة والمتابعة تختلفان حسب العمر والحالة الصحية والأدوية الأخرى.',
      'اسأل الصيدلي أو طبيبك عن التحليل المناسب وخطة المتابعة.',
    ],
  },
  {
    title: 'الحساسية الموسمية: خطوات يومية بسيطة',
    category: 'الوقاية',
    summary: 'تقليل التعرض للمهيجات قد يساعد على تخفيف العطس وسيلان الأنف وحكة العين.',
    advice: [
      'اغسل الوجه واليدين بعد العودة من الخارج، ونظّف فلاتر التكييف بانتظام.',
      'اختيار دواء الحساسية يعتمد على الأعراض والأدوية الأخرى التي تستخدمها.',
      'اطلب مساعدة طبية عاجلة عند ضيق النفس أو تورم الوجه.',
    ],
  },
  {
    title: 'نوم أفضل يبدأ من روتينك',
    category: 'نمط الحياة',
    summary: 'موعد نوم منتظم وغرفة هادئة وعادات مسائية بسيطة قد تدعم نومًا صحيًا.',
    advice: [
      'حاول تثبيت مواعيد النوم والاستيقاظ وتقليل الكافيين في وقت متأخر.',
      'تجنب بدء المنومات أو تغيير جرعات الأدوية دون استشارة مختص.',
      'إذا استمر الأرق أو أثر في حياتك اليومية، تواصل مع طبيبك.',
    ],
  },
];

interface HealthLibraryProps {
  onAskPharmacist: (message: string) => void;
}

export const HealthLibrary: React.FC<HealthLibraryProps> = ({ onAskPharmacist }) => {
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12" dir="rtl" aria-labelledby="health-library-title">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-700 text-xs font-black mb-2">
            <HeartPulse className="w-4 h-4" aria-hidden="true" />
            <span>معلومة موثوقة من فريقنا الصيدلي</span>
          </div>
          <h2 id="health-library-title" className="text-2xl sm:text-3xl font-black text-slate-900">دليلك الصحي من البنداري</h2>
          <p className="text-sm text-slate-500 mt-1">إرشادات عامة تساعدك على بدء حوار صحي أفضل مع الصيدلي.</p>
        </div>
        <button
          type="button"
          onClick={() => onAskPharmacist('أود استشارة صيدلانية عامة')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          اسأل الصيدلي
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {guides.map((guide) => (
          <article key={guide.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{guide.category}</span>
              <BookOpen className="w-5 h-5 text-emerald-700" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">{guide.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{guide.summary}</p>
            <button
              type="button"
              onClick={() => setActiveGuide(guide)}
              className="mt-4 inline-flex items-center gap-2 self-start text-sm font-bold text-red-700 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              aria-label={`اقرأ: ${guide.title}`}
            >
              اقرأ الإرشادات <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
      <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-slate-500">
        <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
        المحتوى للتوعية العامة فقط، ولا يُغني عن تشخيص الطبيب أو إرشادات الصيدلي لحالتك.
      </p>

      {activeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setActiveGuide(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="guide-dialog-title" className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700">{activeGuide.category}</span>
                <h3 id="guide-dialog-title" className="mt-1 text-xl font-black text-slate-900">{activeGuide.title}</h3>
              </div>
              <button type="button" onClick={() => setActiveGuide(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600" aria-label="إغلاق الإرشادات">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {activeGuide.advice.map((item) => <li key={item} className="border-r-2 border-emerald-500 pr-3">{item}</li>)}
            </ul>
            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-6 text-amber-900">هذه معلومات تثقيفية عامة. لا توقف دواءً موصوفًا أو تغيّر جرعته دون الرجوع إلى طبيبك أو الصيدلي.</p>
            <button
              type="button"
              onClick={() => {
                onAskPharmacist(`لدي سؤال عن: ${activeGuide.title}`);
                setActiveGuide(null);
              }}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              اسأل صيدلي البنداري
            </button>
          </section>
        </div>
      )}
    </section>
  );
};
