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
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-navy-900/80 to-slate-950 shadow-glow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Executive Hiring Manager & Recruiter Verdict
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal italic">
          "{verdict || 'Analysis complete. Detailed section evaluations and improvement steps are outlined below.'}"
        </p>

        {educationCompatibility && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              <strong className="text-slate-200">Education Compatibility:</strong> {educationCompatibility.degree_found || 'Degree detected'} ({educationCompatibility.field_relevance || 'Compatible'})
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
              educationCompatibility.is_compatible
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {educationCompatibility.is_compatible ? 'Education Criteria Met' : 'Experience Equivalence'}
            </span>
          </div>
        )}
      </div>

      {/* Strengths & Weaknesses 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Key Competitive Strengths</span>
            </h4>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {strengths.length} Verified
            </span>
          </div>
          <ul className="space-y-3">
            {strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Red Flags */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Critical Gaps & ATS Red Flags</span>
            </h4>
            <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              {weaknesses.length} Flags
            </span>
          </div>
          <ul className="space-y-3">
            {weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section-by-Section ATS Structure Review */}
      {sectionsReview && sectionsReview.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Section-by-Section ATS Evaluation Cards</span>
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
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden transition-all hover:border-slate-700"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedSection(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          isOptimal
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {sec.status}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {sec.section_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-[11px] hidden sm:inline">
                        {isExpanded ? 'Collapse' : 'View AI Recommendations'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 flex flex-col gap-4 text-xs bg-slate-950/40">
                      {sec.observations && sec.observations.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            Observations:
                          </p>
                          <ul className="space-y-1.5 text-slate-300">
                            {sec.observations.map((obs, oIdx) => (
                              <li key={oIdx} className="flex items-start gap-2 leading-relaxed">
                                <span className="text-slate-500 shrink-0">•</span>
                                <span>{obs}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.recommendations && sec.recommendations.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Recommended ATS Improvements:
                          </p>
                          <ul className="space-y-1.5 text-indigo-200">
                            {sec.recommendations.map((rec, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2 leading-relaxed">
                                <span className="text-indigo-400 font-bold shrink-0">→</span>
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
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Priority Action Checklist (Ranked by ATS Impact)</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Check off tasks as you update your resume</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300">
                {doneCount} of {actionItems.length} Completed ({progressPct}%)
              </span>
              <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
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
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <button type="button" className="shrink-0 text-slate-400">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  <span className={`text-xs ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
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
