'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import {
  FileText,
  Building,
  Sparkles,
  Download,
  RotateCcw,
  TrendingUp,
  Target,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    profile,
    currentCompany,
    overallResult,
    setShowReportModal,
    setShowCompanyModal,
    setShowAssessmentModal,
    exportJSON,
    resetToDefault,
    activeTab,
  } = useAssessment();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Left: Breadcrumbs & Client Identity */}
      <div className="flex items-center space-x-3">
        {/* Dynamic Company Badge */}
        <div
          className="text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider text-white shadow-2xs"
          style={{ backgroundColor: currentCompany.logoBg || '#48b240' }}
        >
          {currentCompany.logoText || 'BAM'}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-bold text-slate-900">
              {currentCompany.name}
            </h1>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">
              {profile.assessmentName}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 capitalize">
            15M Maturity Assessment • View: <span className="font-semibold text-slate-600">{activeTab}</span>
          </p>
        </div>
      </div>

      {/* Center/Right: KPIs & Exact Action Buttons from Screenshots */}
      <div className="flex items-center space-x-3">
        {/* Quick KPI stats pill */}
        <div className="hidden xl:flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            <div className="text-[11px]">
              <span className="text-slate-500">As-Is: </span>
              <strong className="text-teal-800">{overallResult.asIs}%</strong>
            </div>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <div className="text-[11px]">
              <span className="text-slate-500">Plan: </span>
              <strong className="text-blue-800">{overallResult.plan}%</strong>
            </div>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="text-[11px]">
            <span className="text-slate-500">Gap: </span>
            <strong className="text-emerald-700">+{overallResult.gap}%</strong>
          </div>
        </div>

        {/* Buttons matching Screenshots 1 & 2 */}
        <div className="flex items-center space-x-2">
          {/* EXPORT REPORT */}
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-1.5 rounded-md bg-[#1f2937] hover:bg-[#111827] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition active:scale-95 flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span>EXPORT REPORT</span>
          </button>

          {/* SELECT COMPANY */}
          <button
            onClick={() => setShowCompanyModal(true)}
            className="px-3.5 py-1.5 rounded-md bg-[#1f2937] hover:bg-[#111827] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition active:scale-95 flex items-center space-x-1.5"
          >
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>SELECT COMPANY</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* SELECT ASSESSMENT */}
          <button
            onClick={() => setShowAssessmentModal(true)}
            className="px-3.5 py-1.5 rounded-md bg-[#1f2937] hover:bg-[#111827] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition active:scale-95 flex items-center space-x-1.5"
          >
            <span>SELECT ASSESSMENT</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Reset Baseline */}
          <button
            onClick={resetToDefault}
            title="Reset to default baseline"
            className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
