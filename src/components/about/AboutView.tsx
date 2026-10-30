'use client';

import React from 'react';
import { ShieldCheck, Calculator, Sparkles, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-700 text-white p-2.5 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">The 15M Maturity Assessment Methodology</h1>
            <p className="text-xs text-slate-500">
              Recovered & verified authoritative scoring architecture based on the 15M instrument
            </p>
          </div>
        </div>

        <div className="prose prose-sm text-slate-700 max-w-none space-y-4 pt-2">
          <p className="text-xs leading-relaxed">
            The 15M Maturity Assessment is the premier strategic procurement maturity instrument developed by Sourcing Champions.
            This modernized application addresses historical limitations of previous dashboard prototypes by embedding
            the verified mathematical formulas, dynamic planning capabilities, and client company branding.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 space-y-2">
              <h3 className="font-bold text-sm text-teal-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
                Dimension Weighting (5:5:2)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Prior web app implementations incorrectly assumed equal one-third (33.3%) weighting.
                In reality, <strong>Concept</strong> and <strong>Process</strong> carry a weight of 5 each, while
                <strong> Implementation</strong> carries 2.
              </p>
              <div className="font-mono text-xs font-bold text-teal-900 bg-white p-2 rounded border border-teal-200">
                AF Score = (5·Concept + 5·Process + 2·Implementation) / 12
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
              <h3 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                Strategic Partition Weights (25/25/25/15/10)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Strategic Partitions SP1, SP2, and SP3 each carry <strong>25%</strong> of the overall score.
                SP4 (Process & Digital) carries <strong>15%</strong>, and SP5 (Performance Management) carries <strong>10%</strong>.
              </p>
              <div className="font-mono text-xs font-bold text-blue-900 bg-white p-2 rounded border border-blue-200">
                Overall = 0.25·SP1 + 0.25·SP2 + 0.25·SP3 + 0.15·SP4 + 0.10·SP5
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <h3 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                Dynamic Relevance & Denominator Layer
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Every question carries a Priority (0–5) and Relevance (0 or 1).
                Excluding an item automatically redistributes the weight by recomputing the denominator.
              </p>
              <div className="font-mono text-xs font-bold text-amber-900 bg-white p-2 rounded border border-amber-200">
                Score = Σ(prio × rel × answer) / Σ(prio × rel)
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
              <h3 className="font-bold text-sm text-purple-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-700" />
                15-Minute Quick-Check vs Deep Audit
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                The quick check uses the <strong>Integrated Assessment</strong> block (a holistic question per AF with a 5-stage rubric).
                The deep audit evaluates Concept, Process, and Implementation dimensions individually.
              </p>
              <div className="font-mono text-xs font-bold text-purple-900 bg-white p-2 rounded border border-purple-200">
                Quick Check: 15-Minute C-Level Diagnostic
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
