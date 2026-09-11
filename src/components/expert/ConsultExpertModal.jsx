import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Phone,
  Video,
  Calendar,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  Check,
  MessageSquare,
  Award,
  BadgePercent,
  Briefcase,
  AlertCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useEntrepreneurProfile } from '../../context/EntrepreneurProfileContext';
import { sendAdvisorMessage } from '../../services/aiAdvisorService';

export default function ConsultExpertModal({
  isOpen,
  onClose,
  expert,
  initialTab = 'profile' // 'profile' | 'chat' | 'book'
}) {
  const { profile } = useEntrepreneurProfile();
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('03:30 PM');
  const [callMode, setCallMode] = useState('phone'); // 'phone' | 'video'
  const [userPhone, setUserPhone] = useState(profile?.personalInfo?.phone || '');
  const [consultNote, setConsultNote] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync tab when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Initialize welcome message if empty
      if (messages.length === 0 && expert) {
        setMessages([
          {
            id: 'msg_welcome',
            sender: 'expert',
            text: expert.welcomeMessage(profile),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }
  }, [isOpen, initialTab, expert, profile]);

  // Scroll to bottom on chat update
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isTyping]);

  if (!isOpen || !expert) return null;

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const id = `UDYAM-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingId(id);
    setIsBooked(true);
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Formulate expert persona guidance
      const personaPrompt = expert.domain === 'funding'
        ? `You are ${expert.name}, a senior Chartered Accountant (FCA) and MSME Banking DPR specialist. The entrepreneur is asking: "${text}". Provide practical, encouraging, step-by-step financial advice regarding bank loans, DPR, CGTMSE, or PMEGP subsidies. Remind them gently that their first 15-min discovery call is free.`
        : `You are ${expert.name}, an MBA from IIM Calcutta and Senior Business Strategy Analyst. The entrepreneur is asking: "${text}". Provide razor-sharp, actionable guidance on market positioning, unit economics, local competition, or distribution channels. Remind them gently that their first 15-min strategy call is free.`;

      const aiResponse = await sendAdvisorMessage({
        message: personaPrompt,
        history: messages.slice(-4),
        profile: profile || {}
      });

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `exp_${Date.now()}`,
            sender: 'expert',
            text: aiResponse?.reply || expert.suggestedResponses?.[text] || `Thank you for sharing that question regarding "${text}". Based on your active business profile, I recommend structuring this systematically. Would you like to schedule our complimentary 15-minute 1-on-1 call so I can review your exact numbers with you directly?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, 750);
    } catch (err) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `exp_${Date.now()}`,
            sender: 'expert',
            text: `Great question regarding your ${expert.domain === 'funding' ? 'project financing' : 'business strategy'}. Based on my experience with MSMEs in your sector, prioritizing clean documentation and verified cost estimates is key. Let's discuss your specific numbers during our free 15-minute consultation!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, 600);
    }
  };

  const isFunding = expert.domain === 'funding';
  const themeBg = isFunding ? 'bg-emerald-600' : 'bg-indigo-600';
  const themeText = isFunding ? 'text-emerald-700' : 'text-indigo-700';
  const themeBadge = isFunding ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-indigo-50 text-indigo-800 border-indigo-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl ${expert.avatarBg} text-white font-black text-base flex items-center justify-center shadow-md`}>
                {expert.avatarInitials}
              </div>
              {expert.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Online now" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">{expert.name}</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Expert</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">{expert.role}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transparent Fee & Complimentary First Call Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-b border-amber-200/80 px-5 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
              🎁
            </div>
            <div>
              <span className="font-extrabold text-slate-900">First Call is 100% FREE</span>
              <span className="text-slate-600 hidden sm:inline"> — 15-minute 1-on-1 discovery consultation.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-bold text-slate-700">
            <span className="bg-white/90 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
              Subsequent: <strong className="text-slate-900">{expert.fees.standardPrice}</strong> / 30 mins
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 sm:px-6 bg-white gap-3 pt-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? `border-slate-900 text-slate-900 font-extrabold`
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Profile & Book Call</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? `border-slate-900 text-slate-900 font-extrabold`
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with Expert</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        {/* Tab 1: Profile & Consultation Booking */}
        {activeTab === 'profile' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
                <strong className="text-slate-900 text-sm font-extrabold">{expert.experience}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Client Rating</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <strong className="text-slate-900 text-sm font-extrabold">{expert.rating}</strong>
                  <span className="text-[10px] text-slate-400">({expert.reviewsCount})</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultations</span>
                <strong className="text-slate-900 text-sm font-extrabold">{expert.consultationsCompleted}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Languages</span>
                <strong className="text-slate-900 text-xs font-bold truncate block mt-0.5">
                  {expert.languages.join(', ')}
                </strong>
              </div>
            </div>

            {/* Bio */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold">
                <Briefcase className="w-4 h-4 text-slate-600" />
                <span>Professional Background</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">{expert.bio}</p>
              <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                <strong>Credentials:</strong> {expert.qualification} • {expert.regNumber}
              </div>
            </div>

            {/* Areas of Expertise */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                Specialized Competencies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {expert.specialties.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation Fee Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Consultation Packages & Fees
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {expert.fees.guarantee}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Free Tier */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-400/80 space-y-2 relative">
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider">
                    Recommended First
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-black text-emerald-950 block">Discovery Call</strong>
                      <span className="text-[11px] text-emerald-700 font-semibold">{expert.fees.firstCallDuration} Duration</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-emerald-700">₹0</span>
                      <span className="text-[10px] text-emerald-800 font-bold block uppercase">100% Free</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Personal review of your business requirements, loan or strategy feasibility check, and tailored action recommendations.
                  </p>
                </div>

                {/* Standard Tier */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">In-Depth Consultation</strong>
                      <span className="text-[11px] text-slate-500 font-semibold">{expert.fees.standardDuration}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-slate-900">{expert.fees.standardPrice}</span>
                      <span className="text-[10px] text-slate-400 block">per session</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Line-by-line financial model audit, DPR draft refinement, or detailed hyper-local market expansion plan.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form or Success State */}
            {!isBooked ? (
              <form onSubmit={handleBookSubmit} className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white">Schedule Your Free 15-Min Call</h4>
                    <p className="text-slate-400 text-[11px]">No payment or credit card required. Free discovery session.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-[10px] uppercase">
                    Fee: ₹0
                  </span>
                </div>

                {/* Day selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300">Select Date:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Today', 'Tomorrow', 'Day After'].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setSelectedDate(d)}
                        className={`p-2 rounded-xl text-xs font-bold text-center border transition-all ${
                          selectedDate === d
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300">Select Time Slot:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['11:00 AM', '02:30 PM', '04:45 PM', '06:30 PM'].map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-xl text-xs font-bold text-center border transition-all ${
                          selectedSlot === slot
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Call mode */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300">Preferred Mode:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCallMode('phone')}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                        callMode === 'phone'
                          ? 'bg-white text-slate-900 border-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Direct Phone Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCallMode('video')}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                        callMode === 'video'
                          ? 'bg-white text-slate-900 border-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Google Meet Video</span>
                    </button>
                  </div>
                </div>

                {/* Phone & note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Mobile Number:</label>
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Topic / What to Discuss:</label>
                    <input
                      type="text"
                      value={consultNote}
                      onChange={(e) => setConsultNote(e.target.value)}
                      placeholder="e.g. PMEGP loan subsidy, Bank DPR"
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Free 15-Minute Consultation (₹0)</span>
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-base font-black text-emerald-950">Free Consultation Confirmed!</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Your appointment with <strong>{expert.name}</strong> has been scheduled for <strong>{selectedDate} at {selectedSlot}</strong>.
                  </p>
                </div>

                <div className="inline-block p-2.5 rounded-xl bg-white border border-emerald-200 text-xs font-mono font-bold text-slate-800">
                  Booking ID: {bookingId}
                </div>

                <p className="text-[11px] text-slate-600 max-w-md mx-auto">
                  A confirmation SMS & calendar invite will be sent to <strong>{userPhone}</strong>. You can also chat with the expert right away.
                </p>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Live Chat Now</span>
                  </button>
                  <button
                    onClick={() => setIsBooked(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Chat with Expert */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-[420px] max-h-[580px] bg-slate-50/50">
            
            {/* Quick Status Bar */}
            <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs px-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-slate-700">{expert.name} is online</span>
                <span className="text-slate-400 text-[11px]">• {expert.typicalResponseTime}</span>
              </div>

              <button
                onClick={() => setActiveTab('profile')}
                className="text-emerald-700 font-bold hover:underline text-[11px] flex items-center gap-1"
              >
                <span>Book Free Call</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 text-xs">
              {messages.map((msg) => {
                const isMe = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <div className={`w-7 h-7 rounded-xl ${expert.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm mt-0.5`}>
                        {expert.avatarInitials}
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl space-y-1 ${
                        isMe
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px]">
                        <strong className={isMe ? 'text-slate-300' : 'text-slate-900 font-black'}>
                          {isMe ? 'You' : expert.name}
                        </strong>
                        <span className={isMe ? 'text-slate-400' : 'text-slate-400'}>{msg.timestamp}</span>
                      </div>

                      <div className="whitespace-pre-line leading-relaxed text-xs">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-[11px] p-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                  <span>{expert.name} is writing guidance...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 px-1">
                Suggested Questions:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {expert.suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 border border-slate-200 text-[11px] font-semibold text-slate-700 whitespace-nowrap transition-all text-left"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ask ${expert.name} about your ${expert.domain === 'funding' ? 'project financing, DPR, or loans' : 'market strategy, margins, or competitors'}...`}
                  className="flex-1 p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
