import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  MessageSquare,
  FileText,
  Megaphone,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { generateContentStudio } from '../../services/marketing/marketingEngine';

export default function MarketingContentStudio({ profile }) {
  const content = generateContentStudio(profile);
  const [activeCategory, setActiveCategory] = useState('social'); // 'social' | 'ads' | 'comms'
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Copywriting & Creative Assets</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            AI Content Studio
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Pre-tailored marketing copy, video scripts, ad headlines, and customer WhatsApp templates built using your real business profile.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex bg-slate-100 p-1 rounded-2xl self-start sm:self-center text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveCategory('social')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeCategory === 'social' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Social Media
          </button>
          <button
            onClick={() => setActiveCategory('ads')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeCategory === 'ads' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Advertising & Posters
          </button>
          <button
            onClick={() => setActiveCategory('comms')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeCategory === 'comms' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Care & WhatsApp
          </button>
        </div>
      </div>

      {/* Social Media Content Category */}
      {activeCategory === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {content.socialMedia.map((item, idx) => {
            const copyKey = `social_${idx}`;
            const fullText = `${item.content}\n\n${item.hashtags || ''}`;
            const isCopied = copiedKey === copyKey;

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {item.type}
                    </span>

                    <button
                      onClick={() => handleCopy(fullText, copyKey)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied!' : 'Copy Copy'}</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 mb-2">{item.headline}</h4>
                  <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 font-sans">
                    {item.content}
                  </div>

                  {item.hashtags && (
                    <p className="text-[11px] text-emerald-700 font-semibold mt-2 break-words">
                      {item.hashtags}
                    </p>
                  )}

                  {item.audioTip && (
                    <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                      <strong>Creator Tip:</strong> {item.audioTip}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Advertising Category */}
      {activeCategory === 'ads' && (
        <div className="space-y-4">
          {content.advertising.map((ad, idx) => {
            const copyKey = `ad_${idx}`;
            const textToCopy = `${ad.headline}\n\n${ad.primaryText || ad.bodyText}\n\nCTA: ${ad.cta || ad.contactDetails || ''}`;
            const isCopied = copiedKey === copyKey;

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {ad.type}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{ad.headline}</h4>
                  </div>

                  <button
                    onClick={() => handleCopy(textToCopy, copyKey)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Ad Copy'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                  {ad.primaryText || ad.bodyText}
                </p>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-slate-500">
                    Call To Action: <strong className="text-slate-900">{ad.cta || 'Contact Business'}</strong>
                  </span>
                  {ad.contactDetails && (
                    <span className="text-[11px] text-slate-400">{ad.contactDetails}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Communication Category */}
      {activeCategory === 'comms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.customerCommunication.map((msg, idx) => {
            const copyKey = `comm_${idx}`;
            const isCopied = copiedKey === copyKey;

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                    <span className="text-[10px] font-black uppercase text-emerald-700">
                      {msg.type}
                    </span>

                    <button
                      onClick={() => handleCopy(msg.message, copyKey)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                    Timing: {msg.trigger}
                  </span>

                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                    {msg.message}
                  </p>
                </div>

                <div className="pt-2 text-[10px] font-bold text-slate-400">
                  Ready to send via WhatsApp Web / App
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
