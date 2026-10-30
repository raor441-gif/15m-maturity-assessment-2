'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

export const StrategicPartitionBarChart: React.FC = () => {
  const { overallResult, setActivePartitionId, setActiveTab } = useAssessment();

  const data = [
    {
      id: 'SP1',
      code: 'SP1',
      name: 'Framework Strategy',
      asIs: overallResult.spScores.SP1.asIs,
      plan: overallResult.spScores.SP1.plan,
      gap: overallResult.spScores.SP1.gap,
      weight: '25%',
    },
    {
      id: 'SP2',
      code: 'SP2',
      name: 'Category Strategies',
      asIs: overallResult.spScores.SP2.asIs,
      plan: overallResult.spScores.SP2.plan,
      gap: overallResult.spScores.SP2.gap,
      weight: '25%',
    },
    {
      id: 'SP3',
      code: 'SP3',
      name: 'Supplier Strategies',
      asIs: overallResult.spScores.SP3.asIs,
      plan: overallResult.spScores.SP3.plan,
      gap: overallResult.spScores.SP3.gap,
      weight: '25%',
    },
    {
      id: 'SP4',
      code: 'SP4',
      name: 'Process & Digital',
      asIs: overallResult.spScores.SP4.asIs,
      plan: overallResult.spScores.SP4.plan,
      gap: overallResult.spScores.SP4.gap,
      weight: '15%',
    },
    {
      id: 'SP5',
      code: 'SP5',
      name: 'Performance Mgmt',
      asIs: overallResult.spScores.SP5.asIs,
      plan: overallResult.spScores.SP5.plan,
      gap: overallResult.spScores.SP5.gap,
      weight: '10%',
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg text-xs space-y-1.5 border border-slate-700">
          <div className="font-bold text-sm text-teal-300">
            {item.code}: {item.name}
          </div>
          <div className="text-slate-400">Strategic Weight: <span className="font-bold text-white">{item.weight}</span></div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-teal-400">As-Is Score:</span>
            <span className="font-bold">{item.asIs}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-cyan-400">Target Plan:</span>
            <span className="font-bold">{item.plan}%</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800">
            <span className="text-emerald-400">Strategic Gap:</span>
            <span className="font-bold">+{item.gap}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">Strategic Partition Scores</h2>
          <p className="text-xs text-slate-500">As-Is score vs. Target Plan (with authoritative weighting)</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-teal-600 rounded-sm" />
            <span className="text-slate-600 font-medium">As-Is Score</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-cyan-400 rounded-full" />
            <span className="text-slate-600 font-medium">Target Plan</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: -10, bottom: 20 }}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload.length) {
                const partitionId = e.activePayload[0].payload.id;
                setActivePartitionId(partitionId);
                setActiveTab('assessment');
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="code"
              tickLine={false}
              stroke="#64748b"
              fontSize={12}
              tick={{ fill: '#475569', fontWeight: 600 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickLine={false}
              stroke="#64748b"
              fontSize={11}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar
              dataKey="asIs"
              fill="#0d9488"
              radius={[4, 4, 0, 0]}
              barSize={44}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="#0d9488"
                  className="hover:fill-teal-700 cursor-pointer transition-colors"
                />
              ))}
            </Bar>
            {/* Target lines per partition */}
            {data.map((entry, idx) => (
              <ReferenceLine
                key={`ref-${idx}`}
                y={entry.plan}
                stroke="#06b6d4"
                strokeWidth={3}
                strokeDasharray="6 4"
                label={{
                  value: `${entry.plan}% Plan`,
                  position: 'top',
                  fill: '#0891b2',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
        {data.map((sp) => (
          <button
            key={sp.id}
            onClick={() => {
              setActivePartitionId(sp.id as any);
              setActiveTab('assessment');
            }}
            className="p-2 rounded-lg hover:bg-slate-50 transition text-left sm:text-center group"
          >
            <div className="text-[11px] font-bold text-slate-500 group-hover:text-teal-700">
              {sp.code} ({sp.weight})
            </div>
            <div className="text-sm font-extrabold text-teal-800">{sp.asIs}%</div>
            <div className="text-[10px] text-cyan-600 font-medium">Plan: {sp.plan}%</div>
          </button>
        ))}
      </div>
    </div>
  );
};
