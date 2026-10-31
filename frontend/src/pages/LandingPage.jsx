import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  TrendingUp,
  FileText,
  BarChart2,
  Wand2,
  Award,
  Zap,
  Layers,
  ChevronRight,
  Eye,
} from 'lucide-react';

export const LandingPage = ({ onGetStarted, onDemoResults }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-radial-gradient pointer-events-none" />
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-glow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Next-Gen Enterprise ATS Simulator & Optimizer</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-indigo-400 font-mono text-[11px]">v2.5 Live</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
          >
            Pass Modern ATS Filters.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400 bg-clip-text text-transparent">
              Land Top 1% Interviews.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Over 75% of resumes are discarded by automated screening software before a recruiter ever reads them.
            Audit your resume with deep semantic AI and rewrite achievements using the Google XYZ formula.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base flex items-center justify-center gap-3 shadow-glow-md hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <Zap className="w-5 h-5 text-indigo-200" />
              <span>Audit Your Resume Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onDemoResults}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel hover:bg-slate-900/90 text-slate-200 hover:text-white font-semibold text-base flex items-center justify-center gap-2.5 transition-all border border-slate-800 hover:border-indigo-500/40"
            >
              <Eye className="w-5 h-5 text-indigo-400" />
              <span>Explore Live Demo Dashboard</span>
            </button>
          </motion.div>

          {/* Trust Metrics Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No signup or credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Strict client-side privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Enterprise ATS benchmarks</span>
            </div>
          </motion.div>
        </div>

        {/* Floating Mock Hero Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 sm:mt-20 max-w-5xl mx-auto"
        >
          <div className="relative p-2 sm:p-3 rounded-3xl bg-gradient-to-b from-indigo-500/20 via-slate-800/20 to-transparent border border-indigo-500/30 shadow-2xl backdrop-blur-xl">
            {/* Inner Dashboard Mock Card */}
            <div className="rounded-2xl bg-navy-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-glow-sm">
                    AC
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Alex Chen
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        ATS PASSED
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Senior Full-Stack Engineer • Nexus Cloud Technologies</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-3xl font-black text-indigo-400">84%</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Overall Match</p>
                  </div>
                  <div className="h-9 w-px bg-slate-800" />
                  <div className="text-right">
                    <span className="text-3xl font-black text-emerald-400">86%</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Keywords Score</p>
                  </div>
                </div>
              </div>

              {/* Sample XYZ Rewrite Teaser */}
              <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5" />
                    Google XYZ Formula In Action
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Impact Score: +42%</span>
                </div>
                <p className="text-xs text-slate-400 line-through font-mono">
                  "Responsible for developing backend APIs and managing server deployment."
                </p>
                <p className="text-xs text-emerald-300 font-mono">
                  → "Architected 12+ RESTful microservices in FastAPI/PostgreSQL, reducing API latency by 42% and sustaining 99.99% uptime across 500k+ MAU."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3-Step Process Section */}
      <section className="py-20 border-t border-slate-900 bg-navy-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Streamlined Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Upload to Optimized in 3 Seconds
            </h2>
            <p className="text-sm text-slate-400">
              No guesswork. Learn exactly what hiring algorithms and recruiter screening teams look for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Upload Resume & Target JD</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Drag and drop your PDF resume. Our PyMuPDF engine extracts structural blocks, contact data, and multi-column text seamlessly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Deep Semantic Audit</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Google Gemini cross-references your qualifications against job criteria, identifying critical missing skills and keyword deficiencies.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Optimize with Google XYZ</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Receive customized, bullet-by-bullet rewrites that quantify your achievements and an actionable checklist to maximize callbacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Engineered For Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive ATS Compatibility Suite
          </h2>
          <p className="text-sm text-slate-400">
            Everything you need to transform a good resume into an undeniable interview magnet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Multi-Axis Radar Analysis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visual 5-dimensional breakdown comparing your candidate score against top 10% applicant benchmarks.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Skills Gap Matrix</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant classification of matched hard skills vs. critical missing keywords required by automated parsers.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Google XYZ Rewriter</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transforms passive duties into high-impact bullet statements: Accomplished [X] as measured by [Y] by doing [Z].
            </p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Recruiter Verdict & Checklist</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct executive summary feedback with an interactive priority checklist ranked by score enhancement.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl glass-panel-elevated p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Stop Getting Filtered Out by Bots.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Upload your resume and target job description now to see your exact ATS compatibility score and recommended fixes.
            </p>
            <div className="pt-2">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base inline-flex items-center gap-3 shadow-glow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Start Free Resume Audit</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
