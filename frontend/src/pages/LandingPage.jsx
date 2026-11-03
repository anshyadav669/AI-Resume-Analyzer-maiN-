import React from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Search,
  TrendingUp,
  FileText,
  Star,
  Sparkles,
  Zap,
  Check,
  Upload,
  AlertCircle,
  Award,
} from 'lucide-react';

export const LandingPage = ({ onGetStarted, onDemoResults }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Rating Social Proof Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold"
          >
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span>Rated 4.9/5 by 120,000+ Job Seekers</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
          >
            Free AI Resume Checker:{' '}
            <span className="text-blue-600">Get Your ATS Score in 10s</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Over 75% of resumes are filtered out by Applicant Tracking Systems before a human reads them.
            Upload your resume to uncover formatting issues, identify missing keywords, and get instant recruiter feedback.
          </motion.p>
        </div>

        {/* Hero Interactive Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <div 
            onClick={onGetStarted}
            className="border-2 border-dashed border-blue-300 hover:border-blue-600 bg-blue-50/20 hover:bg-blue-50/50 rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer shadow-xs hover:shadow-md group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center mx-auto mb-4 transition-colors">
              <Upload className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Drop your resume here (PDF) or click to browse
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Supports standard PDF documents up to 10MB • Fast & 100% confidential
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onGetStarted}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Upload & Score Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDemoResults();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm transition-all"
              >
                View Sample Report
              </button>
            </div>
          </div>

          {/* Confidentiality and Security Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Zero data stored
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Instant 30+ ATS Checks
            </span>
            <span>•</span>
            <span>No account required</span>
          </div>
        </motion.div>

        {/* ATS Brand Compatibility logos */}
        <div className="mt-16 pt-10 border-t border-slate-100 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
            Tested against algorithms used by leading Applicant Tracking Systems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-bold text-slate-400">
            <span>Workday</span>
            <span>Greenhouse</span>
            <span>Lever</span>
            <span>Taleo</span>
            <span>iCIMS</span>
            <span>SAP SuccessFactors</span>
          </div>
        </div>
      </section>

      {/* 3 Core Benefits Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Everything Recruiters Look For, Analyzed in Seconds
            </h2>
            <p className="text-sm text-slate-600">
              Unlike simplistic keyword counters, our engine evaluates structural readability, skill evidence, and quantifiable impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Benefit 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">1. ATS Parseability & Layout</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verify that your PDF doesn't break in ATS parsers. We audit font encodings, multi-column reading flow, and standard section headers.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">2. Keyword & Skills Gap</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identify mandatory hard skills, technical synonyms, and optional nice-to-haves directly from your target job description.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">3. Google XYZ Rewriter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turn passive bullet points into high-impact accomplishment bullets using the Google XYZ formula: "Accomplished [X] measured by [Y] by doing [Z]".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After Preview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Real Impact</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            See How Small Fixes Double Your Score
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Here is how a real candidate's resume transforms from filtered-out to interview-competitive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Before Card */}
          <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  Before: 54% Score (Filtered Out)
                </span>
                <span className="text-xs text-slate-400">Standard Resume</span>
              </div>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100">
                  <p className="font-semibold text-slate-800 mb-1">❌ Weak Bullet:</p>
                  <p className="italic">"Helped maintain backend API and fixed database bugs for the team."</p>
                </div>
                <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100">
                  <p className="font-semibold text-slate-800 mb-1">❌ Missing ATS Keywords:</p>
                  <p>FastAPI, Redis Caching, Microservices, CI/CD, Unit Testing</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-rose-600 font-medium">Recruiter verdict: Lacks measurable evidence and core JD keywords.</p>
          </div>

          {/* After Card */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  After: 85% Score (Top 5% Tier)
                </span>
                <span className="text-xs text-emerald-600 font-medium">Interview Ready</span>
              </div>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100">
                  <p className="font-semibold text-slate-800 mb-1">✅ Google XYZ Bullet:</p>
                  <p className="italic">"Architected FastAPI backend with Redis caching, reducing query latency by 48% and serving 500k+ MAU."</p>
                </div>
                <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100">
                  <p className="font-semibold text-slate-800 mb-1">✅ Skills Verified in Context:</p>
                  <p>18/20 skills demonstrated in experience and portfolio projects.</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-emerald-600 font-medium">Recruiter verdict: Competitive candidate with proven high-scale impact.</p>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onGetStarted}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Check Your Resume For Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
