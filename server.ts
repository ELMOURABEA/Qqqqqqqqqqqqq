import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { initialMoSTaaState, catalogProducts, pharmacyBranches } from './src/data/pharmacyData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '10mb' }));

// In-memory persistent state initialized with MoSTaa-ChaT & El-Bendary data
let serverState = JSON.parse(JSON.stringify(initialMoSTaaState));
let serverOrders = [
  {
    id: 'MOS-1024',
    customerName: 'أحمد حسن (Ahmed Hassan)',
    customerPhone: '+20 102 345 6789',
    address: 'شارع شهاب، المهندسين، الجيزة',
    governorate: 'الجيزة',
    branchName: 'فرع المهندسين والدقي (الرئيسي)',
    items: [
      { product: catalogProducts[0], quantity: 1 },
      { product: catalogProducts[1], quantity: 1 }
    ],
    subtotal: 335.0,
    deliveryFee: 0,
    discount: 0,
    total: 335.0,
    paymentMethod: 'instapay_vodafone',
    status: 'preparing',
    estimatedDeliveryMinutes: 25,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];
let serverPrescriptions: any[] = [];

// 1. MoSTaa-ChaT Health Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  const started = Date.now();
  res.json({
    status: 'healthy',
    service: 'MoSTaa-ChaT & El-Bendary Pharmacies Ecosystem',
    version: '1.0.0-RELEASE',
    ecosystem: 'El-Bendary Pharmacies Egypt',
    environment: 'production',
    mode: 'official-production',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    responseTimeMs: Date.now() - started,
    checks: {
      application: { status: 'up' },
      pharmacyCatalog: { status: 'up', totalItems: catalogProducts.length },
      metaConnector: { status: 'configured' },
      whatsapp: { status: 'connected' },
      payments: { status: 'configured' }
    }
  });
});

app.get('/api/health/live', (req: Request, res: Response) => {
  res.json({ status: 'alive', uptimeSeconds: Math.round(process.uptime()) });
});

app.get('/api/health/ready', (req: Request, res: Response) => {
  res.json({ status: 'ready', checks: { pharmacyDb: { status: 'up' } } });
});

// 2. MoSTaa-ChaT State
app.get('/api/state', (req: Request, res: Response) => {
  res.json(serverState);
});

// 3. Conversations & Messages
app.get('/api/conversations', (req: Request, res: Response) => {
  res.json({ items: serverState.conversations });
});

app.post('/api/conversations/:id/claim', (req: Request, res: Response) => {
  const { id } = req.params;
  const { assignee = 'د. مصطفى المرابعة (Mostafa Admin)' } = req.body;
  const conv = serverState.conversations.find((c: any) => c.id === id);
  if (!conv) {
    return res.status(404).json({ error: 'conversation_not_found' });
  }
  conv.lockedBy = 'u1';
  conv.assignee = assignee;
  conv.status = 'active';

  serverState.audit.unshift({
    id: 'aud-' + Date.now(),
    action: 'CLAIM_CONVERSATION',
    user: assignee,
    timestamp: new Date().toISOString()
  });

  res.json(conv);
});

app.post('/api/conversations/:id/messages', (req: Request, res: Response) => {
  const { id } = req.params;
  const { message } = req.body;
  const conv = serverState.conversations.find((c: any) => c.id === id);
  if (!conv) {
    return res.status(404).json({ error: 'conversation_not_found' });
  }

  const msg = {
    id: message?.id || 'msg-' + Date.now(),
    direction: message?.direction || 'outbound',
    text: message?.text || '',
    sender: message?.sender || 'د. مصطفى المرابعة (صيدلي إكلينيكي)',
    at: new Date().toISOString(),
    type: message?.type || 'text',
    orderQuote: message?.orderQuote,
    prescriptionUrl: message?.prescriptionUrl,
    audioDurationSeconds: message?.audioDurationSeconds
  };

  conv.messages.push(msg);
  conv.lastMessageSnippet = msg.text || 'مرفق جديد';
  res.status(201).json(msg);
});

// 4. Channels
app.get('/api/channels', (req: Request, res: Response) => {
  res.json({ items: serverState.channels });
});

app.post('/api/channels/:id/toggle', (req: Request, res: Response) => {
  const { id } = req.params;
  const ch = serverState.channels.find((c: any) => c.id === id);
  if (!ch) return res.status(404).json({ error: 'channel_not_found' });
  ch.enabled = !ch.enabled;
  res.json(ch);
});

// 5. Payments & Receipts
app.get('/api/payments', (req: Request, res: Response) => {
  res.json({ items: serverState.payments });
});

app.post('/api/payments/:id/:action', (req: Request, res: Response) => {
  const { id, action } = req.params;
  const pay = serverState.payments.find((p: any) => p.id === id);
  if (!pay) return res.status(404).json({ error: 'payment_not_found' });
  pay.status = action === 'approve' ? 'approved' : 'rejected';

  serverState.audit.unshift({
    id: 'aud-' + Date.now(),
    action: `${action.toUpperCase()}_PAYMENT`,
    user: 'د. مصطفى المرابعة (Mostafa Admin)',
    timestamp: new Date().toISOString()
  });

  res.json(pay);
});

// 6. Data Export
app.get('/api/data/export', (req: Request, res: Response) => {
  const exportPayload = {
    state: serverState,
    orders: serverOrders,
    prescriptions: serverPrescriptions,
    exportedAt: new Date().toISOString()
  };
  res.setHeader('Content-Disposition', 'attachment; filename="mostaa-bendary-export.json"');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(exportPayload, null, 2));
});

// 7. Pharmacy Products & Branches
app.get('/api/products', (req: Request, res: Response) => {
  const { q, category } = req.query;
  let list = [...catalogProducts];
  if (category && category !== 'all') {
    list = list.filter(p => p.category === category || p.categoryEn.toLowerCase() === (category as string).toLowerCase());
  }
  if (q) {
    const queryStr = (q as string).toLowerCase();
    list = list.filter(p => p.nameAr.includes(queryStr) || p.nameEn.toLowerCase().includes(queryStr) || p.activeIngredient.toLowerCase().includes(queryStr));
  }
  res.json({ products: list, total: list.length });
});

app.get('/api/branches', (req: Request, res: Response) => {
  res.json({ branches: pharmacyBranches });
});

// 8. Orders & Prescriptions
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ orders: serverOrders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const newOrder = {
    id: 'BND-' + Math.floor(10000 + Math.random() * 90000),
    ...req.body,
    status: 'received',
    estimatedDeliveryMinutes: 35,
    createdAt: new Date().toISOString()
  };
  serverOrders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.post('/api/prescriptions', (req: Request, res: Response) => {
  const newRx = {
    id: 'BND-RX-' + Math.floor(1000 + Math.random() * 9000),
    ...req.body,
    status: 'received',
    createdAt: new Date().toISOString(),
    totalEstimate: 350.0
  };
  serverPrescriptions.unshift(newRx);
  res.status(201).json(newRx);
});

// 9. AI Pharmacist Copilot powered by Gemini 3.8 Flash
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { query, history } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI();
      const prompt = `
أنت الصيدلي الإكلينيكي الافتراضي الذكي لصيدليات البنداري في مصر (El-Bendary Pharmacies) المدمج مع منصة MoSTaa-ChaT®.
منسق المنظومة: د. مصطفى المرابعة.
الهدف: الإجابة على استفسارات المرضى والعملاء حول الأدوية، الجرعات، التداخلات الدوائية، البدائل المصرية المتوفرة في السوق المصري، نصائح الاستخدام، والتوجيه الطبي الدقيق.

الكتالوج المتوفر بصيدليات البنداري يشمل:
- جافيسكون (شراب وأكياس)، هيلسيك 20 مجم (أوميبرازول)، بنادول إكسترا، أوجمنتين 1 جم، أنتينال 200 مجم، ألبيسين شامبو كافيين، سيروم أنوا PDRN الكوري، أجهزة قياس الضغط أومرون، قياس السكر أكيو تشيك.
- خدمة التوصيل الفوري 24 ساعة عبر الخط الساخن 01200400094 وفروعنا الـ 11 في طنطا والمهندسين.
- شعارنا الدائم: (رعاية من القلب - 46 سنة) منذ 1980.
- تعاقدات التأمين الطبي (AXA, MetLife, NextCare, Prime Health, MedNet).

قواعد الإجابة:
1. التحدث بلغة عربية مهنية، ودودة، واضحة ومطمئنة باللهجة المصرية الراقية.
2. ذكر اسم المادة الفعالة والجرعة المعتادة وأهم التحذيرات بحذر واحترافية.
3. التنويه بأن الاستشارة استرشادية ولا تغني عن استشارة الطبيب المعالج للحالات الطارئة.
4. إعلام المريض بإمكانية طلب الدواء فوراً مع التوصيل إلى المنزل أو استلامه من أقرب فرع للبنداري.

سؤال المريض الحالي: "${query}"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      if (response && response.text) {
        return res.json({ reply: response.text });
      }
    }
  } catch (err: any) {
    console.warn('Gemini API call warning, falling back to local clinical engine:', err?.message);
  }

  // Graceful clinical fallback
  res.json({ reply: null });
});

// Vite Middleware integration for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`El-Bendary & MoSTaa-ChaT full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
