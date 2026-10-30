'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { FileCheck, Calendar, Check, X, Plus } from 'lucide-react';

export const AssessmentSelectorModal: React.FC = () => {
  const {
    currentCompany,
    profile,
    selectAssessment,
    showAssessmentModal,
    setShowAssessmentModal,
  } = useAssessment();

  if (!showAssessmentModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <FileCheck className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold">Select Assessment Round</h2>
              <p className="text-[11px] text-slate-400">Assessments recorded for {currentCompany.name}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAssessmentModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {currentCompany.assessments.map((ass) => {
            const isSelected = profile.assessmentName === ass.name;

            return (
              <div
                key={ass.id}
                onClick={() => selectAssessment(ass.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-teal-50 border-teal-500 shadow-xs ring-1 ring-teal-500/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-slate-800">{ass.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        ass.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ass.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Conducted: {ass.date}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
