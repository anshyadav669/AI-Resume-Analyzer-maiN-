import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, TrendingUp, Search, GraduationCap, FileCheck, Calculator, CheckCircle2 } from 'lucide-react';
import { getScoreColor } from '../../utils/formatters';

const AnimatedCounter = ({ target = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const steps = 25;
    const stepTime = duration / steps;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

export const ScoreBreakdownCards = ({ scores, detailedScoring = null }) => {
  if (!scores) return null;

  const techScore = Math.round(detailedScoring?.categories?.technical_skills?.score ?? scores.keyword_match_score ?? 75);
  const expScore = Math.round(detailedScoring?.categories?.relevant_experience?.score ?? scores.experience_impact_score ?? 80);
  const kwScore = Math.round(detailedScoring?.categories?.keyword_coverage?.score ?? 80);
  const eduScore = Math.round(detailedScoring?.categories?.education_compatibility?.score ?? scores.education_cert_score ?? 90);
  const structScore = Math.round(detailedScoring?.categories?.structure_and_readability?.score ?? scores.formatting_readability_score ?? 90);

  const formulaStr = detailedScoring?.formula_breakdown || (
    `Overall Score = (${techScore} × 0.40) + (${expScore} × 0.25) + (${kwScore} × 0.15) + (${eduScore} × 0.10) + (${structScore} × 0.10) = ${scores.overall_score}%`
  );

  const cards = [
    {
      title: 'Technical Skills',
      score: techScore,
      weight: '40% weight',
      icon: KeyRound,
      desc: 'Mandatory vs. preferred hard skill alignment with synonym & family credit.',
      contrib: (techScore * 0.40).toFixed(1),
    },
    {
      title: 'Experience & Projects',
      score: expScore,
      weight: '25% weight',
      icon: TrendingUp,
      desc: 'Applied technical stack in work history and academic/personal projects.',
      contrib: (expScore * 0.25).toFixed(1),
    },
    {
      title: 'Keyword Coverage',
      score: kwScore,
      weight: '15% weight',
      icon: Search,
      desc: 'Genuine domain terminology and architecture keywords without filler bias.',
      contrib: (kwScore * 0.15).toFixed(1),
    },
    {
      title: 'Education & Certs',
      score: eduScore,
      weight: '10% weight',
      icon: GraduationCap,
      desc: 'Degree level, STEM field relevance, and accredited cloud/industry credentials.',
      contrib: (eduScore * 0.10).toFixed(1),
    },
    {
      title: 'Resume Structure',
      score: structScore,
      weight: '10% weight',
      icon: FileCheck,
      desc: 'ATS layout parsability, contact completeness, and 1-2 page word count density.',
      contrib: (structScore * 0.10).toFixed(1),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 5 Category Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          const color = getScoreColor(item.score);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800 tracking-wider">
                    {item.weight}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-100 mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{item.desc}</p>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className={`text-xl font-black ${color.text} tracking-tight`}>
                    <AnimatedCounter target={item.score} />%
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    +{item.contrib} pts
                  </span>
                </div>

                {/* Skill match progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.9, delay: 0.1 + idx * 0.08, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${color.gradient}`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Transparent Formula Breakdown Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="glass-panel rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs border border-indigo-500/20"
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-200">Mathematical Formula:</span>
          <code className="text-indigo-300 font-mono text-[11px] bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 break-all">
            {formulaStr}
          </code>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 self-end md:self-auto shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Evidence-Based & Transparent (0–100)</span>
        </div>
      </motion.div>
    </div>
  );
};
