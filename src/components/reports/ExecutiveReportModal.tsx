'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { STRATEGIC_PARTITIONS } from '@/lib/scoring-engine';
import { Printer, X, Download, ShieldCheck, Crown, FileText, Calendar, Building } from 'lucide-react';

export const ExecutiveReportModal: React.FC = () => {
  const { profile, currentCompany, overallResult, showReportModal, setShowReportModal } = useAssessment();

  if (!showReportModal) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Controls (No print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm">Executive Maturity Report — Print & PDF Export</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={() => setShowReportModal(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center space-x-3">
                <span
                  className="font-extrabold text-sm px-2.5 py-1.5 rounded text-white uppercase tracking-wider shadow-xs"
                  style={{ backgroundColor: currentCompany.logoBg || '#48b240' }}
                >
                  {currentCompany.logoText || 'CLIENT'}
                </span>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  {currentCompany.name}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-2">
                15M Procurement Maturity Assessment Report
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Assessment Profile: <span className="font-semibold text-slate-700">{profile.assessmentName}</span> • Date: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-teal-800">
                SOURCING CHAMPIONS
              </div>
              <div className="text-[10px] text-slate-500">
                Procurement Excellence Methodology
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Version: 15M Autoritative Engine
              </div>
            </div>
          </div>

          {/* Key Executive Findings */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-teal-50/80 rounded-xl border border-teal-200">
              <div className="text-xs font-bold uppercase text-teal-800">As-Is Maturity</div>
              <div className="text-3xl font-extrabold text-teal-900 mt-1">{overallResult.asIs}%</div>
              <div className="text-xs font-semibold text-teal-700 mt-0.5">
                Stage {overallResult.stageNumber}: {overallResult.stageName}
              </div>
            </div>

            <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200">
              <div className="text-xs font-bold uppercase text-blue-800">Target Plan</div>
              <div className="text-3xl font-extrabold text-blue-900 mt-1">{overallResult.plan}%</div>
              <div className="text-xs font-semibold text-blue-700 mt-0.5">
                Target Stage: Top Class Sourcing
              </div>
            </div>

            <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200">
              <div className="text-xs font-bold uppercase text-emerald-800">Strategic Headroom</div>
              <div className="text-3xl font-extrabold text-emerald-900 mt-1">+{overallResult.gap}%</div>
              <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                {profile.actions.length} Transformation Actions
              </div>
            </div>
          </div>

          {/* Strategic Partition Breakdown Table */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
              Strategic Partitions Score Breakdown
            </h3>
            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700 text-left border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Partition</th>
                  <th className="py-2 px-3 text-center">Weight</th>
                  <th className="py-2 px-3 text-right">As-Is Score</th>
                  <th className="py-2 px-3 text-right">Target Plan</th>
                  <th className="py-2 px-3 text-right">Net Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {STRATEGIC_PARTITIONS.map((sp) => {
                  const s = overallResult.spScores[sp.id];
                  return (
                    <tr key={sp.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {sp.code}: {sp.name}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-600">
                        {Math.round(sp.weight * 100)}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-teal-800 font-mono">
                        {s?.asIs ?? 0}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-blue-700 font-mono">
                        {s?.plan ?? 80}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600 font-mono">
                        +{s?.gap ?? 0}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Key Priority Actions */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
              Priority Transformation Initiatives & Actions
            </h3>
            <div className="space-y-2">
              {profile.actions.map((action, i) => (
                <div key={action.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>
                      {i + 1}. {action.title}
                    </span>
                    <span className="font-semibold text-slate-600 font-mono text-[10px]">
                      Owner: {action.owner} • Target: {action.targetDate}
                    </span>
                  </div>
                  {action.description && (
                    <p className="text-slate-600 text-[11px] mt-1">{action.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Qualitative Auditor Notes */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
              Auditor Observation & Field Evidence
            </h3>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
              {Object.entries(profile.statusNotes).map(([afId, note]) => (
                <div key={afId}>
                  <span className="font-bold text-slate-800">[{afId}]: </span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <div className="border-b border-slate-300 pb-8 font-semibold">
                Client Executive / Chief Procurement Officer
              </div>
              <div className="mt-1">Date: ________________________</div>
            </div>
            <div>
              <div className="border-b border-slate-300 pb-8 font-semibold">
                Lead Assessment Consultant / Sourcing Champions
              </div>
              <div className="mt-1">Date: ________________________</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
