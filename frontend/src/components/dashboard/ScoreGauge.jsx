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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs relative overflow-hidden">
      {/* Ambient soft glow */}
      <div 
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: color.stroke }}
      />

      {/* Left Details */}
      <div className="flex-1 space-y-3 text-center md:text-left z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
          <Target className="w-3.5 h-3.5 text-blue-600" />
          <span>Target Job Role:</span>
          <span className="font-semibold text-slate-900">{targetRole || 'Software Engineer'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {candidateName ? `${candidateName}'s Resume Score` : 'Resume Audit Score'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
          Evaluated against top ATS algorithms (Workday, Taleo, Greenhouse) and recruiter screening benchmarks.
        </p>

        <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${color.bg} ${color.text} border ${color.border}`}>
            <Award className="w-4 h-4" />
            {badgeText}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Mathematical 5-pillar composite scoring
          </span>
        </div>
      </div>

      {/* Right Circular Gauge */}
      <div className="relative flex items-center justify-center shrink-0 z-10">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="96"
            cy="96"
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
          <span className="text-5xl font-black text-slate-900 tracking-tight">
            {animatedScore}
            <span className="text-2xl text-slate-500 font-bold">%</span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
            Overall ATS Score
          </span>
        </div>
      </div>
    </div>
  );
};
