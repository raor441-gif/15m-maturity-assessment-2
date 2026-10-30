'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { ASSESSMENT_FUNCTIONS } from '@/data/configuration';
import { DimensionType, MaturityLevel, ImprovementAction } from '@/types';
import {
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Plus,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  FileText,
  Target,
  Sparkles,
  Sliders,
  Save,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export const AssessmentWorkspace: React.FC = () => {
  const {
    activePartitionId,
    setActivePartitionId,
    activeAFId,
    setActiveAFId,
    activeDimension,
    setActiveDimension,
    profile,
    updateAnswer,
    updateStatusNote,
    addImprovementAction,
    updateImprovementAction,
    deleteImprovementAction,
    overallResult,
  } = useAssessment();

  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionOwner, setNewActionOwner] = useState('');
  const [newActionPriority, setNewActionPriority] = useState<'High' | 'Medium' | 'Low' | 'Critical'>('High');
  const [showProbeQuestions, setShowProbeQuestions] = useState(false);
  const [isSavedBanner, setIsSavedBanner] = useState(false);

  // Filter assessment functions for active partition
  const partitionAFs = ASSESSMENT_FUNCTIONS.filter((af) => af.partitionId === activePartitionId);

  // Active AF
  const currentAF = ASSESSMENT_FUNCTIONS.find((af) => af.id === activeAFId) || partitionAFs[0] || ASSESSMENT_FUNCTIONS[0];

  // If in quick-check mode, use integrated dimension, otherwise use activeDimension
  const activeDimKey: DimensionType = profile.mode === 'quick_check' ? 'integrated' : activeDimension;

  const currentQuestion = currentAF.questions[activeDimKey] || currentAF.questions.concept;

  // Current answer state
  const currentAnswer = profile.answers[currentQuestion.id] || {
    asIs: 0,
    plan: 80,
    prio: currentQuestion.defaultPrio,
    rel: currentQuestion.defaultRel,
  };

  // Qualitative notes for this AF
  const currentNotes = profile.statusNotes[currentAF.id] || '';

  // Filter improvement actions for this AF
  const currentActions = profile.actions.filter((a) => a.afId === currentAF.id);

  const handleSelectAsIs = (value: MaturityLevel) => {
    updateAnswer(currentQuestion.id, value, currentAnswer.plan, currentAnswer.prio, currentAnswer.rel);
    triggerSavedNotice();
  };

  const handleSelectPlan = (value: MaturityLevel) => {
    updateAnswer(currentQuestion.id, currentAnswer.asIs, value, currentAnswer.prio, currentAnswer.rel);
    triggerSavedNotice();
  };

  const handleToggleRelevance = () => {
    const newRel = currentAnswer.rel === 1 ? 0 : 1;
    updateAnswer(currentQuestion.id, currentAnswer.asIs, currentAnswer.plan, currentAnswer.prio, newRel);
    triggerSavedNotice();
  };

  const handleChangePriority = (prio: number) => {
    updateAnswer(currentQuestion.id, currentAnswer.asIs, currentAnswer.plan, prio, currentAnswer.rel);
    triggerSavedNotice();
  };

  const triggerSavedNotice = () => {
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 2000);
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;

    addImprovementAction({
      afId: currentAF.id,
      dimension: activeDimKey,
      index: currentActions.length + 1,
      title: newActionTitle.trim(),
      description: '',
      priority: newActionPriority,
      owner: newActionOwner.trim() || 'Procurement Lead',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
    });

    setNewActionTitle('');
    setNewActionOwner('');
  };

  const dimensions: { key: DimensionType; label: string; weight: string; step: number }[] = [
    { key: 'concept', label: 'Concept excellence', weight: '41.7%', step: 1 },
    { key: 'process', label: 'Process excellence', weight: '41.7%', step: 2 },
    { key: 'implementation', label: 'Implementation', weight: '16.7%', step: 3 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Center Main Assessment Questionnaire */}
      <div className="flex-1 space-y-6">
        {/* Function Title & Navigation Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                <span className="uppercase text-teal-700 font-bold">{currentAF.partitionId}</span>
                <span>/</span>
                <span>Module {currentAF.moduleId}: {currentAF.moduleName}</span>
                <span>/</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  Cycle: {currentAF.cycle} (25%)
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <span className="text-teal-700">{currentAF.code}</span> {currentAF.name}
              </h1>
            </div>

            {/* Score summary pill for this AF */}
            <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">AF Score</div>
                <div className="text-base font-extrabold text-teal-800">
                  {overallResult.afScores[currentAF.id]?.asIs ?? 0}%
                </div>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Target Plan</div>
                <div className="text-base font-extrabold text-blue-700">
                  {overallResult.afScores[currentAF.id]?.plan ?? 80}%
                </div>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Gap</div>
                <div className="text-base font-extrabold text-emerald-600">
                  +{overallResult.afScores[currentAF.id]?.gap ?? 0}%
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
            <span className="font-semibold text-slate-800">Definition:</span> {currentAF.definition}
          </p>

          {/* Consultant Probe Questions Collapsible */}
          <div className="mt-3">
            <button
              onClick={() => setShowProbeQuestions(!showProbeQuestions)}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1.5 focus:outline-hidden"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>{showProbeQuestions ? 'Hide Interview & Probe Questions' : 'Show Interview Guide & Deeper Probes'}</span>
            </button>

            {showProbeQuestions && (
              <div className="mt-2.5 p-3.5 bg-teal-50/60 rounded-lg border border-teal-200/60 text-xs space-y-2">
                <div className="font-bold text-teal-900">Auditor Interview Guide:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {currentAF.probeQuestions.map((probe, idx) => (
                    <li key={idx}>{probe}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Dimension Selector Tabs (for comprehensive mode) */}
        {profile.mode === 'comprehensive' && (
          <div className="flex items-center space-x-2">
            {dimensions.map((dim) => {
              const isActive = activeDimension === dim.key;
              const dimScore = overallResult.afScores[currentAF.id]?.dimensionScores[dim.key]?.asIs ?? 0;
              const dimPlan = overallResult.afScores[currentAF.id]?.dimensionScores[dim.key]?.plan ?? 80;

              return (
                <button
                  key={dim.key}
                  onClick={() => setActiveDimension(dim.key)}
                  className={`flex-1 py-3 px-4 rounded-xl border text-left transition-all relative ${
                    isActive
                      ? 'bg-teal-700 text-white border-teal-700 shadow-md ring-2 ring-teal-700/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                      Step {dim.step} ({dim.weight})
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {dimScore}%
                    </span>
                  </div>
                  <div className="font-bold text-sm mt-1">{dim.label}</div>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Question Card with Exact BAM Styling */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Question Banner */}
          <div className="bg-[#247c94] text-white p-5">
            <div className="flex items-center justify-between text-xs text-teal-100/80 mb-1">
              <span className="font-bold uppercase tracking-wider">
                {profile.mode === 'quick_check' ? 'Integrated Quick-Check Assessment' : currentQuestion.title}
              </span>
              <span className="font-mono">
                Prio: {currentAnswer.prio} • Rel: {currentAnswer.rel ? 'Active (1)' : 'Excluded (0)'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* Dynamic Weighting & Relevance Controls (Advanced Recovered Logic) */}
          <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-slate-600">Relevance Layer:</span>
              <button
                onClick={handleToggleRelevance}
                className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                  currentAnswer.rel === 1
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {currentAnswer.rel === 1 ? 'Relevant (Rel = 1)' : 'Not Relevant (Rel = 0)'}
              </button>

              <div className="flex items-center space-x-1.5 ml-2">
                <span className="font-semibold text-slate-600">Prio (0-5):</span>
                {[0, 1, 2, 3, 4, 5].map((p) => (
                  <button
                    key={p}
                    onClick={() => handleChangePriority(p)}
                    className={`w-6 h-6 rounded text-[11px] font-bold transition ${
                      currentAnswer.prio === p
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-slate-400 text-[11px]">
              Denominator automatically redistributes when excluded
            </div>
          </div>

          {/* As-Is 5-Point Maturity Rubric Options */}
          <div className="p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
              <span>Select As-Is Maturity Level (Current Reality):</span>
              <span className="text-teal-700 font-semibold">Selected: {currentAnswer.asIs}%</span>
            </div>

            <div className="space-y-2.5">
              {currentQuestion.rubric.map((option) => {
                const isSelected = currentAnswer.asIs === option.value;

                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelectAsIs(option.value)}
                    className={`flex items-start space-x-4 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-600 shadow-xs ring-1 ring-teal-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Circle badge matching screenshot styling */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-[#2995a8] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {option.label}
                    </div>

                    <div className="flex-1 pt-1.5">
                      <p className={`text-xs sm:text-sm leading-relaxed ${isSelected ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                        {option.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 pt-2 text-teal-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Target Plan Selector (Priority Improvement from SCORING-MODEL.md) */}
          <div className="p-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-blue-600" />
                  Target Plan Setting (Replaces flat 80% default):
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Set the specific strategic target level for this function.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-600 font-semibold">Target:</span>
                <span className="px-2.5 py-1 bg-blue-600 text-white rounded-md font-bold text-xs">
                  {currentAnswer.plan}%
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                  Gap: +{Math.max(0, currentAnswer.plan - currentAnswer.asIs)}%
                </span>
              </div>
            </div>

            {/* Quick Target Level Buttons */}
            <div className="flex items-center space-x-2">
              {([0, 25, 50, 75, 80, 100] as MaturityLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => handleSelectPlan(level)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition border ${
                    currentAnswer.plan === level
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {level}%
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Step Pills (1, 2, 3) matching Screenshot 1 & 4 */}
          {profile.mode === 'comprehensive' && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center space-x-3">
              {dimensions.map((dim) => (
                <button
                  key={dim.key}
                  onClick={() => setActiveDimension(dim.key)}
                  className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                    activeDimension === dim.key
                      ? 'bg-[#2995a8] text-white shadow-sm ring-2 ring-teal-500/30'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {dim.step}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Qualitative Evidence: Current Status Notes (as in Screenshot 1) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              Current Status Notes & Auditor Evidence
            </label>
            {isSavedBanner && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-saved
              </span>
            )}
          </div>

          <textarea
            value={currentNotes}
            onChange={(e) => updateStatusNote(currentAF.id, e.target.value)}
            rows={4}
            placeholder="Record interview notes, observations, process evidence, gaps in documentation..."
            className="w-full text-xs text-slate-800 p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-normal leading-relaxed"
          />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Grounding for executive report commentary</span>
            <button
              onClick={triggerSavedNotice}
              className="px-4 py-1.5 bg-[#2995a8] hover:bg-[#207a8a] text-white rounded font-bold uppercase tracking-wider text-xs shadow-xs"
            >
              SAVE NOTES
            </button>
          </div>
        </div>

        {/* Improvement Actions Manager (Exact feature from Screenshot 1 & 2) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Improvement Actions & Recommendations ({currentActions.length})
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Specific transformation initiatives to close the {Math.max(0, currentAnswer.plan - currentAnswer.asIs)}% gap
              </p>
            </div>
          </div>

          {/* List of current actions */}
          <div className="space-y-2">
            {currentActions.length === 0 ? (
              <div className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-lg text-center">
                No improvement actions recorded for this function yet. Add one below.
              </div>
            ) : (
              currentActions.map((action, idx) => (
                <div
                  key={action.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800">{action.title}</div>
                      {action.description && (
                        <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">{action.description}</p>
                      )}
                      <div className="flex items-center space-x-3 mt-1.5 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" /> {action.owner}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> {action.targetDate}
                        </span>
                        <span
                          className={`font-semibold px-1.5 py-0.2 rounded ${
                            action.priority === 'Critical'
                              ? 'bg-red-100 text-red-700'
                              : action.priority === 'High'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {action.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteImprovementAction(action.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Remove action"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add action form */}
          <form onSubmit={handleAddAction} className="pt-2 border-t border-slate-100 space-y-2">
            <input
              type="text"
              value={newActionTitle}
              onChange={(e) => setNewActionTitle(e.target.value)}
              placeholder="e.g. Standardize supplier classification pyramid across all business units..."
              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newActionOwner}
                onChange={(e) => setNewActionOwner(e.target.value)}
                placeholder="Owner (e.g. SRM Lead)"
                className="w-1/2 text-xs p-2 rounded-lg border border-slate-200 focus:outline-hidden"
              />
              <select
                value={newActionPriority}
                onChange={(e: any) => setNewActionPriority(e.target.value)}
                className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="Critical">Critical Prio</option>
                <option value="High">High Prio</option>
                <option value="Medium">Medium Prio</option>
                <option value="Low">Low Prio</option>
              </select>
              <button
                type="submit"
                className="flex-1 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Action</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Assessment Functions List within Active Partition */}
      <div className="w-full lg:w-80 space-y-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Strategic Partition
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                {activePartitionId} Functions
              </h2>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {overallResult.spScores[activePartitionId]?.asIs ?? 0}%
            </span>
          </div>

          {/* List of AFs matching right column in Screenshots 1, 3, 4 */}
          <div className="mt-3 space-y-1.5 max-h-[700px] overflow-y-auto pr-1">
            {partitionAFs.map((af) => {
              const isSelected = af.id === currentAF.id;
              const score = overallResult.afScores[af.id]?.asIs ?? 0;
              const plan = overallResult.afScores[af.id]?.plan ?? 80;

              return (
                <button
                  key={af.id}
                  onClick={() => {
                    setActiveAFId(af.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#2995a8] text-white border-[#2995a8] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {af.code} {af.name}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-teal-800'
                      }`}
                    >
                      {score}%
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] opacity-80">
                    <span>Target: {plan}%</span>
                    <span>Gap: +{Math.max(0, plan - score)}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
