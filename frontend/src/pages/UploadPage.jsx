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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Resume & Job Match Workspace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Upload Resume & Paste Job Description
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Provide your candidate credentials and target job requirements. Our ATS engine will cross-examine your ATS parseability, skill gaps, and keyword relevance.
        </p>
      </div>

      {/* Validation / Error Banner with Retry */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-900">Analysis Encountered an Issue</p>
              <p className="mt-0.5 text-xs text-rose-700">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAnalyze}
            disabled={!canSubmit || isAnalyzing}
            className="shrink-0 px-4 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-colors self-end sm:self-center cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Analysis</span>
          </button>
        </motion.div>
      )}

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Resume Dropzone */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between h-full">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between h-full">
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
      <div className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Screening Calibration Settings</h4>
            <p className="text-xs text-slate-500">Tailor the ATS parser simulation to your target company profile</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Seniority */}
          <div className="flex flex-col gap-1 w-1/2 sm:w-auto">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Target Seniority</label>
            <select
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
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
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">ATS Strictness</label>
            <select
              value={strictness}
              onChange={(e) => setStrictness(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
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
          className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Your Resume...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-blue-200" />
              <span>Run AI Resume Analysis & Calculate Score</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Your resume is encrypted, processed in-memory, and never stored or shared.</span>
        </p>
      </div>
    </div>
  );
};
