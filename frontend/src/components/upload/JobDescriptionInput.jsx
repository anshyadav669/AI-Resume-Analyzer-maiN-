import React, { useState } from 'react';
import { Briefcase, Key, ChevronDown, ChevronUp, Sparkles, Building2 } from 'lucide-react';
import { SAMPLE_JOBS } from '../../utils/formatters';

export const JobDescriptionInput = ({
  jobDescription,
  setJobDescription,
  targetRole,
  setTargetRole,
  customGeminiKey,
  setCustomGeminiKey,
}) => {
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleSelectPreset = (preset) => {
    setJobDescription(preset.text);
    setTargetRole(preset.title);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span>2. Paste Job Description</span>
          <span className="text-xs font-normal text-slate-400">(Target Role & Requirements)</span>
        </label>

        {/* 1-Click Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Presets:</span>
          {SAMPLE_JOBS.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => handleSelectPreset(job)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {job.title.split(' ')[0]} {job.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Target Role input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Briefcase className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="Target Role / Job Title (e.g. Senior Full-Stack Engineer, AI Specialist)"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* JD Textarea */}
      <div className="relative">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job posting requirements, responsibilities, and qualifications here..."
          rows={7}
          className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 p-4 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
        />
        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1 px-1">
          <span>{jobDescription.split(/\s+/).filter(Boolean).length} words</span>
          <span>{jobDescription.length} characters</span>
        </div>
      </div>

      {/* Optional Gemini API Key Toggle */}
      <div className="border border-slate-800/80 rounded-xl p-3 bg-slate-900/40">
        <button
          type="button"
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-300 transition-colors"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            Optional: Custom Google Gemini API Key
          </span>
          {showKeyInput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showKeyInput && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <input
              type="password"
              value={customGeminiKey}
              onChange={(e) => setCustomGeminiKey(e.target.value)}
              placeholder="AIzaSy... (Leave blank to use system key or smart simulation)"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[10px] text-slate-500">
              Your key is only sent directly to your local FastAPI backend and never stored.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
