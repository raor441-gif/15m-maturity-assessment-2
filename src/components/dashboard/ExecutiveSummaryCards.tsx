'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import {
  TrendingUp,
  Target,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Sparkles,
  Zap,
  HelpCircle
} from 'lucide-react';

export const ExecutiveSummaryCards: React.FC = () => {
  const { overallResult, profile } = useAssessment();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Overall Maturity Score */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden group hover:border-teal-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Overall Maturity Score
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {overallResult.asIs}%
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            Stage {overallResult.stageNumber}: {overallResult.stageName}
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500 line-clamp-2">
          Weighted: 25% SP1–3, 15% SP4, 10% SP5 across all evaluated dimensions.
        </p>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Formula: Authoritative Recovered</span>
          <span className="text-teal-600 font-semibold">Active</span>
        </div>
      </div>

      {/* 2. Target Plan */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden group hover:border-blue-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Overall Target Plan
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-blue-900 tracking-tight">
            {overallResult.plan}%
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Target Horizon
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Dynamic question-level planning targets (replaces flat 80% default).
        </p>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Target Stage: Top Class Sourcing</span>
          <span className="text-blue-600 font-semibold">Stage 4</span>
        </div>
      </div>

      {/* 3. Strategic Gap */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden group hover:border-emerald-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Strategic Value Gap
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">
            +{overallResult.gap}%
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Potential Uplift
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Net headroom to reach target world-class sourcing posture.
        </p>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Active Improvement Actions</span>
          <span className="text-emerald-700 font-bold">{profile.actions.length} items</span>
        </div>
      </div>

      {/* 4. Assessment Progress & Mode */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden group hover:border-purple-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Assessment Coverage
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {overallResult.completionRate}%
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            {overallResult.completedAFs} of {overallResult.totalAFs} AFs
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Evaluation mode: <span className="font-semibold text-slate-700">{profile.mode === 'comprehensive' ? '3-Dimension Deep Audit' : '15M Quick Check'}</span>
        </p>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Dynamic Denominator</span>
          <span className="text-purple-600 font-semibold">Enabled</span>
        </div>
      </div>
    </div>
  );
};
