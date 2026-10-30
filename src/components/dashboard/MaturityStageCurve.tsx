'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { STAGES } from '@/lib/scoring-engine';
import {
  Shield,
  Sparkles,
  Building,
  Layers,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Target,
  Maximize2,
  Eye,
  Disc3,
  TrendingUp
} from 'lucide-react';

export const MaturityStageCurve: React.FC = () => {
  const { overallResult, currentCompany } = useAssessment();
  const currentScore = overallResult.asIs;
  const currentStage = STAGES.find(
    (s) => currentScore >= s.min && currentScore <= s.max
  ) || STAGES[1];

  const [selectedStage, setSelectedStage] = useState<number>(currentStage.number);
  const [viewMode, setViewMode] = useState<'interactive' | 'concentric' | 'curve'>('interactive');

  const activeStageData = STAGES.find((s) => s.number === selectedStage) || currentStage;

  const stageCriteriaMap: Record<number, { title: string; bullets: string[]; milestone: string }> = {
    1: {
      title: 'Stage 1: Operational',
      bullets: [
        'Value contribution not recognizable',
        'No real transparency across spend or suppliers',
        'Hardly any strategic methods in use',
      ],
      milestone: 'Basic transactional compliance and order execution.',
    },
    2: {
      title: 'Stage 2: Classical Sourcing',
      bullets: [
        'Some value contribution, not verifiable',
        'Transparency mostly through individual projects',
        'Use of simple strategic methods approach when it comes to some strategy partitions',
      ],
      milestone: 'Project-driven cost avoidance with commercial negotiations.',
    },
    3: {
      title: 'Stage 3: Sourcing Expert',
      bullets: [
        'Value contribution visible and partly verifiable',
        'Comprehensive transparency, partly documented',
        'Comprehensive state-of-the-art methods but with notable gaps',
      ],
      milestone: 'Structured category management & standardized supplier classification.',
    },
    4: {
      title: 'Stage 4: Top Class Sourcing',
      bullets: [
        'High provable value demonstrated to the executive board',
        'Very comprehensive transparency documented across all spend',
        'World-class sourcing methods with some minor limitations',
      ],
      milestone: 'Integrated digital S2C/P2P suites and joint supplier innovation.',
    },
    5: {
      title: 'Stage 5: World Sourcing Champion',
      bullets: [
        'Maximum provable value continuously delivered to the enterprise',
        'Complete transparency provided for the entire company',
        'World-class sourcing methods in all strategic partitions',
      ],
      milestone: 'Cognitive autonomous procurement ecosystem setting global benchmarks.',
    },
  };

  const getStageIcon = (stageNumber: number) => {
    switch (stageNumber) {
      case 1:
        return <Layers className="w-4 h-4" />;
      case 2:
        return <Building className="w-4 h-4" />;
      case 3:
        return <Shield className="w-4 h-4" />;
      case 4:
        return <Sparkles className="w-4 h-4" />;
      case 5:
        return <Trophy className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">Final Maturity Scoring</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200">
              {currentCompany.shortName || currentCompany.name}: {currentScore}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Based on the maturity assessment concluded with all internal and external stakeholders
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1 rounded-md transition ${
                viewMode === 'interactive'
                  ? 'bg-white text-teal-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Analysis
            </button>
            <button
              onClick={() => setViewMode('concentric')}
              className={`px-3 py-1 rounded-md transition ${
                viewMode === 'concentric'
                  ? 'bg-white text-teal-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Concentric Rings
            </button>
            <button
              onClick={() => setViewMode('curve')}
              className={`px-3 py-1 rounded-md transition ${
                viewMode === 'curve'
                  ? 'bg-white text-teal-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Progression Curve
            </button>
          </div>
        </div>
      </div>

      {/* Main Visual Display */}
      {viewMode === 'concentric' ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 relative bg-slate-950 p-4 shadow-inner group flex items-center justify-center">
            {/* The circular concentric image from Maturity.png */}
            <img
              src="/images/Maturity.png"
              alt="Final Maturity Scoring Concentric Model"
              className="w-full h-auto object-contain max-h-[500px] mx-auto opacity-95 transition group-hover:scale-[1.01]"
            />

            {/* Dynamic Live Score Marker Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white border border-teal-400 px-4 py-2 rounded-xl backdrop-blur-md shadow-xl flex items-center space-x-3 text-xs">
              <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Verified Position</span>
                <span className="font-extrabold text-teal-300">
                  {currentCompany.name}: {currentScore}% (Stage {currentStage.number}: {currentStage.name})
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === 'curve' ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900 shadow-inner group">
            {/* The authentic linear curve image */}
            <img
              src="/images/maturity-curve.png"
              alt="Final Maturity Scoring 5-Stage Methodology Curve"
              className="w-full h-auto object-contain max-h-[460px] mx-auto opacity-95 transition group-hover:opacity-100"
            />

            {/* Dynamic Live Score Marker Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white border border-teal-400 px-4 py-2 rounded-xl backdrop-blur-md shadow-xl flex items-center space-x-3 text-xs">
              <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Verified Position</span>
                <span className="font-extrabold text-teal-300">
                  {currentCompany.name}: {currentScore}% (Stage {currentStage.number}: {currentStage.name})
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {/* Embedded Image Header Banner with Live Score Beacon */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 shadow-xs">
            <img
              src="/images/maturity-curve.png"
              alt="Maturity Curve"
              className="w-full h-44 object-cover object-center opacity-30 mix-blend-luminosity filter blur-[0.5px]"
            />

            {/* Overlay interactive 5 Stage selector buttons right over the curve */}
            <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-8 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent">
              {STAGES.map((stage) => {
                const isCurrent = stage.number === currentStage.number;
                const isSelected = stage.number === selectedStage;

                return (
                  <button
                    key={stage.number}
                    onClick={() => setSelectedStage(stage.number)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all relative group ${
                      isSelected
                        ? 'scale-105 z-10'
                        : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute -top-3 bg-teal-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md animate-bounce">
                        Current
                      </div>
                    )}

                    <div
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                        isSelected
                          ? 'bg-teal-500 text-white ring-4 ring-teal-400/40'
                          : isCurrent
                          ? 'bg-teal-600 text-white ring-2 ring-white/50'
                          : 'bg-slate-800/80 text-slate-300 border border-white/20 hover:bg-slate-700'
                      }`}
                    >
                      {getStageIcon(stage.number)}
                    </div>

                    <span className="text-[11px] font-bold text-white mt-1.5 text-center drop-shadow-sm">
                      Stage {stage.number}
                    </span>
                    <span className="text-[9px] text-teal-200/80 font-mono">
                      {stage.min}–{stage.max}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Selected Stage Analysis Drawer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Stage Characteristics matching Image 3 text */}
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2 md:col-span-2">
              <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-md bg-teal-700 text-white font-bold text-xs flex items-center justify-center">
                    {selectedStage}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {stageCriteriaMap[selectedStage].title}
                  </h3>
                </div>

                {selectedStage === currentStage.number ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    Current Level ({currentScore}%)
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500">
                    Threshold: {activeStageData.min}–{activeStageData.max}%
                  </span>
                )}
              </div>

              <div className="pt-1">
                <div className="text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                  Operational Criteria from Methodology Instrument:
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {stageCriteriaMap[selectedStage].bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-2 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gap Analysis & Transition Pathway to this Stage */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Strategic Gap Analysis
                </span>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-slate-900">
                    {selectedStage <= currentStage.number ? 'Achieved' : `+${activeStageData.min - currentScore}%`}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {selectedStage <= currentStage.number ? 'Maturity unlocked' : 'Headroom required'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-2 leading-snug">
                  {stageCriteriaMap[selectedStage].milestone}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                  <span>Target Plan Progress</span>
                  <span className="text-teal-700">{overallResult.plan}% Plan</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, currentScore))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
