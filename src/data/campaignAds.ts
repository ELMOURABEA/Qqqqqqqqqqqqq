export interface CampaignAd {
  id: string;
  image: string;
  brand: string;
  title: string;
  badge: string;
  badgeColor: string;
  category: 'bluebell' | 'hair' | 'skin' | 'suncare' | 'body_care';
  subtitle: string;
  tagline: string;
  ctaText: string;
  priceNote?: string;
}

export const CAMPAIGN_ADS: CampaignAd[] = [
  {
    id: 'ad-spire-clearsal',
    image: '/assets/aistudio/IMG-20260922-WA0011_e7fa8d94.jpg',
    brand: 'Spire Clearsal',
    title: 'بشرة صافية بدون لمعان - مجموعة Clearsal الطبية',
    badge: 'Buy 1 Get 70% OFF On 2nd',
    badgeColor: 'bg-red-700',
    category: 'skin',
    subtitle: 'غسول وجل وجل ترطيب علاجي متطور للبشرة المعرضة لحب الشباب بتقنية موازنة الحموضة pH Balancing Technique',
    tagline: 'صيدليات البنداري • دايماً أقرب لك • الخط الساخن 01200400094',
    ctaText: 'اطلب عرض Spire Clearsal الآن'
  },
  {
    id: 'ad-dimicap',
    image: '/assets/aistudio/IMG-20260922-WA0012_a9a7cafe.jpg',
    brand: 'Dimicap Medical',
    title: 'إستمتعي ببشرة نضرة وصحية - غسول وكريم ديميكاب',
    badge: 'Buy 1 Get 50% OFF On 2nd',
    badgeColor: 'bg-blue-600',
    category: 'skin',
    subtitle: 'تركيبة طبية مخصصة للبشرة الدهنية والمعرضة لحب الشباب لتنظيف عميق وترطيب فائق بدون انسداد للمسام',
    tagline: '46 سنة رعاية من القلب • متوفر بجميع الفروع الـ 11',
    ctaText: 'اطلب عرض Dimicap الآن'
  },
  {
    id: 'ad-c2c-makeup',
    image: '/assets/aistudio/IMG-20260922-WA0024_e2ea0d9e.jpg',
    brand: 'C2C Conceal to Correct',
    title: 'سر الإطلالة المثالية - فاونديشن وكونسيلر C2C',
    badge: 'Buy 1 Get 50% OFF On 2nd',
    badgeColor: 'bg-neutral-800',
    category: 'skin',
    subtitle: 'كريم أساس هيدرا فاونديشن ومصحح عيوب البشرة ليفنتج الطبي بتغطية تدوم طوال اليوم',
    tagline: 'منتجات طبية وتجميلية أصلية 100% • 01200400094',
    ctaText: 'اطلب عرض C2C الآن'
  },
  {
    id: 'ad-bluebell-rozalia',
    image: '/assets/aistudio/IMG-20260922-WA0014_78736697.jpg',
    brand: 'Bluebell Pharmaceuticals',
    title: 'مجموعة إنبات وتقوية الشعر Rozalia Hair Growth',
    badge: 'خصم 25% لفترة محدودة',
    badgeColor: 'bg-amber-600',
    category: 'bluebell',
    subtitle: 'لوشن وسيروم وشامبو روزاليا بمركب 3G2C والكافيين المحفز لبصيلات الشعر - يوصي بها أطباء الجلدية والتجميل',
    tagline: 'توصيل فوري خلال 30-45 دقيقة من أقرب فرع',
    ctaText: 'اطلب باقة Rozalia بخصم 25%'
  },
  {
    id: 'ad-bluebell-medicated-makeup',
    image: '/assets/aistudio/IMG-20260922-WA0016_4ab22daf.jpg',
    brand: 'Bluebell Pharmaceuticals',
    title: 'مكياج طبي مضاد لعلامات التقدم بالعمر مع حماية SPF 30',
    badge: 'خصم 30% خاص',
    badgeColor: 'bg-rose-600',
    category: 'bluebell',
    subtitle: 'Anti-Aging Medicated Makeup with SPF 30 - يجمع بين التغطية التجميلية الطبيعية والوقاية الطبية المعتمدة',
    tagline: 'يوصي بها أطباء الجلدية والتجميل في مصر والشرق الأوسط',
    ctaText: 'اطلب مكياج Bluebell الطبي بخصم 30%'
  },
  {
    id: 'ad-bluebell-dago',
    image: '/assets/aistudio/IMG-20260922-WA0013_2a6a3224.jpg',
    brand: 'Bluebell Pharmaceuticals',
    title: 'شامبو داجو الطبي المقاوم للقشرة وتساقط الشعر DAGO',
    badge: 'خصم 25% معتمد',
    badgeColor: 'bg-emerald-600',
    category: 'bluebell',
    subtitle: 'يقضي على جميع أنواع القشرة الجافة والدهنية بالكافيين وسيلينيوم سلفايد وكلينبازول بدون سلفات',
    tagline: 'صيدليات البنداري • 46 سنة خبرة موثوقة • 01200400094',
    ctaText: 'اطلب شامبو DAGO الطبي'
  },
  {
    id: 'ad-bluebell-elone',
    image: '/assets/aistudio/IMG-20260922-WA0018_9a6abe3c.jpg',
    brand: 'Bluebell Pharmaceuticals',
    title: 'مجموعة الترميم المكثف للشعر التالف Elone Hair Repair',
    badge: 'خصم 25% حصري',
    badgeColor: 'bg-pink-600',
    category: 'bluebell',
    subtitle: 'بلسم وكريم وشامبو وماسك إيلون بالكيراتين الطبيعي المتحلل لإعادة بناء ألياف الشعر ونعومة الحرير',
    tagline: 'استشر صيدلي البنداري مجاناً عبر التطبيق على مدار 24 ساعة',
    ctaText: 'اطلب مجموعة Elone بخصم 25%'
  },
  {
    id: 'ad-bluebell-malinda',
    image: '/assets/aistudio/IMG-20260922-WA0017_f51db778.jpg',
    brand: 'Bluebell Pharmaceuticals',
    title: 'الروتين اليومي للبشرة الدهنية Malinda Daily Routine',
    badge: 'خصم 25% شامل',
    badgeColor: 'bg-cyan-600',
    category: 'bluebell',
    subtitle: 'جل منظف AHA/BHA وكريم ترطيب بالهيالورونيك والنياسيناميد ومرطب الشفاه لبشرة نضرة وغير لامعة',
    tagline: 'صيدليات البنداري دايماً أقرب لك • الخط: 01200400094',
    ctaText: 'اطلب روتين Malinda الطبي'
  },
  {
    id: 'ad-bluebell-bioxee',
    image: '/assets/aistudio/IMG-20260922-WA0015_1528fc78.jpg',
    brand: 'Bluebell Pharmaceuticals',
    title: 'أمبولات بيوكسي المركزة لإعادة إنبات وكثافة الشعر BIOXEE',
    badge: 'خصم 20% لفترة محدودة',
    badgeColor: 'bg-purple-700',
    category: 'bluebell',
    subtitle: 'Hair Follicle Activator معقد SRCP المتطور لتنشيط بصيلات الشعر الضعيفة والحد من التساقط الشديد',
    tagline: 'معتمد رسمياً ومتوفر في الـ 11 فرع لصيدليات البنداري',
    ctaText: 'اطلب أمبولات BIOXEE الآن'
  },
  {
    id: 'ad-vacation-all',
    image: '/assets/aistudio/IMG-20260922-WA0025_8df26359.jpg',
    brand: 'Vacation Skincare',
    title: 'حماية تدوم مع باقة فاكيشن المتكاملة Vacation Skincare',
    badge: 'Buy 1 Get 1 & Buy 2 Get 1 Free',
    badgeColor: 'bg-orange-600',
    category: 'suncare',
    subtitle: 'واقي شمس سبراي وتينتد سائل SPF 50+، وغسول وتونر Sebio-Control، وغسول Aqua-Repair، ومزيل عرق التفتيح',
    tagline: 'صيدليات البنداري • 46 سنة رعاية من القلب',
    ctaText: 'اطلب عروض Vacation Skincare'
  },
  {
    id: 'ad-vacation-weekend',
    image: '/assets/aistudio/IMG-20260922-WA0026_7f77e444.jpg',
    brand: 'Vacation Skincare',
    title: 'استمتعي بخصم نهاية الأسبوع على جميع منتجات فاكيشن',
    badge: '1+1 مجاناً (عرض الويك إند)',
    badgeColor: 'bg-amber-500',
    category: 'suncare',
    subtitle: 'بشرتك محتاجة حماية ممتدة مع سبراي الواقي ومزيلات العرق الطبية المنعشة من فاكيشن',
    tagline: 'الخط الساخن: 01200400094 • خدمة التوصيل السريع',
    ctaText: 'اطلب عرض 1+1 مجاناً من فاكيشن'
  },
  {
    id: 'ad-melatime-sunscreen',
    image: '/assets/aistudio/IMG-20260922-WA0019_401f01d5.jpg',
    brand: 'Melatime Sunscreen',
    title: 'حماية مكملة معاكي - صن سكرين ميلاتايم Melatime',
    badge: 'خصم 60% Price Cut',
    badgeColor: 'bg-red-600',
    category: 'suncare',
    subtitle: 'واقي شمس للأطفال SPF 30 وكريم جل SPF 50+ وتفتيح وسبراي الشاي الأخضر المقاوم للماء بملمس مخملي خفيف',
    tagline: 'العرض متوفر في جميع فروع صيدليات البنداري الـ 11',
    ctaText: 'اطلب عرض Melatime بخصم 60%'
  },
  {
    id: 'ad-capixy-hair',
    image: '/assets/aistudio/IMG-20260922-WA0021_f945023c.jpg',
    brand: 'Capixy Hair Care',
    title: 'انسي مشاكل شعرك مع باقة كابيكسي Capixy المتطورة',
    badge: 'Buy 2 Get 1 Free',
    badgeColor: 'bg-red-700',
    category: 'hair',
    subtitle: 'مجموعة كابيكسي الكاملة: ماسك مغذي، سيروم، إكسير زيت، لوشن إنبات، شامبو، بلسم، وكريم تسريح',
    tagline: 'صيدليات البنداري منذ 1980 • 01200400094',
    ctaText: 'اطلب باقة Capixy الآن'
  },
  {
    id: 'ad-seropipe-nature',
    image: '/assets/aistudio/IMG-20260922-WA0030_0f2f9cc6.jpg',
    brand: 'Seropipe',
    title: 'اختياراتك لشعرك بتفرق - مجموعة سيروبايب الطبيعية',
    badge: 'Buy 1 Get 50% Off',
    badgeColor: 'bg-emerald-700',
    category: 'hair',
    subtitle: 'شامبو وماسك وسيروم وليف إن وسبراي غني بخلاصة الأعشاب اليابانية لتقوية وتكثيف الشعر',
    tagline: '#صيدليات_البنداري_دايما_أقرب_لك • رعاية من القلب',
    ctaText: 'اطلب باقة Seropipe الأصلية'
  },
  {
    id: 'ad-root-to-end',
    image: '/assets/aistudio/IMG-20260922-WA0022_3005023d.jpg',
    brand: 'Root to End',
    title: 'صيفك يبدأ من شعرك - باقة روت تو إند Root to End',
    badge: 'Buy 1 Get 1 Free',
    badgeColor: 'bg-purple-700',
    category: 'hair',
    subtitle: 'هير ميست برائحة منعشة، شامبو للشعر التالف، دراي شامبو SOS، لوشن، وحمام كريم لعلاج تقصف الشعر',
    tagline: 'صيدليات البنداري • 46 سنة ثقة وجودة طبية',
    ctaText: 'اطلب باقة Root to End'
  },
  {
    id: 'ad-narji-caffeine',
    image: '/assets/aistudio/IMG-20260922-WA0020_2c5e65bc.jpg',
    brand: 'Narji Lotion',
    title: 'ودعي تساقط الشعر - لوشن نارجي المركز بالكافيين',
    badge: 'Buy 1 Get 50% Off',
    badgeColor: 'bg-amber-700',
    category: 'hair',
    subtitle: 'تركيبة مكثفة لإنبات وتقوية جذور الشعر ومنع التساقط الهرموني والموسمي لجميع أنواع الشعر',
    tagline: 'توصيل فوري من أقرب فرع • الخط: 01200400094',
    ctaText: 'اطلب لوشن Narji الآن'
  },
  {
    id: 'ad-telofill-beach',
    image: '/assets/aistudio/IMG-20260922-WA0031_e370e026.jpg',
    brand: 'Telofill',
    title: 'العناية الصح لجمالك - باقة تيلوفيل Telofill الكاملة',
    badge: 'Buy 1 Get 1 Free',
    badgeColor: 'bg-fuchsia-700',
    category: 'skin',
    subtitle: 'سكراب للجسم، شاور جل Candy Lush، لوشن حليب الجسم، غسول تفتيح، كريم جل مرطب، وصن سكرين جل',
    tagline: 'صيدليات البنداري • 46 سنة رعاية من القلب',
    ctaText: 'اطلب عرض Telofill الآن'
  },
  {
    id: 'ad-soralone-sun',
    image: '/assets/aistudio/IMG-20260922-WA0028_cd44f680.jpg',
    brand: 'Soralone',
    title: 'عناية مخصصة ليكي - منتجات سورالون العلاجية',
    badge: '30% Price Cut (1+1)',
    badgeColor: 'bg-red-600',
    category: 'skin',
    subtitle: 'يوريا كريم جل 15%، سيكا كريم جل، هيدرا كريم جل، شامبو مضاد للقشرة، سيكا نانو سبراي، ورول أون إصلاح البشرة',
    tagline: 'استشر صيدلي البنداري مجاناً على مدار 24 ساعة',
    ctaText: 'اطلب منتجات Soralone بخصم 30%'
  },
  {
    id: 'ad-see-lit-glow',
    image: '/assets/aistudio/IMG-20260922-WA0010_973971a0.jpg',
    brand: 'See-lit Cosmetics',
    title: 'بشرة أنقى في دقائق - باقة سي ليت See-lit للنضارة',
    badge: 'Buy 1 Get 1 Free',
    badgeColor: 'bg-rose-700',
    category: 'skin',
    subtitle: 'سيروم ريتينول B3، سيروم هيالورونيك وفيتامين B، غسول مقشر لطيف للوجه، وصن سكرين SPF 50+',
    tagline: 'صيدليات البنداري • الخط الساخن: 01200400094',
    ctaText: 'اطلب باقة See-lit الآن'
  },
  {
    id: 'ad-garnier-sorbet',
    image: '/assets/aistudio/IMG-20260922-WA0023_b975253d.jpg',
    brand: 'Garnier SkinActive',
    title: 'بشرة مثالية مع كريمات سوربيه غارنييه المرطبة',
    badge: 'سعر خاص: 270 ج.م فقط',
    badgeColor: 'bg-teal-600',
    category: 'skin',
    subtitle: 'غارنييه ساليسيليك مات للبشرة الدهنية، فيتامين C للنضارة والتفتيح، وهيالورونيك للترطيب والامتلاء الفوري',
    tagline: 'متوفر بجميع الفروع الـ 11 • أدوية ومستحضرات أصلية 100%',
    ctaText: 'اطلب كريم Garnier المفضل'
  },
  {
    id: 'ad-daky-rollon',
    image: '/assets/aistudio/IMG-20260922-WA0027_3dc3d1d4.jpg',
    brand: 'Daky Cosmetics',
    title: 'ثقة تدوم طول اليوم - رول أون داكي Daky لتأخير نمو الشعر',
    badge: 'سعر خاص: 99 ج.م فقط',
    badgeColor: 'bg-red-700',
    category: 'body_care',
    subtitle: 'حماية ومقاومة للعرق 48 ساعة مع ميزة تفتيح البشرة وتأخير نمو الشعر برائحة الكرز أو خالي من العطور',
    tagline: 'صيدليات البنداري • 46 سنة خبرة موثوقة',
    ctaText: 'اطلب رول أون Daky بـ 99 ج'
  },
  {
    id: 'ad-pirlome-capsules',
    image: '/assets/aistudio/IMG-20260922-WA0029_3b430f65.jpg',
    brand: 'Pirlome Nutrition',
    title: 'عناية كاملة في كبسولة واحدة - كبسولات بيرلوم للشعر والأظافر',
    badge: 'Buy 2 Get 1 Free',
    badgeColor: 'bg-emerald-700',
    category: 'body_care',
    subtitle: 'مكمل غذائي متكامل بالفيتامينات والمعادن الأساسية والبيوتين لصحة ونضارة البشرة وتقوية الأظافر ونمو الشعر',
    tagline: 'صيدليات البنداري • الخط الساخن: 01200400094',
    ctaText: 'اطلب كبسولات Pirlome'
  },
  {
    id: 'ad-coco-care-wax',
    image: '/assets/aistudio/IMG-20260922-WA0032_9debc37b.jpg',
    brand: 'COCO Cosmetics',
    title: 'نعومة من أول استخدام - شرائح وعجينة كوكو الطبيعية',
    badge: 'تبدأ من 30 ج.م (شرائح 95 ج)',
    badgeColor: 'bg-rose-600',
    category: 'body_care',
    subtitle: 'عجينة إزالة الشعر الطبيعية بالفحم والكرز والفواكه الاستوائية بـ 30 ج، وشرائح شمعية سهلة الاستخدام بـ 95 ج',
    tagline: '#صيدليات_البنداري_دايما_أقرب_لك • توصيل لجميع المحافظات',
    ctaText: 'اطلب منتجات COCO الآن'
  }
];
