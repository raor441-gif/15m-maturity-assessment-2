'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { ASSESSMENT_FUNCTIONS } from '@/data/configuration';
import { StrategicCycle } from '@/types';
import { Target, Search, Compass, ShieldCheck, ArrowRight } from 'lucide-react';

export const StrategicCycleView: React.FC = () => {
  const { overallResult, setActiveAFId, setActivePartitionId, setActiveTab } = useAssessment();

  const cycleInfo: Record<
    StrategicCycle,
    { title: string; subtitle: string; icon: any; color: string; desc: string }
  > = {
    Zi: {
      title: 'Target Formulation (Ziel)',
      subtitle: 'Zi • 25% Weight',
      icon: Target,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      desc: 'Defining procurement goals, corporate targets alignment, cost roadmaps, ESG targets, and supplier objectives.',
    },
    An: {
      title: 'Analysis & Baselines (Analyse)',
      subtitle: 'An • 25% Weight',
      icon: Search,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      desc: 'Spend transparency, market intelligence, category baseline definitions, and past supplier performance evaluations.',
    },
    Au: {
      title: 'Strategic Alignment (Ausrichtung)',
      subtitle: 'Au • 25% Weight',
      icon: Compass,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      desc: 'Category strategy development, supplier classification pyramid, SRM joint roadmaps, and digital architecture.',
    },
    St: {
      title: 'Governance & Control (Steuerung)',
      subtitle: 'St • 25% Weight',
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      desc: 'P2P touchless execution, savings auditing with controlling, executive KPI cockpits, and continuous improvement.',
    },
  };

  const cycles: StrategicCycle[] = ['Zi', 'An', 'Au', 'St'];

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800">The 4-Stage Strategic Cycle</h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          The recovered scoring model reveals a core 4-fold strategic classification cutting across all Strategic Partitions:
          <span className="font-semibold text-slate-800"> Target (Zi)</span>,{' '}
          <span className="font-semibold text-slate-800">Analysis (An)</span>,{' '}
          <span className="font-semibold text-slate-800">Alignment (Au)</span>, and{' '}
          <span className="font-semibold text-slate-800">Control (St)</span>, weighted at 25% each.
        </p>

        {/* 4 Cards Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {cycles.map((c) => {
            const info = cycleInfo[c];
            const score = overallResult.cycleScores[c];
            const Icon = info.icon;

            return (
              <div
                key={c}
                className="p-5 rounded-xl border bg-slate-50/50 border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`p-2 rounded-lg border ${info.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      25% Weight
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-800 mt-3">{info.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{info.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">As-Is Score</div>
                    <div className="text-xl font-extrabold text-teal-800">{score?.asIs ?? 0}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Target</div>
                    <div className="text-xs font-bold text-blue-700">{score?.plan ?? 80}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown per Cycle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cycles.map((c) => {
          const info = cycleInfo[c];
          const afs = ASSESSMENT_FUNCTIONS.filter((af) => af.cycle === c);

          return (
            <div key={c} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className={`p-1.5 rounded-md border ${info.color}`}>
                    <info.icon className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-sm text-slate-800">{info.title}</h3>
                </div>
                <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {overallResult.cycleScores[c]?.asIs ?? 0}%
                </span>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {afs.map((af) => {
                  const s = overallResult.afScores[af.id];
                  return (
                    <div
                      key={af.id}
                      onClick={() => {
                        setActivePartitionId(af.partitionId);
                        setActiveAFId(af.id);
                        setActiveTab('assessment');
                      }}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="font-mono font-bold text-teal-700">{af.code}</span>
                        <span className="font-medium text-slate-700 truncate">{af.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="font-bold text-slate-800">{s?.asIs ?? 0}%</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
