import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Award, Sparkles } from 'lucide-react';
import { getScoreColor, getScoreBadge, triggerConfetti } from '../../utils/formatters';

export const ScoreGauge = ({ score = 0, candidateName, targetRole }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = getScoreColor(score);
  const badgeText = getScoreBadge(score);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
        if (score >= 80) {
          triggerConfetti();
        }
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // SVG Gauge calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div 
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: color.stroke }}
      />

      {/* Left Details */}
      <div className="flex-1 space-y-3 text-center md:text-left z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>Role Match Target:</span>
          <span className="font-semibold text-white">{targetRole || 'Software Engineer'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {candidateName ? `${candidateName}'s Resume Audit` : 'Resume Audit Complete'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
          Based on modern ATS parsing criteria (Workday, Greenhouse) and technical recruiter screening benchmarks.
        </p>

        <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${color.bg} ${color.text} border ${color.border}`}>
            <Award className="w-4 h-4" />
            {badgeText}
          </span>
          <span className="text-xs text-slate-500">
            Weighted composite scoring
          </span>
        </div>
      </div>

      {/* Right Circular Gauge */}
      <div className="relative flex items-center justify-center shrink-0 z-10">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            className="text-slate-800/80"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="88"
            cy="88"
            r={radius}
            stroke={color.stroke}
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-white tracking-tight">
            {animatedScore}
            <span className="text-xl text-slate-400 font-normal">%</span>
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
            ATS Score
          </span>
        </div>
      </div>
    </div>
  );
};
