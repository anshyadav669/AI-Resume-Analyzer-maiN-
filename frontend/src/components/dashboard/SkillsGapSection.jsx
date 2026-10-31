import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const SkillsGapSection = ({
  skillsAnalysis = [],
  missingCritical = [],
  missingBonus = [],
  allSkills = [],
  candidateSkills = [],
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'matched', 'missing_critical', 'missing_bonus'
  const [search, setSearch] = useState('');
  const [copiedSkill, setCopiedSkill] = useState(null);
  const [selectedMissingSkill, setSelectedMissingSkill] = useState(null);

  // Build unified skills list
  const skillList = [];

  // Add candidate demonstrated & mentioned skills if available
  if (candidateSkills && candidateSkills.length > 0) {
    candidateSkills.forEach((s) => {
      skillList.push({
        name: s.name,
        category: s.category || 'General',
        status: 'matched',
        demonstration: s.demonstration_level || 'DEMONSTRATED',
        snippet: s.context_snippet,
      });
    });
  } else if (skillsAnalysis && skillsAnalysis.length > 0) {
    skillsAnalysis.forEach((cat) => {
      cat.matched?.forEach((s) => {
        skillList.push({ name: s, category: cat.category, status: 'matched', demonstration: 'DEMONSTRATED' });
      });
    });
  }

  // Add critical missing skills
  missingCritical?.forEach((s) => {
    if (!skillList.some((item) => item.name.toLowerCase() === s.toLowerCase())) {
      skillList.push({
        name: s,
        category: 'Mandatory Requirement',
        status: 'missing_critical',
        demonstration: 'MISSING',
        tip: `Found in target job posting requirements. ATS parsers scan for exact matches or common aliases of "${s}".`,
      });
    }
  });

  // Add bonus missing skills
  missingBonus?.forEach((s) => {
    if (!skillList.some((item) => item.name.toLowerCase() === s.toLowerCase())) {
      skillList.push({
        name: s,
        category: 'Nice-to-Have / Preferred',
        status: 'missing_bonus',
        demonstration: 'MISSING',
        tip: `Preferred competency mentioned in JD. Adding experience with "${s}" gives bonus points in ranking.`,
      });
    }
  });

  const filteredSkills = skillList.filter((item) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'matched'
        ? item.status === 'matched'
        : filter === item.status;

    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleCopy = (name, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(name);
    setCopiedSkill(name);
    setTimeout(() => setCopiedSkill(null), 1500);
  };

  const matchedCount = skillList.filter((s) => s.status === 'matched').length;
  const criticalCount = skillList.filter((s) => s.status === 'missing_critical').length;
  const bonusCount = skillList.filter((s) => s.status === 'missing_bonus').length;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Technical Skills & Keyword Gap Matrix</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
              {skillList.length} Competencies
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Compare exact technical proficiencies extracted from your resume against target requirements. Click any missing keyword to view ATS integration guidance.
          </p>
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords or tools..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 font-medium ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-glow-sm'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All Keywords ({skillList.length})
        </button>

        <button
          onClick={() => setFilter('matched')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 font-medium flex items-center gap-1.5 ${
            filter === 'matched'
              ? 'bg-emerald-600 text-white shadow-glow-emerald'
              : 'bg-slate-900/80 text-emerald-400 hover:bg-emerald-950/40 border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Matched ({matchedCount})
        </button>

        <button
          onClick={() => setFilter('missing_critical')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 font-medium flex items-center gap-1.5 ${
            filter === 'missing_critical'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900/80 text-rose-400 hover:bg-rose-950/40 border border-slate-800'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Missing Mandatory ({criticalCount})
        </button>

        <button
          onClick={() => setFilter('missing_bonus')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 font-medium flex items-center gap-1.5 ${
            filter === 'missing_bonus'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-900/80 text-amber-400 hover:bg-amber-950/40 border border-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Preferred / Bonus ({bonusCount})
        </button>
      </div>

      {/* Interactive Keyword Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredSkills.map((skill, idx) => {
          const isMatched = skill.status === 'matched';
          const isCritical = skill.status === 'missing_critical';
          const isCopied = copiedSkill === skill.name;
          const isSelected = selectedMissingSkill?.name === skill.name;

          return (
            <div
              key={idx}
              onClick={() => {
                if (!isMatched) {
                  setSelectedMissingSkill(isSelected ? null : skill);
                }
              }}
              className={`group p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 transition-all cursor-pointer ${
                isMatched
                  ? 'bg-emerald-950/15 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/60'
                  : isCritical
                  ? `bg-rose-950/15 border-rose-500/30 text-rose-300 hover:border-rose-500/60 ${isSelected ? 'ring-2 ring-rose-500/50' : ''}`
                  : `bg-amber-950/15 border-amber-500/30 text-amber-300 hover:border-amber-500/60 ${isSelected ? 'ring-2 ring-amber-500/50' : ''}`
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {isMatched ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCritical ? (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <h5 className="text-xs font-bold truncate leading-tight text-white">{skill.name}</h5>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleCopy(skill.name, e)}
                  title="Copy keyword"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white rounded"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400 truncate">{skill.category}</span>
                <span
                  className={`px-1.5 py-0.5 rounded font-mono font-semibold uppercase ${
                    isMatched
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : isCritical
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {skill.demonstration || skill.status}
                </span>
              </div>

              {/* Snippet for matched */}
              {skill.snippet && (
                <p className="text-[10px] text-slate-400 line-clamp-1 italic mt-0.5 border-t border-slate-800/80 pt-1">
                  "{skill.snippet}"
                </p>
              )}

              {/* Click cue for missing */}
              {!isMatched && (
                <div className="text-[10px] text-indigo-400 flex items-center justify-between border-t border-slate-800/80 pt-1">
                  <span>ATS Guidance</span>
                  {isSelected ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded Guidance Drawer for Selected Missing Keyword */}
      {selectedMissingSkill && (
        <div className="rounded-2xl p-4 bg-slate-900/90 border border-indigo-500/30 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              How to Incorporate "{selectedMissingSkill.name}" for Maximum ATS Conviction
            </span>
            <button
              onClick={() => setSelectedMissingSkill(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedMissingSkill.tip || `This keyword is heavily weighted in the job description. Automated screening algorithms filter out applicants that lack explicit evidence of ${selectedMissingSkill.name}.`}
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300">
            <span className="text-[10px] text-slate-500 block mb-1">Recommended Integration Example:</span>
            "Architected and deployed distributed services with {selectedMissingSkill.name}, optimizing query throughput by 35% and reducing system bottlenecks."
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={(e) => handleCopy(selectedMissingSkill.name, e)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy "{selectedMissingSkill.name}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
