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
    <div className="w-full max-w-xl mx-auto py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
            <Sparkles className="w-9 h-9 animate-pulse text-blue-600" />
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 mb-2 text-center">
          Analyzing Your Resume
        </h3>
        <p className="text-sm text-slate-600 mb-8 text-center max-w-md">
          Checking your resume against ATS algorithms, keyword density, and hiring manager benchmarks...
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
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900 font-semibold shadow-xs'
                    : isDone
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 font-medium'
                    : 'bg-slate-50/80 border-slate-200 text-slate-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <span className="text-xs sm:text-sm flex-1">
                  {step.label}
                </span>

                {isCurrent && (
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
