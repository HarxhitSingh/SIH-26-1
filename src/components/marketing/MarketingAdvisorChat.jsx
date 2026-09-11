import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  User,
  Zap,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { sendAdvisorMessage } from '../../services/aiAdvisorService';
import { formatRupees } from '../../services/financialCalculationService';

export default function MarketingAdvisorChat({
  profile,
  strategy,
  budgetStatus,
  campaigns = []
}) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const business = profile?.business || profile || {};
  const bizName = business.name || 'Your Enterprise';
  const location = profile?.personalInfo?.district ? `${profile.personalInfo.district}, ${profile.personalInfo.state}` : 'your area';

  const defaultPrompts = [
    'I only have ₹5,000 left this month. What should I do?',
    'My Instagram campaign isn’t converting into paying customers.',
    'What low-cost channel should I advertise on this week?',
    'How do I create a high-converting local festive campaign?'
  ];

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg_welcome',
          sender: 'ai',
          text: `Namaste! I am your **AI Marketing Advisor** for **${bizName}**.\n\n` +
            `I have direct visibility into your **${formatRupees(budgetStatus.totalMonthlyBudget)}** monthly marketing allocation from Working Capital, your **${campaigns.length} active campaigns**, and your local target market in **${location}**.\n\n` +
            `Ask me anything about improving customer acquisition, troubleshooting ad spend, or writing high-converting local offers!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [bizName, budgetStatus.totalMonthlyBudget, campaigns.length, location]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
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
      const marketingContext = `The user is asking: "${text}".
Business: ${bizName} (${business.sector || 'General'})
Location: ${location}
Monthly Marketing Budget from Working Capital: ${formatRupees(budgetStatus.totalMonthlyBudget)}
Remaining uncommitted budget: ${formatRupees(budgetStatus.remainingBudget)}
Active campaigns: ${campaigns.map((c) => `${c.name} (Budget: ${c.budget})`).join(', ') || 'None'}
Provide sharp, realistic, budget-aware marketing advice. Never recommend spending more than their remaining budget.`;

      const aiResponse = await sendAdvisorMessage({
        message: marketingContext,
        history: messages.slice(-4),
        profile: profile || {}
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: aiResponse?.reply || `Based on your remaining marketing budget of ${formatRupees(budgetStatus.remainingBudget)} for ${bizName}, focus on direct high-intent channels. Using WhatsApp broadcasts with an introductory free tasting sample or bundle offer will yield the lowest CAC without bidding in expensive online auctions.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: `For ${bizName} with ${formatRupees(budgetStatus.remainingBudget)} available marketing capital, prioritize your existing buyers first. A direct WhatsApp follow-up asking for Google reviews and offering a 10% re-order incentive delivers the highest return per rupee spent.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-sm overflow-hidden flex flex-col h-[640px] animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">Ask Your Marketing Advisor</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500">
              Grounded in your {formatRupees(budgetStatus.totalMonthlyBudget)} marketing budget & campaigns
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          Budget Aware
        </span>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/30 text-xs">
        {messages.map((msg) => {
          const isMe = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl space-y-1 ${
                  isMe
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-soft-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px]">
                  <strong className={isMe ? 'text-slate-300' : 'text-slate-900 font-bold'}>
                    {isMe ? 'You' : 'Marketing Advisor'}
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
            <span>Formulating marketing strategy...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 px-1">
          Quick Questions:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {defaultPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 border border-slate-200 text-[11px] font-semibold text-slate-700 whitespace-nowrap transition-all text-left"
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything about marketing, ad budgeting, offers, or customer acquisition..."
            className="flex-1 p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

    </div>
  );
}
