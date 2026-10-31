import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  Shield,
  FileCheck2,
  AlertCircle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Dropzone } from '../components/upload/Dropzone';
import { JobDescriptionInput } from '../components/upload/JobDescriptionInput';

export const UploadPage = ({
  file,
  setFile,
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  targetRole,
  setTargetRole,
  customGeminiKey,
  setCustomGeminiKey,
  extractedInfo,
  setExtractedInfo,
  isExtracting,
  setIsExtracting,
  onAnalyze,
  error,
  isAnalyzing = false,
}) => {
  const [seniority, setSeniority] = useState('Senior');
  const [strictness, setStrictness] = useState('Enterprise (Workday / Taleo)');

  const canSubmit = (file || (resumeText && resumeText.trim().length >= 50)) && jobDescription.trim().length >= 20;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Workspace Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Interactive Audit Workspace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Upload Resume & Target Job Description
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Provide your candidate credentials and target role requirements. Our dual-pass engine will cross-examine your ATS parseability, skill gaps, and keyword relevance.
        </p>
      </div>

      {/* Validation / Error Banner with Retry */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Analysis Encountered an Issue</p>
              <p className="mt-0.5 text-xs text-rose-300/90">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAnalyze}
            disabled={!canSubmit || isAnalyzing}
            className="shrink-0 px-4 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors self-end sm:self-center cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Analysis</span>
          </button>
        </motion.div>
      )}

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Resume Dropzone */}
        <div className="glass-panel glass-panel-elevated rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between h-full">
          <Dropzone
            file={file}
            setFile={setFile}
            resumeText={resumeText}
            setResumeText={setResumeText}
            extractedInfo={extractedInfo}
            setExtractedInfo={setExtractedInfo}
            isExtracting={isExtracting}
            setIsExtracting={setIsExtracting}
          />
        </div>

        {/* Right: Job Description */}
        <div className="glass-panel glass-panel-elevated rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between h-full">
          <JobDescriptionInput
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            customGeminiKey={customGeminiKey}
            setCustomGeminiKey={setCustomGeminiKey}
          />
        </div>
      </div>

      {/* Additional Screening Options */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Screening Calibration Settings</h4>
            <p className="text-[11px] text-slate-400">Tailor the ATS parser simulation to your target company profile</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Seniority */}
          <div className="flex flex-col gap-1 w-1/2 sm:w-auto">
            <label className="text-[10px] uppercase font-bold text-slate-400">Target Seniority</label>
            <select
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Entry / Junior">Entry / Junior</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Staff / Principal">Staff / Principal</option>
              <option value="Management">Management</option>
            </select>
          </div>

          {/* Strictness */}
          <div className="flex flex-col gap-1 w-1/2 sm:w-auto">
            <label className="text-[10px] uppercase font-bold text-slate-400">ATS Strictness</label>
            <select
              value={strictness}
              onChange={(e) => setStrictness(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Enterprise (Workday / Taleo)">Enterprise (Workday / Taleo)</option>
              <option value="Modern Tech (Greenhouse / Lever)">Modern Tech (Greenhouse / Lever)</option>
              <option value="Standard Heuristics">Standard Heuristics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Analyze Trigger Button */}
      <div className="flex flex-col items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canSubmit || isExtracting || isAnalyzing}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base flex items-center justify-center gap-3 shadow-glow-md hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running Deep ATS Audit...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Run AI Resume Analysis & Calculate Score</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          Files are processed securely in memory and never shared.
        </p>
      </div>
    </div>
  );
};
