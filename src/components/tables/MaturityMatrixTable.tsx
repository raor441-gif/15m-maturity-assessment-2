'use client';

import React, { useState, useMemo } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { ASSESSMENT_FUNCTIONS } from '@/data/configuration';
import { Download, Search, Filter, ArrowUpDown } from 'lucide-react';
import { StrategicPartitionId } from '@/types';

export const MaturityMatrixTable: React.FC = () => {
  const { overallResult, setActiveAFId, setActivePartitionId, setActiveTab } = useAssessment();
  const [filterPartition, setFilterPartition] = useState<string>('ALL');
  const [filterCycle, setFilterCycle] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'code' | 'name' | 'asIs' | 'plan' | 'gap'>('code');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredAFs = useMemo(() => {
    return ASSESSMENT_FUNCTIONS.filter((af) => {
      const matchPartition = filterPartition === 'ALL' || af.partitionId === filterPartition;
      const matchCycle = filterCycle === 'ALL' || af.cycle === filterCycle;
      const matchSearch =
        af.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        af.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        af.moduleName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchPartition && matchCycle && matchSearch;
    }).sort((a, b) => {
      const scoreA = overallResult.afScores[a.id] || { asIs: 0, plan: 80, gap: 0 };
      const scoreB = overallResult.afScores[b.id] || { asIs: 0, plan: 80, gap: 0 };

      let valA: any = a.code;
      let valB: any = b.code;

      if (sortField === 'name') {
        valA = a.name;
        valB = b.name;
      } else if (sortField === 'asIs') {
        valA = scoreA.asIs;
        valB = scoreB.asIs;
      } else if (sortField === 'plan') {
        valA = scoreA.plan;
        valB = scoreB.plan;
      } else if (sortField === 'gap') {
        valA = scoreA.gap;
        valB = scoreB.gap;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filterPartition, filterCycle, searchTerm, sortField, sortAsc, overallResult]);

  const handleExportCSV = () => {
    const headers = [
      'Partition',
      'Code',
      'Assessment Function',
      'Module',
      'Cycle',
      'Concept (%)',
      'Process (%)',
      'Implementation (%)',
      'As-Is AF Score (%)',
      'Target Plan (%)',
      'Net Gap (%)',
    ];

    const rows = filteredAFs.map((af) => {
      const s = overallResult.afScores[af.id];
      return [
        af.partitionId,
        af.code,
        `"${af.name}"`,
        `"${af.moduleName}"`,
        af.cycle,
        s?.dimensionScores.concept.asIs ?? 0,
        s?.dimensionScores.process.asIs ?? 0,
        s?.dimensionScores.implementation.asIs ?? 0,
        s?.asIs ?? 0,
        s?.plan ?? 80,
        s?.gap ?? 0,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `15M_Maturity_Scan_Matrix.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleRowClick = (af: any) => {
    setActivePartitionId(af.partitionId);
    setActiveAFId(af.id);
    setActiveTab('assessment');
  };

  const toggleSort = (field: 'code' | 'name' | 'asIs' | 'plan' | 'gap') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">15M Detailed Scoring Matrix</h2>
          <p className="text-xs text-slate-500">
            Authoritative multi-tier scoring audit across all dimensions, priorities and targets
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search function or module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-500 w-48 sm:w-60"
            />
          </div>

          {/* Partition Filter */}
          <select
            value={filterPartition}
            onChange={(e) => setFilterPartition(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700"
          >
            <option value="ALL">All Partitions (SP1–SP5)</option>
            <option value="SP1">SP1: Framework</option>
            <option value="SP2">SP2: Category</option>
            <option value="SP3">SP3: Supplier</option>
            <option value="SP4">SP4: Digital</option>
            <option value="SP5">SP5: Performance</option>
          </select>

          {/* Strategic Cycle Filter */}
          <select
            value={filterCycle}
            onChange={(e) => setFilterCycle(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700"
          >
            <option value="ALL">All Cycles (Zi/An/Au/St)</option>
            <option value="Zi">Zi - Target</option>
            <option value="An">An - Analysis</option>
            <option value="Au">Au - Alignment</option>
            <option value="St">St - Control</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th
                onClick={() => toggleSort('code')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Code</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('name')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Assessment Function</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3">Partition</th>
              <th className="py-3 px-3">Module</th>
              <th className="py-3 px-3 text-center">Cycle</th>
              <th className="py-3 px-3 text-right">Concept (41.7%)</th>
              <th className="py-3 px-3 text-right">Process (41.7%)</th>
              <th className="py-3 px-3 text-right">Impl (16.7%)</th>
              <th
                onClick={() => toggleSort('asIs')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 font-bold text-teal-800"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>As-Is Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('plan')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 text-blue-700"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Plan Target</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('gap')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 text-emerald-700"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Net Gap</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAFs.map((af) => {
              const score = overallResult.afScores[af.id];
              const concept = score?.dimensionScores.concept.asIs ?? 0;
              const process = score?.dimensionScores.process.asIs ?? 0;
              const impl = score?.dimensionScores.implementation.asIs ?? 0;
              const asIs = score?.asIs ?? 0;
              const plan = score?.plan ?? 80;
              const gap = score?.gap ?? 0;

              return (
                <tr
                  key={af.id}
                  onClick={() => handleRowClick(af)}
                  className="hover:bg-teal-50/50 cursor-pointer transition-colors group"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-700">
                    {af.code}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 group-hover:text-teal-900">
                    {af.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                    {af.partitionId}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px] truncate max-w-[150px]">
                    {af.moduleId}: {af.moduleName}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {af.cycle}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                    {concept}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                    {process}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                    {impl}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-800 font-mono">
                    <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                      {asIs}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-blue-700 font-mono">
                    {plan}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600 font-mono">
                    +{gap}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
