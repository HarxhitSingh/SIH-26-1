import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  Layers,
  ChevronRight,
  Filter,
  Check,
  X
} from 'lucide-react';
import { formatRupees } from '../../services/financialCalculationService';

export default function MarketingRoadmapView({
  roadmap = [],
  taskStatuses = {},
  onToggleTaskStatus
}) {
  const [selectedPhase, setSelectedPhase] = useState('ALL'); // 'ALL' | 1 | 2 | 3 | 4

  const filteredPhases = selectedPhase === 'ALL'
    ? roadmap
    : roadmap.filter((p) => p.phase === Number(selectedPhase));

  // Compute progress
  let totalTasks = 0;
  let completedCount = 0;
  roadmap.forEach((phase) => {
    phase.tasks.forEach((t) => {
      totalTasks++;
      const s = taskStatuses[t.id] || t.defaultStatus;
      if (s === 'COMPLETED') completedCount++;
    });
  });

  const percentComplete = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header & Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Structured Execution Timeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            100-Day Marketing Roadmap
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            From Day 0 foundation and local launch to sustainable customer repeat cycles and regional expansion.
          </p>
        </div>

        {/* Overall Progress Meter */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shrink-0 text-left sm:text-right space-y-1.5 w-full sm:w-60">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Overall Roadmap</span>
            <span className="text-emerald-700 font-black">{percentComplete}% Done</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block">
            {completedCount} of {totalTasks} milestones achieved
          </span>
        </div>
      </div>

      {/* Phase Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedPhase('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedPhase === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All 100 Days (4 Phases)
        </button>

        {roadmap.map((phase) => (
          <button
            key={phase.phase}
            onClick={() => setSelectedPhase(phase.phase)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedPhase === phase.phase
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Phase {phase.phase}: {phase.name} ({phase.days})
          </button>
        ))}
      </div>

      {/* Phases Stream */}
      <div className="space-y-6">
        {filteredPhases.map((phase) => (
          <div
            key={phase.phase}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-5"
          >
            {/* Phase Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase">
                    Phase {phase.phase}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{phase.name}</h3>
                  <span className="text-xs font-bold text-slate-400">• {phase.days}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{phase.focus}</p>
              </div>
            </div>

            {/* Phase Task Cards Grid */}
            <div className="space-y-3">
              {phase.tasks.map((task) => {
                const status = taskStatuses[task.id] || task.defaultStatus || 'PENDING';
                const isCompleted = status === 'COMPLETED';
                const isSkipped = status === 'SKIPPED';
                const isInProgress = status === 'IN_PROGRESS';

                return (
                  <div
                    key={task.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : isSkipped
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : isInProgress
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 max-w-2xl">
                      <button
                        onClick={() => onToggleTaskStatus(task.id, isCompleted ? 'PENDING' : 'COMPLETED')}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'border-2 border-slate-300 hover:border-emerald-600 text-transparent'
                        }`}
                        title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {task.day}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {task.channel}
                          </span>
                          {task.estimatedCost > 0 && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                              Est: {formatRupees(task.estimatedCost)}
                            </span>
                          )}
                        </div>

                        <h4 className={`text-xs sm:text-sm font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {task.task}
                        </h4>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          <strong>Expected Deliverable:</strong> {task.expectedOutcome}
                        </p>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => onToggleTaskStatus(task.id, isCompleted ? 'PENDING' : 'COMPLETED')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isCompleted ? 'Completed ✓' : 'Mark Complete'}
                      </button>

                      {!isCompleted && (
                        <button
                          onClick={() => onToggleTaskStatus(task.id, isSkipped ? 'PENDING' : 'SKIPPED')}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                        >
                          {isSkipped ? 'Unskip' : 'Skip'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
