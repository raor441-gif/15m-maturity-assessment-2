'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { MODULES } from '@/data/configuration';

export const MultiViewRadars: React.FC = () => {
  const { overallResult } = useAssessment();
  const [activeRadarTab, setActiveRadarTab] = useState<'modules' | 'partitions' | 'cycle' | 'afs'>('modules');

  // 1. Module Radar Data (M1 - M15)
  const moduleData = MODULES.map((m) => {
    const score = overallResult.moduleScores[m.id];
    return {
      subject: m.code,
      fullName: m.name,
      asIs: score ? score.asIs : 0,
      plan: score ? score.plan : 80,
    };
  });

  // 2. Strategic Partition Radar Data (SP1 - SP5)
  const partitionData = [
    { subject: 'SP1 Framework', fullName: 'Framework Strategy', asIs: overallResult.spScores.SP1.asIs, plan: overallResult.spScores.SP1.plan },
    { subject: 'SP2 Category', fullName: 'Category Strategies', asIs: overallResult.spScores.SP2.asIs, plan: overallResult.spScores.SP2.plan },
    { subject: 'SP3 Supplier', fullName: 'Supplier Strategies', asIs: overallResult.spScores.SP3.asIs, plan: overallResult.spScores.SP3.plan },
    { subject: 'SP4 Digital', fullName: 'Process & Digital', asIs: overallResult.spScores.SP4.asIs, plan: overallResult.spScores.SP4.plan },
    { subject: 'SP5 Performance', fullName: 'Performance Mgmt', asIs: overallResult.spScores.SP5.asIs, plan: overallResult.spScores.SP5.plan },
  ];

  // 3. Strategic Cycle Radar Data (Zi, An, Au, St)
  const cycleData = [
    { subject: 'Zi (Target)', fullName: 'Target Formulation', asIs: overallResult.cycleScores.Zi.asIs, plan: overallResult.cycleScores.Zi.plan },
    { subject: 'An (Analysis)', fullName: 'Analysis & Baselines', asIs: overallResult.cycleScores.An.asIs, plan: overallResult.cycleScores.An.plan },
    { subject: 'Au (Alignment)', fullName: 'Strategic Alignment', asIs: overallResult.cycleScores.Au.asIs, plan: overallResult.cycleScores.Au.plan },
    { subject: 'St (Control)', fullName: 'Governance & Control', asIs: overallResult.cycleScores.St.asIs, plan: overallResult.cycleScores.St.plan },
  ];

  // 4. Assessment Functions Radar Data (Active sample)
  const afData = Object.values(overallResult.afScores).map((af) => ({
    subject: af.code,
    fullName: af.name,
    asIs: af.asIs,
    plan: af.plan,
  }));

  const getCurrentData = () => {
    switch (activeRadarTab) {
      case 'modules':
        return moduleData;
      case 'partitions':
        return partitionData;
      case 'cycle':
        return cycleData;
      case 'afs':
        return afData;
      default:
        return moduleData;
    }
  };

  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs border border-slate-700">
          <div className="font-bold text-teal-300">{item.fullName || item.subject}</div>
          <div className="text-teal-400 mt-1">As-Is Maturity: <span className="font-bold">{item.asIs}%</span></div>
          <div className="text-cyan-400">Target Plan: <span className="font-bold">{item.plan}%</span></div>
          <div className="text-emerald-400 mt-0.5 pt-0.5 border-t border-slate-800">
            Target Gap: <span className="font-bold">+{Math.max(0, item.plan - item.asIs)}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Maturity Radar Profiles</h2>
          <p className="text-xs text-slate-500">Multi-dimensional gap analysis (As-Is vs. Plan)</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveRadarTab('modules')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeRadarTab === 'modules'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            15 Modules (M1–M15)
          </button>
          <button
            onClick={() => setActiveRadarTab('partitions')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeRadarTab === 'partitions'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Strategic Partitions (SP1–SP5)
          </button>
          <button
            onClick={() => setActiveRadarTab('cycle')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeRadarTab === 'cycle'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cycle (Zi/An/Au/St)
          </button>
          <button
            onClick={() => setActiveRadarTab('afs')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeRadarTab === 'afs'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Functions (AFs)
          </button>
        </div>
      </div>

      <div className="h-80 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getCurrentData()}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
            <Radar
              name="As-Is Score"
              dataKey="asIs"
              stroke="#0d9488"
              fill="#0d9488"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Radar
              name="Target Plan"
              dataKey="plan"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.15}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
            <Tooltip content={<CustomRadarTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-center text-xs text-slate-400">
        Click or hover on vertices to view dimension scores, strategic partition alignment, and planned gap.
      </div>
    </div>
  );
};
