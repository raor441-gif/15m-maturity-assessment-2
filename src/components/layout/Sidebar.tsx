'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { STRATEGIC_PARTITIONS } from '@/lib/scoring-engine';
import { StrategicPartitionId } from '@/types';
import {
  LayoutDashboard,
  TableProperties,
  Info,
  Settings,
  PieChart,
  Crown,
  ChevronRight,
  ShieldCheck,
  Building2,
  FolderTree,
  Users,
  Cpu,
  BarChart3,
  Sparkles,
  ClipboardList,
  ArrowUpDown,
  Building
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activePartitionId,
    setActivePartitionId,
    overallResult,
    profile,
    currentCompany,
    setShowCompanyModal,
    toggleAssessmentMode,
  } = useAssessment();

  const getPartitionIcon = (id: StrategicPartitionId) => {
    switch (id) {
      case 'SP1':
        return <Building2 className="w-4 h-4" />;
      case 'SP2':
        return <FolderTree className="w-4 h-4" />;
      case 'SP3':
        return <Users className="w-4 h-4" />;
      case 'SP4':
        return <Cpu className="w-4 h-4" />;
      case 'SP5':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <ShieldCheck className="w-4 h-4" />;
    }
  };

  return (
    <aside className="w-72 bg-[#1b6b80] text-white flex flex-col h-screen sticky top-0 shadow-xl select-none z-20">
      {/* Dynamic Company Brand Header */}
      <div className="p-4 border-b border-white/10 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* Dynamic Company Logo / Badge */}
            <div
              className="font-black text-sm px-2.5 py-1.5 rounded-lg tracking-tight flex items-center shadow-xs shrink-0 uppercase"
              style={{
                backgroundColor: currentCompany.logoBg || '#48b240',
                color: currentCompany.logoColor || '#ffffff',
              }}
            >
              {currentCompany.logoText || 'BAM'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-teal-200/80 font-bold truncate">
                {currentCompany.name}
              </div>
              <div className="text-xs font-black tracking-tight text-white leading-tight">
                15M Maturity Assessment
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCompanyModal(true)}
            title="Switch Client Company"
            className="p-1 rounded-md text-teal-200 hover:text-white hover:bg-white/10 transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white/20 text-white shadow-xs backdrop-blur-xs'
                : 'text-teal-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="w-4 h-4 text-emerald-300" />
              <span>Executive Dashboard</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {overallResult.asIs}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assessment')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'assessment'
                ? 'bg-white/20 text-white shadow-xs backdrop-blur-xs'
                : 'text-teal-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ClipboardList className="w-4 h-4 text-emerald-300" />
              <span>Assessment Flow</span>
            </div>
            {profile.mode === 'quick_check' && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200 uppercase">
                Quick 15M
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tables'
                ? 'bg-white/20 text-white shadow-xs backdrop-blur-xs'
                : 'text-teal-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <TableProperties className="w-4 h-4 text-emerald-300" />
              <span>Detailed Tables & CSV</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-white/20 text-white shadow-xs backdrop-blur-xs'
                : 'text-teal-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <PieChart className="w-4 h-4 text-emerald-300" />
              <span>Strategic Cycle (Zi/An/Au/St)</span>
            </div>
          </button>
        </div>

        {/* Strategic Partitions section */}
        <div>
          <div className="px-3 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200/80">
              Strategic Partitions
            </span>
            <span className="text-[10px] text-teal-300/70 font-mono">Weight</span>
          </div>

          <div className="space-y-1">
            {STRATEGIC_PARTITIONS.map((sp) => {
              const score = overallResult.spScores[sp.id]?.asIs || 0;
              const plan = overallResult.spScores[sp.id]?.plan || 80;
              const isSelected = activePartitionId === sp.id && activeTab === 'assessment';

              return (
                <button
                  key={sp.id}
                  onClick={() => {
                    setActivePartitionId(sp.id);
                    setActiveTab('assessment');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all group flex flex-col space-y-1 ${
                    isSelected
                      ? 'bg-[#2995a8] text-white shadow-xs'
                      : 'text-teal-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`${isSelected ? 'text-white' : 'text-teal-200'}`}>
                        {getPartitionIcon(sp.id)}
                      </span>
                      <span className="font-semibold truncate text-[11px]">
                        {sp.code} {sp.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">
                      {Math.round(sp.weight * 100)}%
                    </span>
                  </div>

                  {/* Progress bar inside sidebar */}
                  <div className="w-full flex items-center space-x-2 pt-0.5">
                    <div className="flex-1 bg-black/20 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold font-mono text-teal-100">
                      {score}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Mode Banner */}
        <div className="bg-black/20 p-3 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-teal-200 font-semibold flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Mode:
            </span>
            <span className="font-bold text-white uppercase text-[9px] bg-white/10 px-1.5 py-0.5 rounded">
              {profile.mode === 'comprehensive' ? 'Comprehensive' : 'Quick Check'}
            </span>
          </div>
          <p className="text-[10px] text-teal-100/70 mb-2 leading-tight">
            {profile.mode === 'comprehensive'
              ? '3 Dimensions: Concept (41.7%), Process (41.7%), Implementation (16.7%)'
              : '15-minute quick diagnostic with Integrated Assessment rubrics'}
          </p>
          <button
            onClick={toggleAssessmentMode}
            className="w-full py-1 px-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded text-center font-medium transition text-[11px]"
          >
            Switch to {profile.mode === 'comprehensive' ? '15M Quick Check' : 'Comprehensive'}
          </button>
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1 pt-1 border-t border-white/10">
          <button
            onClick={() => setActiveTab('about')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
              activeTab === 'about'
                ? 'bg-white/20 text-white'
                : 'text-teal-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4 text-emerald-300" />
            <span>15M Methodology</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
              activeTab === 'settings'
                ? 'bg-white/20 text-white'
                : 'text-teal-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-300" />
            <span>Settings & Client Data</span>
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-3.5 border-t border-white/10 bg-black/10 flex flex-col items-center text-center">
        <div className="text-[10px] font-extrabold tracking-wider text-teal-100 uppercase">
          SOURCING CHAMPIONS
        </div>
        <div className="text-[9px] text-teal-200/70 tracking-tight">
          Procurement Consulting & Excellence
        </div>
      </div>
    </aside>
  );
};
