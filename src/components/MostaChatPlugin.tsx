import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Mic, Paperclip, Sparkles, Check, CheckCheck, 
  ShieldCheck, ShoppingCart, Volume2, Heart
} from 'lucide-react';
import { ChatMessage, ChannelType } from '../types/chat';
import { Product } from '../types/pharmacy';
import { apiService } from '../services/apiService';
import { catalogProducts } from '../data/pharmacyData';
import { BendaryLogo } from './BendaryLogo';
import { saveChatMessageToFirestore } from '../lib/firebase';

interface MostaChatPluginProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  prefilledQuery?: string;
  patientName?: string;
}

export const MostaChatPlugin: React.FC<MostaChatPluginProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  prefilledQuery = '',
  patientName = 'المريض'
}) => {
  const [activeChannel, setActiveChannel] = useState<ChannelType>('web');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Initialize or fetch conversation
  useEffect(() => {
    async function initConversation() {
      const conv = await apiService.createOrFindPatientConversation(patientName, '+20 120 040 0094', activeChannel === 'whatsapp' ? 'whatsapp' : 'web');
      setMessages(conv.messages);

      if (prefilledQuery) {
        setInputText(prefilledQuery);
      }
    }

    if (isOpen) {
      initConversation();
    }
  }, [isOpen, activeChannel, patientName, prefilledQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  // Handle Voice Recording Simulation
  const startVoiceRecording = () => {
    setIsRecordingVoice(true);
    setVoiceSeconds(0);
    timerRef.current = setInterval(() => {
      setVoiceSeconds(s => s + 1);
    }, 1000);
  };

  const stopAndSendVoice = async () => {
    clearInterval(timerRef.current);
    setIsRecordingVoice(false);
    const duration = Math.max(1, voiceSeconds);

    const newMsg = await apiService.sendChatMessage(
      'c1',
      `تسجيل صوتي للمريض (${duration} ثانية)`,
      patientName,
      'voice',
      { audioDurationSeconds: duration }
    );

    setMessages(prev => [...prev, newMsg]);

    setTimeout(async () => {
      setIsAiThinking(true);
      const replyText = await apiService.getAiPharmacistResponse('استفسار صوتي من المريض حول الجرعات وصرف العلاج');
      setIsAiThinking(false);
      const responseMsg = await apiService.sendChatMessage(
        'c1',
        replyText,
        'د. مصطفى المرابعة (صيدلي إكلينيكي)',
        'text'
      );
      setMessages(prev => [...prev, responseMsg]);
    }, 1500);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    setInputText('');

    // 1. Send patient message
    const patientMsg = await apiService.sendChatMessage('c1', text, patientName, 'text');
    setMessages(prev => [...prev, patientMsg]);
    saveChatMessageToFirestore('c1', { id: patientMsg.id, sender: patientMsg.sender, text: patientMsg.text, timestamp: patientMsg.at });

    // 2. Trigger Pharmacist / AI response
    setIsAiThinking(true);
    const aiReply = await apiService.getAiPharmacistResponse(text, messages);
    setIsAiThinking(false);

    const pharmacistMsg = await apiService.sendChatMessage(
      'c1',
      aiReply,
      'د. مصطفى المرابعة (صيدلي إكلينيكي)',
      'text',
      { suggestedByAi: true }
    );
    setMessages(prev => [...prev, pharmacistMsg]);
    saveChatMessageToFirestore('c1', { id: pharmacistMsg.id, sender: pharmacistMsg.sender, text: pharmacistMsg.text, timestamp: pharmacistMsg.at });
  };

  const handleSimulatePrescriptionUpload = async () => {
    const sampleRxUrl = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60';
    const rxMsg = await apiService.sendChatMessage(
      'c1',
      'قام المريض برفع صورة روشتة طبية جديدة للفحص',
      patientName,
      'prescription',
      { prescriptionUrl: sampleRxUrl }
    );
    setMessages(prev => [...prev, rxMsg]);

    // Automated clinical review response from Dr. Mostafa
    setTimeout(async () => {
      const reviewMsg = await apiService.sendChatMessage(
        'c1',
        'أهلاً بك يا فندم! قمت بفحص صورة الروشتة المرفقة، والأدوية المطلوبة هي: (جافيسكون أكياس 24 كيس + هيلسيك 20 مجم 14 كبسولة). قمت بتجهيز عرض الطلب لتأكيده بضغطة واحدة.',
        'د. مصطفى المرابعة (صيدلي إكلينيكي)',
        'text'
      );
      setMessages(prev => [...prev, reviewMsg]);

      // Push order quote
      const quoteMsg = await apiService.sendChatMessage(
        'c1',
        'عرض سعر الطلبية MOS-1024 من صيدليات البنداري',
        'د. مصطفى المرابعة (صيدلي إكلينيكي)',
        'order_quote',
        {
          orderQuote: {
            orderId: 'MOS-1024',
            itemsSummary: 'جافيسكون 24 كيس + هيلسيك 20 مجم',
            totalEgp: 335.0,
            patientName: patientName
          }
        }
      );
      setMessages(prev => [...prev, quoteMsg]);
    }, 1800);
  };

  const handleAddQuoteToCart = () => {
    onAddToCart(catalogProducts[0], 1);
    onAddToCart(catalogProducts[1], 1);
    setToastMessage('تمت إضافة منتجات الروشتة المعتمدة (جافيسكون + هيلسيك) إلى سلة مشترياتك بنجاح!');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const quickChips = [
    'سؤال عن جرعة هيلسيك وجافيسكون',
    'فحص تعارض بنادول مع أدوية الضغط',
    'هل يتوفر بديل مصري أرخص؟',
    'متابعة طلب الروشتة MOS-1024',
    'استفسار عن تغطية التأمين الطبي'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full h-[92vh] max-h-[780px] shadow-2xl border border-slate-200 relative flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Pure Patient Support Header WITHOUT any staff portal button */}
        <div className="bg-gradient-to-r from-bendary-950 via-bendary-900 to-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <BendaryLogo size="sm" showText={false} />

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  استشارة صيدلي البنداري
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-500/30">
                  دعم مباشر 24/7
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5 font-light">
                <span className="font-semibold text-white">د. مصطفى المرابعة</span>
                <span>• رئيس الصيادلة الإكلينيكيين (متصل الآن)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:01200400094"
              className="bg-amber-400 text-bendary-950 font-bold px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 hover:bg-amber-300 transition"
              title="اتصال بالخط الساخن 01200400094"
            >
              <span className="font-mono text-[11px]">01200400094</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition"
              aria-label="إغلاق المحادثة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channel Selector Bar */}
        <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between border-b border-slate-800 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400">قناة التواصل:</span>
            <button
              onClick={() => setActiveChannel('web')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                activeChannel === 'web' ? 'bg-bendary-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>محادثة التطبيق</span>
            </button>
            <a
              href="https://wa.me/201200400094"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 text-emerald-400 hover:bg-slate-800"
            >
              <span>●</span>
              <span>واتساب (01200400094)</span>
            </a>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>استجابة فورية</span>
          </div>
        </div>

        {/* Clinical Disclaimer Pill */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-[11px] text-amber-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>استشارة صيدلانية معتمدة من صيدليات البنداري (رعاية من القلب - 46 سنة).</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">مشفر ومحمي</span>
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center animate-in slide-in-from-top-2 shrink-0 flex items-center justify-center gap-2 shadow">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70">
          {messages.map((msg) => {
            const isPatient = msg.direction === 'inbound';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
                  <span className="font-semibold text-slate-600">{msg.sender}</span>
                  <span>•</span>
                  <span>{new Date(msg.at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
                    isPatient
                      ? 'bg-gradient-to-r from-bendary-700 to-red-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Text Message */}
                  {msg.type === 'text' && (
                    <div className="whitespace-pre-line font-medium">{msg.text}</div>
                  )}

                  {/* Voice Note Bubble */}
                  {msg.type === 'voice' && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                        className={`p-2 rounded-full transition ${
                          isPatient ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>تسجيل صوتي</span>
                          <span className="text-[10px] opacity-80">({msg.audioDurationSeconds || 3} ثانية)</span>
                        </div>
                        {/* Audio Wave Bars */}
                        <div className="flex items-center gap-0.5 mt-1 h-3">
                          {[40, 70, 30, 90, 60, 45, 80, 50, 75, 30].map((h, i) => (
                            <span
                              key={i}
                              style={{ height: `${playingAudioId === msg.id ? (i % 2 === 0 ? 100 : 50) : h}%` }}
                              className={`w-1 rounded-full transition-all duration-150 ${
                                isPatient ? 'bg-white/80' : 'bg-emerald-500'
                              }`}
                            ></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Prescription Attachment Bubble */}
                  {msg.type === 'prescription' && (
                    <div className="space-y-2">
                      <p className="font-bold">{msg.text}</p>
                      {msg.prescriptionUrl && (
                        <div className="rounded-xl overflow-hidden border border-white/20">
                          <img
                            src={msg.prescriptionUrl}
                            alt="Prescription"
                            className="w-full h-36 object-cover"
                          />
                        </div>
                      )}
                      <span className="text-[10px] block opacity-80">تم التحقق وفحص البيانات بواسطة صيدلي البنداري</span>
                    </div>
                  )}

                  {/* Order Quote Card */}
                  {msg.type === 'order_quote' && msg.orderQuote && (
                    <div className="space-y-3 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-slate-800">
                      <div className="flex justify-between items-center border-b border-emerald-200 pb-1.5">
                        <span className="font-black text-emerald-900 text-xs flex items-center gap-1">
                          <Check className="w-4 h-4 text-emerald-600" />
                          عرض سعر جاهز للطلب ({msg.orderQuote.orderId})
                        </span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
                          معتمد صيدلانياً
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        <div className="text-slate-600">المحتويات: <strong>{msg.orderQuote.itemsSummary}</strong></div>
                        <div className="text-sm font-black text-bendary-800">
                          الإجمالي: {msg.orderQuote.totalEgp.toFixed(2)} ج.م
                        </div>
                      </div>

                      <button
                        onClick={handleAddQuoteToCart}
                        className="w-full bg-bendary-600 hover:bg-bendary-700 text-white font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 text-xs shadow-sm active:scale-95"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>إضافة محتويات الروشتة للسلة وإتمام الشراء</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Read receipt check */}
                <div className="px-1 text-[9px] text-slate-400 mt-0.5 flex items-center gap-0.5">
                  <CheckCheck className="w-3 h-3 text-emerald-500" />
                  <span>تمت القراءة</span>
                </div>
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isAiThinking && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 max-w-xs shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-bendary-600 animate-spin" />
              <span className="text-xs text-slate-600 font-medium">
                د. مصطفى المرابعة يقوم بمراجعة الاستشارة الطبية والجرعات...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[11px] shrink-0">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="bg-white hover:bg-bendary-50 text-slate-700 hover:text-bendary-700 px-2.5 py-1 rounded-full border border-slate-300 whitespace-nowrap transition shadow-2xs font-medium"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input & Voice Controls Section */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          {isRecordingVoice ? (
            /* Voice Recording UI */
            <div className="flex items-center justify-between p-2.5 bg-red-50 rounded-2xl border border-red-200 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
                <span>جاري تسجيل رسالة صوتية... {voiceSeconds} ثانية</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { clearInterval(timerRef.current); setIsRecordingVoice(false); }}
                  className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={stopAndSendVoice}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition"
                >
                  إرسال الصوت الآن
                </button>
              </div>
            </div>
          ) : (
            /* Normal Input Bar */
            <div className="flex items-center gap-2">
              {/* Attachment Button */}
              <button
                type="button"
                onClick={handleSimulatePrescriptionUpload}
                title="إرفاق صورة روشتة أو دواء"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Record Button */}
              <button
                type="button"
                onClick={startVoiceRecording}
                title="تسجيل رسالة صوتية للمريض"
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder="اكتب استفسارك الدوائي، أو اسأل عن دواء أو جرعة..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs focus:ring-2 focus:ring-bendary-500 focus:bg-white focus:outline-none"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-2.5 bg-bendary-600 hover:bg-bendary-700 disabled:bg-slate-300 text-white rounded-2xl shadow transition active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Clean Patient Footer */}
        <div className="bg-slate-950 text-slate-400 text-[10px] p-2.5 text-center border-t border-slate-800 leading-tight shrink-0 font-sans flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>صيدليات البنداري • رعاية من القلب - 46 سنة</span>
          </div>
          <div className="text-slate-400">
            الخط الساخن: <strong className="text-amber-300 font-mono">01200400094</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
