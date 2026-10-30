'use client';

import React from 'react';
import { ExecutiveSummaryCards } from './ExecutiveSummaryCards';
import { MaturityStageCurve } from './MaturityStageCurve';
import { HouseOfProcurement } from './HouseOfProcurement';
import { StrategicPartitionBarChart } from './StrategicPartitionBarChart';
import { MultiViewRadars } from './MultiViewRadars';
import { useAssessment } from '@/context/AssessmentContext';
import { ArrowRight, Sparkles, AlertCircle, CheckCircle2, Target } from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const { profile, overallResult, setActiveTab, setActivePartitionId, setActiveAFId } = useAssessment();

  // Find functions with biggest gaps
  const topGaps = Object.values(overallResult.afScores)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Summary */}
      <ExecutiveSummaryCards />

      {/* 2. Final Maturity 5-Stage Visual Curve & Concentric Rings */}
      <MaturityStageCurve />

      {/* 3. The House of 15M Maturity Assessment Architecture */}
      <HouseOfProcurement />

      {/* 4. Charts Grid: SP Bar Chart & Multi-View Radars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategicPartitionBarChart />
        <MultiViewRadars />
      </div>

      {/* 4. Bottom Insights: Top Gaps & Immediate Transformation Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Transformation Gaps */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Top Strategic Opportunity Gaps</h3>
              <p className="text-xs text-slate-500">Functions with the highest gap between As-Is and Plan</p>
            </div>
            <button
              onClick={() => setActiveTab('tables')}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
            >
              <span>View all matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topGaps.map((af) => (
              <div
                key={af.afId}
                onClick={() => {
                  setActivePartitionId(af.partitionId);
                  setActiveAFId(af.afId);
                  setActiveTab('assessment');
                }}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-teal-900 flex items-center gap-2">
                    <span className="font-mono text-teal-700">{af.code}</span>
                    <span>{af.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {af.partitionId} • Module {af.moduleId}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">As-Is / Plan</span>
                    <span className="font-bold text-slate-700">{af.asIs}% → {af.plan}%</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
                    +{af.gap}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Improvement Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Priority Improvement Actions</h3>
              <p className="text-xs text-slate-500">Active initiatives across Strategic Partitions</p>
            </div>
            <button
              onClick={() => setActiveTab('assessment')}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
            >
              <span>Manage actions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {profile.actions.length === 0 ? (
              <div className="text-xs text-slate-400 italic p-4 text-center">
                No improvement actions recorded yet.
              </div>
            ) : (
              profile.actions.map((act, idx) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex items-start justify-between text-xs gap-3"
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800 leading-snug">{act.title}</div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-3">
                        <span>Owner: <strong className="text-slate-700">{act.owner}</strong></span>
                        <span>Due: <strong className="text-slate-700">{act.targetDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 font-bold text-[10px] px-2 py-0.5 rounded ${
                      act.priority === 'Critical'
                        ? 'bg-rose-100 text-rose-700'
                        : act.priority === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {act.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
