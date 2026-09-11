import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Target,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Send,
  Trash2,
  TrendingUp,
  Layers
} from 'lucide-react';
import { formatRupees } from '../../services/financialCalculationService';

export default function MarketingCampaignsView({
  profile,
  campaigns = [],
  budgetStatus,
  onCreateCampaign,
  onDeleteCampaign,
  onStatusChange
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('Acquire Customers');
  const [targetAudience, setTargetAudience] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [budget, setBudget] = useState('');
  const [selectedChannels, setSelectedChannels] = useState(['Instagram Ads', 'WhatsApp Direct']);
  const [offer, setOffer] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [cta, setCta] = useState('Order on WhatsApp');

  const channelOptions = [
    'WhatsApp Direct',
    'Instagram Ads',
    'Google Business Profile',
    'Facebook Groups',
    'Local Pamphlets / Flyers',
    'Counter QR Display',
    'Mandi Trade Kiosk'
  ];

  const objectiveOptions = [
    'Launch Business',
    'Acquire Customers',
    'Increase Sales',
    'Promote Product',
    'Increase Repeat Purchases',
    'Generate Leads',
    'Local Awareness',
    'Festival / Seasonal Promotion',
    'Referral Campaign'
  ];

  const handleChannelToggle = (ch) => {
    if (selectedChannels.includes(ch)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  // AI Autofill helper
  const handleAiAutoFill = () => {
    const bizName = profile?.business?.name || profile?.name || 'Our Enterprise';
    const product = profile?.business?.productService || 'Products';
    const maxAffordable = Math.min(budgetStatus.remainingBudget, Math.round(budgetStatus.totalMonthlyBudget * 0.35)) || 5000;

    setName(`Festive & Local Launch for ${bizName}`);
    setObjective('Acquire Customers');
    setTargetAudience('Local households and retail consumers within 5 km radius');
    setDurationDays(21);
    setBudget(String(maxAffordable));
    setSelectedChannels(['WhatsApp Direct', 'Instagram Ads', 'Google Business Profile']);
    setOffer('Flat 10% Off or Free Sample Box on First Order');
    setKeyMessage(`Experience farm-fresh authentic ${product} delivered same-day in your area.`);
    setCta('WhatsApp Us to Order');
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bNum = Number(budget);

    // CRITICAL SECTION 11 VALIDATION:
    if (isNaN(bNum) || bNum <= 0) {
      setErrorMsg('Please enter a valid campaign budget greater than ₹0.');
      return;
    }

    if (bNum > budgetStatus.remainingBudget) {
      setErrorMsg(`Insufficient available marketing budget. You have ${formatRupees(budgetStatus.remainingBudget)} uncommitted. You cannot allocate ${formatRupees(bNum)}.`);
      return;
    }

    const newCampaign = {
      id: `cmp_${Date.now()}`,
      name: name.trim() || 'New Marketing Campaign',
      objective,
      targetAudience: targetAudience.trim() || 'Local neighborhood customers',
      durationDays: Number(durationDays) || 30,
      budget: bNum,
      spent: 0,
      status: 'ACTIVE',
      channels: selectedChannels.length > 0 ? selectedChannels : ['WhatsApp Direct'],
      offer: offer.trim() || '10% Introductory Discount',
      keyMessage: keyMessage.trim() || 'High quality products now available locally.',
      cta: cta.trim() || 'Contact on WhatsApp',
      createdAt: new Date().toISOString(),
      metrics: {
        impressions: 0,
        clicks: 0,
        leads: 0,
        conversions: 0,
        cac: 0,
        revenueGenerated: 0
      }
    };

    onCreateCampaign(newCampaign);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setObjective('Acquire Customers');
    setTargetAudience('');
    setDurationDays(30);
    setBudget('');
    setSelectedChannels(['Instagram Ads', 'WhatsApp Direct']);
    setOffer('');
    setKeyMessage('');
    setCta('Order on WhatsApp');
    setErrorMsg('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header & Budget Capacity Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <Megaphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Campaign Operations & Delivery</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Marketing Campaigns
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Design, deploy, and monitor specific marketing initiatives governed strictly by your working capital budget.
          </p>
        </div>

        {/* Budget Room Meter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Remaining Budget for Campaigns</span>
            <strong className="text-lg font-black text-emerald-700 block mt-0.5">
              {formatRupees(budgetStatus.remainingBudget)}
            </strong>
            <span className="text-[10px] text-slate-500">of {formatRupees(budgetStatus.totalMonthlyBudget)} total</span>
          </div>

          <button
            onClick={() => {
              setIsModalOpen(true);
              setErrorMsg('');
            }}
            disabled={budgetStatus.remainingBudget <= 0}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 shadow-soft-sm max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Megaphone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">No campaigns launched yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                You haven't created your first campaign yet. Create a campaign to start acquiring verified customers.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500 transition-all"
            >
              Create Your First Campaign
            </button>
          </div>
        ) : (
          campaigns.map((cmp) => {
            const isLive = cmp.status === 'ACTIVE';
            return (
              <div
                key={cmp.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm space-y-4 transition-all hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <h3 className="text-base font-black text-slate-900">{cmp.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {cmp.objective}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isLive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cmp.status}
                    </span>

                    <button
                      onClick={() => onStatusChange(cmp.id, isLive ? 'PAUSED' : 'ACTIVE')}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      {isLive ? 'Pause' : 'Resume'}
                    </button>

                    <button
                      onClick={() => onDeleteCampaign(cmp.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details & Performance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Audience</span>
                    <p className="text-slate-800 font-semibold">{cmp.targetAudience}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Offer & Message</span>
                    <p className="text-slate-800 font-semibold truncate" title={cmp.offer}>{cmp.offer}</p>
                    <p className="text-[11px] text-slate-500 truncate" title={cmp.keyMessage}>{cmp.keyMessage}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Budget & Spend</span>
                    <p className="text-slate-900 font-extrabold">{formatRupees(cmp.budget)} Budget</p>
                    <p className="text-[11px] text-slate-500">Spent: {formatRupees(cmp.spent || 0)} ({cmp.durationDays} days)</p>
                  </div>

                  <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Output</span>
                    <div className="flex items-center justify-between text-slate-800">
                      <span>Leads: <strong>{cmp.metrics?.leads || 0}</strong></span>
                      <span>Orders: <strong className="text-emerald-700">{cmp.metrics?.conversions || 0}</strong></span>
                    </div>
                    {cmp.metrics?.revenueGenerated > 0 && (
                      <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">
                        Rev: {formatRupees(cmp.metrics.revenueGenerated)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Channel badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cmp.channels.map((ch, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* + CREATE CAMPAIGN MODAL (With Strict Section 11 Budget Validation) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-lg font-black text-slate-900">Create New Marketing Campaign</h3>
                <p className="text-xs text-slate-500">
                  Remaining unallocated budget: <strong className="text-emerald-700">{formatRupees(budgetStatus.remainingBudget)}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiAutoFill}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Auto-Fill</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Validation Warning Alert (Section 11) */}
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-bold text-xs">{errorMsg}</span>
                </div>
              )}

              {/* Campaign Name & Objective */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Campaign Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Local Festival Sample Blitz"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Campaign Objective</label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  >
                    {objectiveOptions.map((obj) => (
                      <option key={obj} value={obj}>{obj}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Campaign Budget (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      min="100"
                      max={budgetStatus.remainingBudget}
                      value={budget}
                      onChange={(e) => {
                        setBudget(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder={`Max: ${budgetStatus.remainingBudget}`}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Available: {formatRupees(budgetStatus.remainingBudget)} from working capital.
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              {/* Channels Picker */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Execution Channels</label>
                <div className="flex flex-wrap gap-1.5">
                  {channelOptions.map((ch) => {
                    const active = selectedChannels.includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => handleChannelToggle(ch)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{ch}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Local residential communities & retail shopkeepers within 5 km"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              {/* Offer & Message */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Offer / Incentive</label>
                  <input
                    type="text"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    placeholder="e.g. 10% Off or Free Sample with first order"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Call to Action (CTA)</label>
                  <input
                    type="text"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="e.g. Order on WhatsApp / Call Now"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Key Message Copy</label>
                <textarea
                  rows="2"
                  value={keyMessage}
                  onChange={(e) => setKeyMessage(e.target.value)}
                  placeholder="e.g. Fresh farm-direct quality delivered in your town."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black transition-all shadow-md text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Launch Campaign</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
