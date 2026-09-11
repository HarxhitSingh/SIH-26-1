import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  PieChart,
  Zap,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Award
} from 'lucide-react';
import { formatRupees } from '../../services/financialCalculationService';

export default function MarketingAnalyticsView({ campaigns = [], experiments = [] }) {
  const hasLiveMetrics = campaigns.some((c) => (c.metrics?.conversions || 0) > 0);

  // Aggregate metrics
  const totalSpend = campaigns.reduce((sum, c) => sum + (c.spent || 0), 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + (c.metrics?.conversions || 0), 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.metrics?.leads || 0), 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.metrics?.revenueGenerated || 0), 0);
  const overallCac = totalConversions > 0 ? Math.round(totalSpend / totalConversions) : 0;
  const overallRoi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Customer Performance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Marketing Analytics & A/B Experiments
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Real performance tracking of conversions, customer acquisition cost (CAC), and channel return on investment.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start md:self-center">
          {hasLiveMetrics ? 'Live Campaign Tracking Active' : 'No campaign performance data yet'}
        </span>
      </div>

      {/* Primary Metrics Grid (Section 16) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Marketing Spend</span>
          <strong className="text-2xl font-black text-slate-900 block">
            {formatRupees(totalSpend)}
          </strong>
          <span className="text-[10px] text-slate-400">Recorded across active runs</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Paying Customers Acquired</span>
          <strong className="text-2xl font-black text-emerald-700 block">
            {hasLiveMetrics ? totalConversions : '0'}
          </strong>
          <span className="text-[10px] text-slate-400">Direct verified orders</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg. CAC (Acquisition Cost)</span>
          <strong className="text-2xl font-black text-indigo-950 block">
            {hasLiveMetrics ? `₹${overallCac}` : '—'}
          </strong>
          <span className="text-[10px] text-slate-400">Spend per new customer</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Revenue Generated & ROI</span>
          <strong className="text-2xl font-black text-slate-900 block">
            {hasLiveMetrics ? formatRupees(totalRevenue) : '—'}
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold">
            {hasLiveMetrics ? `${overallRoi}x Net Marketing ROI` : 'Calculated after orders'}
          </span>
        </div>
      </div>

      {/* Section 18: Marketing Experiments (A/B Testing) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold mb-1">
              <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
              <span>Scientific Growth Testing</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              A/B Marketing Experiments
            </h3>
            <p className="text-xs text-slate-500">
              Test two offers or channels simultaneously with micro-budgets to determine the highest converting approach.
            </p>
          </div>
        </div>

        {experiments.map((exp) => (
          <div key={exp.id} className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-slate-900">{exp.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Hypothesis: {exp.hypothesis}</p>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 self-start sm:self-auto">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                <span>Winner: {exp.winningVariant}</span>
              </span>
            </div>

            {/* Side-by-side Variant Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900">{exp.variantA.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100">{exp.variantA.channel}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Spend</span>
                    <strong className="text-xs">{formatRupees(exp.variantA.spend)}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Orders</span>
                    <strong className="text-xs">{exp.variantA.conversions}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Revenue</span>
                    <strong className="text-xs">{formatRupees(exp.variantA.revenue)}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border-2 border-emerald-400/80 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-950 font-black">{exp.variantB.name} (Winner)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">{exp.variantB.channel}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 bg-white rounded-lg border border-emerald-200">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Spend</span>
                    <strong className="text-xs">{formatRupees(exp.variantB.spend)}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Orders</span>
                    <strong className="text-xs text-emerald-700">{exp.variantB.conversions}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Revenue</span>
                    <strong className="text-xs text-emerald-700">{formatRupees(exp.variantB.revenue)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-emerald-900 block mb-0.5 font-bold">AI Analytical Finding:</strong>
              {exp.aiAnalysis}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
