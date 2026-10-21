export type ChannelType = 'whatsapp' | 'messenger' | 'instagram' | 'web';

export type MessageType = 'text' | 'voice' | 'prescription' | 'order_quote' | 'ai_disclaimer' | 'system';

export interface ChatMessage {
  id: string;
  direction: 'inbound' | 'outbound' | 'system';
  text: string;
  sender: string;
  at: string;
  type?: MessageType;
  audioDurationSeconds?: number;
  prescriptionUrl?: string;
  orderQuote?: {
    orderId: string;
    itemsSummary: string;
    totalEgp: number;
    patientName: string;
  };
  suggestedByAi?: boolean;
}

export interface Conversation {
  id: string;
  customer: string;
  customerPhone?: string;
  channel: ChannelType;
  status: 'unassigned' | 'active' | 'resolved';
  assignee: string | null;
  lockedBy: string | null;
  unreadCount?: number;
  lastMessageSnippet?: string;
  prescriptionAttached?: boolean;
  priority?: 'normal' | 'urgent';
  messages: ChatMessage[];
}

export interface ChatChannel {
  id: string;
  type: ChannelType;
  name: string;
  enabled: boolean;
  status: 'live' | 'demo' | 'connected';
  accountHandle?: string;
}

export interface PaymentRecord {
  id: string;
  company: string;
  plan: string;
  method: 'QR' | 'Stripe' | 'PayPal' | 'InstaPay' | 'VodafoneCash';
  reference: string;
  amount?: number;
  currency?: string;
  status: 'pending_verification' | 'approved' | 'rejected';
  receiptUrl?: string;
  date?: string;
}

export interface MoSTaaState {
  channels: ChatChannel[];
  conversations: Conversation[];
  payments: PaymentRecord[];
  audit: {
    id: string;
    action: string;
    user: string;
    timestamp: string;
  }[];
}
