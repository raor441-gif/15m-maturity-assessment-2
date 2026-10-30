'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { MODULES } from '@/data/configuration';
import {
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  BarChart3,
  Users,
  FolderTree,
  Building2,
  Sliders,
  CheckCircle2,
  FileCheck,
  Search,
  Eye,
  Maximize2
} from 'lucide-react';

export const HouseOfProcurement: React.FC = () => {
  const { overallResult, setActivePartitionId, setActiveTab } = useAssessment();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('M01');
  const [houseView, setHouseView] = useState<'interactive' | 'blueprint'>('interactive');

  const selectedModule = MODULES.find((m) => m.code === selectedModuleId || m.id === selectedModuleId) || MODULES[0];
  const selectedModScore = overallResult.moduleScores[selectedModule.id] || { asIs: 0, plan: 80, gap: 0 };

  const sp1Modules = MODULES.filter((m) => m.partitionId === 'SP1');
  const sp2Modules = MODULES.filter((m) => m.partitionId === 'SP2');
  const sp3Modules = MODULES.filter((m) => m.partitionId === 'SP3');
  const sp4Modules = MODULES.filter((m) => m.partitionId === 'SP4');
  const sp5Modules = MODULES.filter((m) => m.partitionId === 'SP5');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-base font-bold text-slate-900">
              The House of 15M Maturity Assessment
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            15 core modules structured across the 5 strategic procurement dimensions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setHouseView('interactive')}
              className={`px-3 py-1 rounded-md transition ${
                houseView === 'interactive'
                  ? 'bg-white text-teal-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive House
            </button>
            <button
              onClick={() => setHouseView('blueprint')}
              className={`px-3 py-1 rounded-md transition ${
                houseView === 'blueprint'
                  ? 'bg-white text-teal-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Original Blueprint
            </button>
          </div>
        </div>
      </div>

      {houseView === 'blueprint' ? (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 p-2 shadow-inner group">
            <img
              src="/images/House.png"
              alt="House of 15M Maturity Assessment Blueprint"
              className="w-full h-auto object-contain max-h-[550px] mx-auto rounded-lg transition group-hover:scale-[1.01]"
            />
          </div>
          <p className="text-[11px] text-center text-slate-400">
            Authoritative 15M Architecture: SP1 Framework (M01-M04), SP2 Category (M05-M08), SP3 Supplier (M09-M11), SP4 Process & AI (M12-M13), SP5 Management System (M14-M15).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Visual House Layout */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 p-4 sm:p-6 border border-slate-200">
            {/* ROOF: Triangular Pediment */}
            <div className="max-w-2xl mx-auto mb-3">
              <div className="w-0 h-0 border-l-[140px] sm:border-l-[280px] border-l-transparent border-r-[140px] sm:border-r-[280px] border-r-transparent border-b-[45px] sm:border-b-[60px] border-b-amber-400 mx-auto relative flex items-end justify-center">
                <div className="absolute -bottom-1 text-center w-full">
                  <span className="bg-amber-400 text-slate-900 font-black text-[10px] sm:text-xs uppercase px-3 py-0.5 rounded-t-md tracking-wider shadow-2xs">
                    15M Maturity Assessment
                  </span>
                </div>
              </div>
            </div>

            {/* MAIN HOUSE GRID: Left Column (SP4) + Center Floors (SP3, SP2, SP1) + Right Column (SP5) */}
            <div className="grid grid-cols-12 gap-3 items-stretch">
              {/* LEFT PILLAR: SP4 Process / Digital Strategies */}
              <div className="col-span-12 md:col-span-3 bg-[#4b5563] text-white rounded-xl p-3 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">
                      SP4 (15%)
                    </span>
                    <span className="text-xs font-black text-amber-300">
                      {overallResult.spScores.SP4.asIs}%
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xs mt-1.5 text-white">
                    Process / Digital Strategies
                  </h3>
                </div>

                <div className="space-y-2 my-3">
                  {sp4Modules.map((m) => {
                    const s = overallResult.moduleScores[m.id];
                    const isSelected = selectedModule.id === m.id;

                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModuleId(m.code)}
                        className={`w-full p-2.5 rounded-lg text-left transition text-xs border ${
                          isSelected
                            ? 'bg-white text-slate-900 border-white shadow-sm font-bold'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold opacity-80">{m.code}</span>
                          <span className="font-bold text-[11px]">{s?.asIs ?? 0}%</span>
                        </div>
                        <div className="text-[11px] mt-0.5 leading-tight">{m.name}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] text-slate-300 text-center pt-1 border-t border-white/10">
                  Processes & Digitalization
                </div>
              </div>

              {/* CENTER FLOORS: SP3 (Supplier) -> SP2 (Category) -> SP1 (Framework) */}
              <div className="col-span-12 md:col-span-6 flex flex-col space-y-3">
                {/* 3RD FLOOR: SP3 Supplier Strategies */}
                <div className="bg-[#0f766e] text-white rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                      SP3 Supplier Strategies (25%)
                    </span>
                    <span className="text-xs font-black text-emerald-300">
                      {overallResult.spScores.SP3.asIs}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {sp3Modules.map((m) => {
                      const s = overallResult.moduleScores[m.id];
                      const isSelected = selectedModule.id === m.id;

                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedModuleId(m.code)}
                          className={`p-2 rounded-lg text-left transition text-xs border flex flex-col justify-between ${
                            isSelected
                              ? 'bg-white text-slate-900 border-white shadow-sm font-bold'
                              : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] opacity-80">{m.code}</span>
                            <span className="text-[10px] font-bold">{s?.asIs ?? 0}%</span>
                          </div>
                          <div className="text-[10px] mt-1 leading-snug line-clamp-2">{m.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2ND FLOOR: SP2 Category Strategies */}
                <div className="bg-[#14b8a6] text-white rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-950 font-black">
                      SP2 Category Strategies (25%)
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {overallResult.spScores.SP2.asIs}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    {sp2Modules.map((m) => {
                      const s = overallResult.moduleScores[m.id];
                      const isSelected = selectedModule.id === m.id;

                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedModuleId(m.code)}
                          className={`p-2 rounded-lg text-left transition text-xs border flex flex-col justify-between ${
                            isSelected
                              ? 'bg-white text-slate-900 border-white shadow-sm font-bold'
                              : 'bg-teal-700/60 hover:bg-teal-700 text-white border-teal-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] opacity-80">{m.code}</span>
                            <span className="text-[10px] font-bold">{s?.asIs ?? 0}%</span>
                          </div>
                          <div className="text-[10px] mt-1 leading-snug line-clamp-2">{m.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* GROUND FLOOR / FOUNDATION: SP1 Procurement Framework Strategy */}
                <div className="bg-[#0284c7] text-white rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-100">
                      SP1 Procurement Framework Strategy (25%)
                    </span>
                    <span className="text-xs font-black text-white">
                      {overallResult.spScores.SP1.asIs}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    {sp1Modules.map((m) => {
                      const s = overallResult.moduleScores[m.id];
                      const isSelected = selectedModule.id === m.id;

                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedModuleId(m.code)}
                          className={`p-2 rounded-lg text-left transition text-xs border flex flex-col justify-between ${
                            isSelected
                              ? 'bg-white text-slate-900 border-white shadow-sm font-bold'
                              : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] opacity-80">{m.code}</span>
                            <span className="text-[10px] font-bold">{s?.asIs ?? 0}%</span>
                          </div>
                          <div className="text-[10px] mt-1 leading-snug line-clamp-2">{m.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT PILLAR: SP5 Procurement Management System */}
              <div className="col-span-12 md:col-span-3 bg-[#eab308] text-slate-900 rounded-xl p-3 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900/20">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                      SP5 (10%)
                    </span>
                    <span className="text-xs font-black text-slate-950">
                      {overallResult.spScores.SP5.asIs}%
                    </span>
                  </div>
                  <h3 className="font-black text-xs mt-1.5 text-slate-950">
                    Procurement Management System
                  </h3>
                </div>

                <div className="space-y-2 my-3">
                  {sp5Modules.map((m) => {
                    const s = overallResult.moduleScores[m.id];
                    const isSelected = selectedModule.id === m.id;

                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModuleId(m.code)}
                        className={`w-full p-2.5 rounded-lg text-left transition text-xs border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-bold'
                            : 'bg-amber-300 hover:bg-amber-200 text-slate-950 border-amber-400 font-semibold'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold opacity-80">{m.code}</span>
                          <span className="font-bold text-[11px]">{s?.asIs ?? 0}%</span>
                        </div>
                        <div className="text-[11px] mt-0.5 leading-tight">{m.name}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] font-bold text-slate-800 text-center pt-1 border-t border-slate-900/10">
                  Performance & Target Operating Model
                </div>
              </div>
            </div>
          </div>

          {/* Module Deep Dive Drawer */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Module {selectedModule.code}
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-bold text-slate-700">{selectedModule.partitionId}</span>
              </div>
              <h4 className="font-black text-sm text-slate-900">{selectedModule.name}</h4>
              <p className="text-xs text-slate-500">
                Current maturity level: <strong className="text-teal-800">{selectedModScore.asIs}%</strong> • Target Plan: <strong className="text-blue-700">{selectedModScore.plan}%</strong> (Gap: +{selectedModScore.gap}%)
              </p>
            </div>

            <button
              onClick={() => {
                setActivePartitionId(selectedModule.partitionId);
                setActiveTab('assessment');
              }}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 shrink-0 transition"
            >
              <span>Audit {selectedModule.partitionId} Functions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
