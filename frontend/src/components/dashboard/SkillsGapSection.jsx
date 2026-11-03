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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Skills & Keyword Match Analysis</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              {skillList.length} Skills Analyzed
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Compare skills found on your resume against the target job requirements. Click any missing skill to see practical advice for including it.
          </p>
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter skills or keywords..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-xs font-semibold'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          All Keywords ({skillList.length})
        </button>

        <button
          onClick={() => setFilter('matched')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 font-medium flex items-center gap-1.5 ${
            filter === 'matched'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Matched ({matchedCount})
        </button>

        <button
          onClick={() => setFilter('missing_critical')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 font-medium flex items-center gap-1.5 ${
            filter === 'missing_critical'
              ? 'bg-rose-600 text-white shadow-xs font-semibold'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Missing Mandatory ({criticalCount})
        </button>

        <button
          onClick={() => setFilter('missing_bonus')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 font-medium flex items-center gap-1.5 ${
            filter === 'missing_bonus'
              ? 'bg-amber-600 text-white shadow-xs font-semibold'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
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
              className={`group p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 transition-all cursor-pointer shadow-xs ${
                isMatched
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 hover:border-emerald-400'
                  : isCritical
                  ? `bg-rose-50/50 border-rose-200 text-rose-900 hover:border-rose-400 ${isSelected ? 'ring-2 ring-rose-400' : ''}`
                  : `bg-amber-50/50 border-amber-200 text-amber-900 hover:border-amber-400 ${isSelected ? 'ring-2 ring-amber-400' : ''}`
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {isMatched ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCritical ? (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <h5 className="text-xs font-bold truncate leading-tight text-slate-900">{skill.name}</h5>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleCopy(skill.name, e)}
                  title="Copy keyword"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-700 rounded"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 truncate font-medium">{skill.category}</span>
                <span
                  className={`px-1.5 py-0.5 rounded font-mono font-bold uppercase text-[9px] ${
                    isMatched
                      ? 'bg-emerald-100 text-emerald-800'
                      : isCritical
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {skill.demonstration || skill.status}
                </span>
              </div>

              {/* Snippet for matched */}
              {skill.snippet && (
                <p className="text-[10px] text-slate-600 line-clamp-1 italic mt-0.5 border-t border-slate-200/80 pt-1 font-medium">
                  "{skill.snippet}"
                </p>
              )}

              {/* Click cue for missing */}
              {!isMatched && (
                <div className="text-[10px] text-blue-600 font-semibold flex items-center justify-between border-t border-slate-200/80 pt-1">
                  <span>How to add</span>
                  {isSelected ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded Guidance Drawer for Selected Missing Keyword */}
      {selectedMissingSkill && (
        <div className="rounded-2xl p-5 bg-blue-50/50 border border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              How to include "{selectedMissingSkill.name}" in your resume
            </span>
            <button
              onClick={() => setSelectedMissingSkill(null)}
              className="text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {selectedMissingSkill.tip || `This skill appears frequently in this job's requirements. Adding measurable experience using ${selectedMissingSkill.name} will significantly improve your match score.`}
          </p>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Recommended bullet pattern:</span>
            <p className="font-sans text-slate-700">
              "Leveraged <span className="font-semibold text-blue-700">{selectedMissingSkill.name}</span> to optimize data workflows and automate test suites, driving a 25% efficiency gain across engineering deliverables."
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={(e) => handleCopy(selectedMissingSkill.name, e)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
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
