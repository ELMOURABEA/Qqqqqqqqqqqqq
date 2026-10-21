import { initialMoSTaaState, catalogProducts, pharmacyBranches } from '../data/pharmacyData';
import { MoSTaaState, Conversation, ChatMessage, ChatChannel, PaymentRecord } from '../types/chat';
import { Order, PrescriptionOrder, Product } from '../types/pharmacy';

const STORAGE_KEY_STATE = 'mostaa_bendary_state_v1';
const STORAGE_KEY_ORDERS = 'bendary_orders_v1';
const STORAGE_KEY_PRESCRIPTIONS = 'bendary_prescriptions_v1';

function loadLocalState(): MoSTaaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load local state', e);
  }
  return initialMoSTaaState;
}

function saveLocalState(st: MoSTaaState) {
  try {
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(st));
  } catch (e) {
    console.error('Failed to save local state', e);
  }
}

function loadLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [
    {
      id: 'MOS-1024',
      customerName: 'أحمد حسن',
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
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error(e);
  }
}

function loadLocalPrescriptions(): PrescriptionOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRESCRIPTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveLocalPrescriptions(prescriptions: PrescriptionOrder[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PRESCRIPTIONS, JSON.stringify(prescriptions));
  } catch (e) {
    console.error(e);
  }
}

export const apiService = {
  async getState(): Promise<MoSTaaState> {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        saveLocalState(data);
        return data;
      }
    } catch {
      // Fallback to local state
    }
    return loadLocalState();
  },

  async getHealth() {
    try {
      const res = await fetch('/api/health');
      if (res.ok) return await res.json();
    } catch {
      // Return simulated health
    }
    return {
      status: 'healthy',
      service: 'MoSTaa-ChaT',
      version: '1.2.0',
      checks: {
        application: { status: 'up' },
        pharmacyDb: { status: 'up' },
        metaConnector: { status: 'configured' },
        whatsapp: { status: 'connected' },
        payments: { status: 'configured' }
      }
    };
  },

  async sendChatMessage(conversationId: string, text: string, sender: string = 'المريض', type: ChatMessage['type'] = 'text', extra?: Partial<ChatMessage>): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      direction: sender === 'المريض' ? 'inbound' : 'outbound',
      text,
      sender,
      at: new Date().toISOString(),
      type,
      ...extra
    };

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMsg })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local fallback
    }

    const state = loadLocalState();
    const conv = state.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.messages.push(newMsg);
      conv.lastMessageSnippet = text;
      saveLocalState(state);
    }
    return newMsg;
  },

  async claimConversation(conversationId: string, assigneeName: string = 'د. مصطفى المرابعة (Mostafa Admin)'): Promise<Conversation | null> {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignee: assigneeName })
      });
      if (res.ok) return await res.json();
    } catch {
      // Local fallback
    }

    const state = loadLocalState();
    const conv = state.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lockedBy = 'u1';
      conv.assignee = assigneeName;
      conv.status = 'active';
      state.audit.unshift({
        id: 'aud-' + Date.now(),
        action: 'CLAIM_CONVERSATION',
        user: assigneeName,
        timestamp: new Date().toISOString()
      });
      saveLocalState(state);
      return conv;
    }
    return null;
  },

  async toggleChannel(channelId: string): Promise<ChatChannel | null> {
    try {
      const res = await fetch(`/api/channels/${channelId}/toggle`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const state = loadLocalState();
    const channel = state.channels.find(c => c.id === channelId);
    if (channel) {
      channel.enabled = !channel.enabled;
      saveLocalState(state);
      return channel;
    }
    return null;
  },

  async createOrFindPatientConversation(customerName: string, customerPhone: string, channel: 'web' | 'whatsapp' = 'web'): Promise<Conversation> {
    const state = loadLocalState();
    let conv = state.conversations.find(c => c.channel === channel && c.customer.includes(customerName));
    if (!conv) {
      conv = {
        id: 'c-' + Date.now(),
        customer: customerName,
        customerPhone,
        channel,
        status: 'unassigned',
        assignee: null,
        lockedBy: null,
        unreadCount: 0,
        lastMessageSnippet: 'محادثة جديدة نشطة',
        messages: [
          {
            id: 'init-' + Date.now(),
            direction: 'outbound',
            text: `أهلاً بك يا ${customerName} في صيدليات البنداري! 🤍 معك صيدلي مناوب من فريق MoSTaa-ChaT®. كيف يمكننا مساعدتك اليوم؟`,
            sender: 'صيدليات البنداري (MoSTaa-ChaT)',
            at: new Date().toISOString(),
            type: 'text'
          }
        ]
      };
      state.conversations.unshift(conv);
      saveLocalState(state);
    }
    return conv;
  },

  async getAiPharmacistResponse(query: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history: conversationHistory.slice(-5) })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) return data.reply;
      }
    } catch {
      // Fallback to local intelligent clinical triage
    }

    return generateClinicalFallback(query);
  },

  async submitPrescription(data: Omit<PrescriptionOrder, 'id' | 'createdAt' | 'status'>): Promise<PrescriptionOrder> {
    const newPrescription: PrescriptionOrder = {
      id: 'BND-RX-' + Math.floor(1000 + Math.random() * 9000),
      ...data,
      status: 'received',
      createdAt: new Date().toISOString(),
      totalEstimate: 350.0
    };

    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrescription)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const prescriptions = loadLocalPrescriptions();
    prescriptions.unshift(newPrescription);
    saveLocalPrescriptions(prescriptions);
    return newPrescription;
  },

  async getPrescriptions(): Promise<PrescriptionOrder[]> {
    return loadLocalPrescriptions();
  },

  async placeOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'estimatedDeliveryMinutes'>): Promise<Order> {
    const newOrder: Order = {
      id: 'BND-' + Math.floor(10000 + Math.random() * 90000),
      ...orderData,
      status: 'received',
      estimatedDeliveryMinutes: 35,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const orders = loadLocalOrders();
    orders.unshift(newOrder);
    saveLocalOrders(orders);
    return newOrder;
  },

  async getOrders(): Promise<Order[]> {
    return loadLocalOrders();
  },

  async trackOrder(orderId: string): Promise<Order | null> {
    const orders = loadLocalOrders();
    const found = orders.find(o => o.id.toLowerCase() === orderId.trim().toLowerCase());
    if (found) return found;

    // Default sample if searching MOS-1024
    if (orderId.trim().toUpperCase() === 'MOS-1024') {
      return orders[0] || null;
    }
    return null;
  },

  async updatePaymentStatus(paymentId: string, action: 'approve' | 'reject'): Promise<PaymentRecord | null> {
    const state = loadLocalState();
    const pay = state.payments.find(p => p.id === paymentId);
    if (pay) {
      pay.status = action === 'approve' ? 'approved' : 'rejected';
      state.audit.unshift({
        id: 'aud-' + Date.now(),
        action: `${action.toUpperCase()}_PAYMENT`,
        user: 'د. مصطفى المرابعة (Mostafa Admin)',
        timestamp: new Date().toISOString()
      });
      saveLocalState(state);
      return pay;
    }
    return null;
  },

  exportPlatformData(): string {
    const state = loadLocalState();
    const orders = loadLocalOrders();
    const prescriptions = loadLocalPrescriptions();
    return JSON.stringify({ state, orders, prescriptions, exportedAt: new Date().toISOString() }, null, 2);
  }
};

function generateClinicalFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('هيلسيك') || q.includes('healsec') || q.includes('اوميبرازول') || q.includes('حموضة') || q.includes('جافيسكون') || q.includes('gaviscon')) {
    return 'أهلاً بك يا فندم! بخصوص أدوية الحموضة وقرحة المعدة:\n\n1. **هيلسيك (أوميبرازول 20 مجم)**: يؤخذ كبسولة واحدة يومياً صباحاً على معدة فارغة قبل الإفطار بنصف ساعة مع كوب ماء كامل.\n2. **جافيسكون (أكياس أو شراب)**: يعمل كحاجز طافٍ فوق المعدة لمنع الارتجاع، ويؤخذ كيس واحد بعد الأكل بنصف ساعة وقبل النوم.\n\n⚠️ **تنبيه إكلينيكي**: تجنب تناول الجافيسكون في نفس دقيقة الهيلسيك حتى لا يقلل امتصاصه. اترك فاصل ساعة إلى ساعتين.\n\nهل تود تجهيز طلب فوري من أقرب فرع للبنداري؟';
  }

  if (q.includes('بنادول') || q.includes('panadol') || q.includes('صداع') || q.includes('مسكن') || q.includes('حرارة')) {
    return 'أهلاً بك! بنادول إكسترا يحتوي على (باراسيتامول 500 مجم + كافيين 65 مجم).\n\n• **الجرعة المعتادة**: قرص إلى قرصين كل 6 إلى 8 ساعات عند اللزوم بعد الأكل.\n• **الحد الأقصى**: لا تتعدى 8 أقراص خلال 24 ساعة.\n• ⚠️ **تحذير**: لمرضى الضغط المرتفع غير المنتظم، يفضل استخدام بنادول أزرق (عادي) الخالي من الكافيين.\n\nيمكنك طلب توصيله الآن خلال 30 دقيقة.';
  }

  if (q.includes('شعر') || q.includes('تساقط') || q.includes('البيسين') || q.includes('alpecin')) {
    return 'لعلاج تساقط الشعر وتقوية الجذور، شامبو ألبيسين الألماني بالكافيين ممتاز جداً:\n\n• **طريقة الاستخدام**: يوضع على فروة رأس مبللة ويدلك بلطف، ويُترك لمدة دقيقتين كاملتين لامتصاص الكافيين في البصيلات، ثم يشطف بالماء.\n• **نصيحة الصيدلي**: يفضل استخدام مكمل غذائي غني بالزنك والبيوتين مثل ليميتلس أو سنتروم لدعم التغذية الداخلية.\n\nالمنتج متوفر حالياً بصيدليات البنداري بسعر 361 ج.م.';
  }

  if (q.includes('بشرة') || q.includes('سيروم') || q.includes('أنوا') || q.includes('anua') || q.includes('ترطيب')) {
    return 'سيروم أنوا الكوري ANUA PDRN Hyaluronic Acid Serum هو الأحدث في ترطيب وتجديد خلايا البشرة بفضل حمض الهيالورونيك خماسي الأبعاد ومستخلص الـ PDRN.\n\n• **الاستخدام**: 3-4 قطرات صباحاً ومساءً على بشرة نظيفة قبل المرطب.\n• متوفر بصيدليات البنداري بخصم حصري.';
  }

  if (q.includes('تأمين') || q.includes('insurance') || q.includes('اكسا') || q.includes('متلايف')) {
    return 'صيدليات البنداري متعاقدة مع كبرى شركات التأمين الطبي في مصر: (AXA, MetLife, NextCare, MedNet, Prime Health, Misr Healthcare).\n\nيمكنك رفع صورة كارنيه التأمين والروشتة مباشرة عبر زر "التأمين الطبي" وسنقوم باستخراج الموافقة فوراً وصرف الأدوية وتوصيلها لمنزلك!';
  }

  return 'مرحباً بك في خدمة عملاء واستشارات صيدليات البنداري عبر منصة MoSTaa-ChaT®. د. مصطفى المرابعة والفريق الصيدلي جاهز لمساعدتك في أي استفسار دوائي، فحص الروشتات، أو حساب الجرعات. تفضل بذكر اسم الدواء أو سؤالك الطبي!';
}
