import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Sparkles, CheckCircle2, Cpu, BrainCircuit } from 'lucide-react';

const STEPS = [
  { label: 'Parsing PDF Layout & Extracting Text Blocks', icon: FileSearch },
  { label: 'Auditing Contact Completeness & ATS Parsability', icon: CheckCircle2 },
  { label: 'Cross-Referencing Hard Skills & Industry Keywords', icon: Cpu },
  { label: 'Synthesizing Recruiter Insights & Google XYZ Rewrites', icon: BrainCircuit },
];

export const AnalysisStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const intervals = [
      setTimeout(() => setActiveStep(1), 1200),
      setTimeout(() => setActiveStep(2), 2600),
      setTimeout(() => setActiveStep(3), 4200),
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-6 flex flex-col items-center justify-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
          <Sparkles className="w-10 h-10 animate-pulse text-indigo-400" />
        </div>
        <div className="absolute -inset-2 rounded-full border border-indigo-500/20 border-t-indigo-400 animate-spin" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2 text-center">
        Analyzing ATS Compatibility
      </h3>
      <p className="text-xs text-slate-400 mb-8 text-center max-w-md">
        Running deterministic heuristic screening and Google Gemini semantic alignment...
      </p>

      {/* Stepper indicators */}
      <div className="w-full space-y-3">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = activeStep > idx;
          const isCurrent = activeStep === idx;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/5'
                  : isDone
                  ? 'bg-slate-900/40 border-slate-800/80 text-slate-300'
                  : 'bg-slate-950 border-slate-900 text-slate-600'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : 'bg-slate-900 text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <span className="text-xs font-medium flex-1">
                {step.label}
              </span>

              {isCurrent && (
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
