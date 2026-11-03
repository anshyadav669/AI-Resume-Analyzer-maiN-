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
        <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>2. Target Job Description</span>
          <span className="text-xs font-normal text-slate-500">(Role & Requirements)</span>
        </label>

        {/* 1-Click Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Quick presets:</span>
          {SAMPLE_JOBS.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => handleSelectPreset(job)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              {job.title.split(' ')[0]} {job.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Target Role input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Briefcase className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="Target Role / Job Title (e.g. Senior Full-Stack Engineer, AI Specialist)"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
        />
      </div>

      {/* JD Textarea */}
      <div className="relative">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job posting requirements, responsibilities, and qualifications here..."
          rows={7}
          className="w-full rounded-xl bg-white border border-slate-300 p-4 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-xs"
        />
        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1 px-1 font-medium">
          <span>{jobDescription.split(/\s+/).filter(Boolean).length} words</span>
          <span>{jobDescription.length} characters</span>
        </div>
      </div>

      {/* Optional Gemini API Key Toggle */}
      <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70">
        <button
          type="button"
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Key className="w-3.5 h-3.5 text-blue-600" />
            Optional: Custom Google Gemini API Key
          </span>
          {showKeyInput ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showKeyInput && (
          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2">
            <input
              type="password"
              value={customGeminiKey}
              onChange={(e) => setCustomGeminiKey(e.target.value)}
              placeholder="AIzaSy... (Leave blank to use system key or smart simulation)"
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-mono shadow-xs"
            />
            <p className="text-[11px] text-slate-500">
              Your key is only sent directly to your local FastAPI backend and never stored.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
