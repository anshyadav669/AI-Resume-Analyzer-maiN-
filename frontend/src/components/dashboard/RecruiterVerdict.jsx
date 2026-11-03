import React, { useState } from 'react';
import {
  MessageSquareQuote,
  CheckCircle,
  AlertCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const RecruiterVerdict = ({
  verdict,
  strengths = [],
  weaknesses = [],
  sectionsReview = [],
  actionItems = [],
  educationCompatibility = null,
}) => {
  const [completedActions, setCompletedActions] = useState({});
  const [expandedSection, setExpandedSection] = useState(0); // expand first section by default

  const toggleAction = (idx) => {
    setCompletedActions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const doneCount = Object.values(completedActions).filter(Boolean).length;
  const progressPct = actionItems.length > 0 ? Math.round((doneCount / actionItems.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Executive Recruiter Verdict Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Recruiter Summary & Hiring Manager Assessment
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal italic">
          "{verdict || 'Analysis complete. Detailed section evaluations and improvement steps are outlined below.'}"
        </p>

        {educationCompatibility && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              <strong className="text-slate-800 font-semibold">Education Evaluation:</strong> {educationCompatibility.degree_found || 'Degree detected'} ({educationCompatibility.field_relevance || 'Compatible'})
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
              educationCompatibility.is_compatible
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {educationCompatibility.is_compatible ? 'Education Criteria Met' : 'Experience Equivalence'}
            </span>
          </div>
        )}
      </div>

      {/* Strengths & Weaknesses 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Key Resume Strengths</span>
            </h4>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {strengths.length} Verified
            </span>
          </div>
          <ul className="space-y-3">
            {strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Red Flags */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Critical Gaps & ATS Fixes</span>
            </h4>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              {weaknesses.length} Flags
            </span>
          </div>
          <ul className="space-y-3">
            {weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section-by-Section ATS Structure Review */}
      {sectionsReview && sectionsReview.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Section-by-Section Resume Evaluation</span>
            </h4>
            <span className="text-xs text-slate-500">Expandable AI Audits</span>
          </div>

          <div className="space-y-3">
            {sectionsReview.map((sec, idx) => {
              const isExpanded = expandedSection === idx;
              const isOptimal = sec.status === 'OPTIMAL';

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedSection(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          isOptimal
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sec.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {sec.section_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="text-[11px] hidden sm:inline font-medium">
                        {isExpanded ? 'Collapse' : 'View Recommendations'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-3 border-t border-slate-200 flex flex-col gap-4 text-xs bg-white">
                      {sec.observations && sec.observations.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Observations:
                          </p>
                          <ul className="space-y-1.5 text-slate-700">
                            {sec.observations.map((obs, oIdx) => (
                              <li key={oIdx} className="flex items-start gap-2 leading-relaxed">
                                <span className="text-slate-400 shrink-0">•</span>
                                <span>{obs}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.recommendations && sec.recommendations.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-1.5 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            Recommended ATS Improvements:
                          </p>
                          <ul className="space-y-1.5 text-slate-800 font-medium">
                            {sec.recommendations.map((rec, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2 leading-relaxed">
                                <span className="text-blue-600 font-bold shrink-0">→</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Priority Action Checklist */}
      {actionItems && actionItems.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Action Checklist (Ranked by ATS Impact)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Check off tasks as you update your resume</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">
                {doneCount} of {actionItems.length} Completed ({progressPct}%)
              </span>
              <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {actionItems.map((item, idx) => {
              const isChecked = !!completedActions[idx];

              return (
                <div
                  key={idx}
                  onClick={() => toggleAction(idx)}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <button type="button" className="shrink-0 text-slate-400">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <span className={`text-xs font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
