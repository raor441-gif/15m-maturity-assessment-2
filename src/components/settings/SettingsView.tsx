'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { Settings, Save, RotateCcw, Download, Upload, CheckCircle2, Building, Shield } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateCompanyDetails,
    setAssessmentMode,
    resetToDefault,
    exportJSON,
    importJSON,
  } = useAssessment();

  const [company, setCompany] = useState(profile.companyName);
  const [assessmentName, setAssessmentName] = useState(profile.assessmentName);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyDetails(company, assessmentName);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.answers) {
          importJSON(json);
          setCompany(json.companyName || 'Imported Company');
          setAssessmentName(json.assessmentName || 'Imported Assessment');
          alert('Assessment data imported successfully!');
        } else {
          alert('Invalid assessment file format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="bg-teal-700 text-white p-2 rounded-lg">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Organization & Assessment Details</h2>
            <p className="text-xs text-slate-500">Configure company identity and assessment metadata</p>
          </div>
        </div>

        <form onSubmit={handleSaveDetails} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Company / Client Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Assessment Title
            </label>
            <input
              type="text"
              value={assessmentName}
              onChange={(e) => setAssessmentName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>

            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Updated successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="bg-slate-800 text-white p-2 rounded-lg">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Assessment Mode & Backup</h2>
            <p className="text-xs text-slate-500">Manage diagnostic mode and import/export state</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Diagnostic Mode
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setAssessmentMode('comprehensive')}
                className={`flex-1 p-3 rounded-lg border text-xs font-semibold text-left transition ${
                  profile.mode === 'comprehensive'
                    ? 'bg-teal-50 border-teal-600 text-teal-900 ring-1 ring-teal-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Comprehensive Deep Audit</div>
                <div className="text-[11px] text-slate-500 mt-0.5">3 Dimensions (Concept, Process, Implementation)</div>
              </button>

              <button
                onClick={() => setAssessmentMode('quick_check')}
                className={`flex-1 p-3 rounded-lg border text-xs font-semibold text-left transition ${
                  profile.mode === 'quick_check'
                    ? 'bg-teal-50 border-teal-600 text-teal-900 ring-1 ring-teal-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">15-Minute Quick Check</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Integrated Assessment single holistic question per AF</div>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={exportJSON}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Export Assessment JSON</span>
              </button>

              <label className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={resetToDefault}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to BAM Demo Baseline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
