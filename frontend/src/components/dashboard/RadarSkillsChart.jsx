import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Sparkles, BarChart3 } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs">
        <p className="font-semibold text-white mb-1">{data.subject}</p>
        <p className="text-indigo-400 font-medium">Candidate Score: {data.candidate}%</p>
        <p className="text-slate-400">Benchmark Target: {data.benchmark}%</p>
      </div>
    );
  }
  return null;
};

export const RadarSkillsChart = ({ scores }) => {
  if (!scores) return null;

  const data = [
    {
      subject: 'Keyword Match',
      candidate: scores.keyword_match_score,
      benchmark: 85,
    },
    {
      subject: 'Quantifiable Impact',
      candidate: scores.experience_impact_score,
      benchmark: 80,
    },
    {
      subject: 'Formatting & Layout',
      candidate: scores.formatting_readability_score,
      benchmark: 90,
    },
    {
      subject: 'Education & Certs',
      candidate: scores.education_cert_score,
      benchmark: 75,
    },
    {
      subject: 'Overall ATS Score',
      candidate: scores.overall_score,
      benchmark: 85,
    },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Resume Competency Radar
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            5-dimensional alignment comparison against top-tier applicants
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-300">Candidate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="text-slate-500">Target (85%)</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Radar
              name="Target Benchmark"
              dataKey="benchmark"
              stroke="#475569"
              fill="#334155"
              fillOpacity={0.15}
            />
            <Radar
              name="Candidate Score"
              dataKey="candidate"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.35}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Highest dimension:</span>
        <span className="text-white font-medium">
          {scores.keyword_match_score >= scores.formatting_readability_score ? 'Keywords Match' : 'Formatting'} ({Math.max(scores.keyword_match_score, scores.formatting_readability_score)}%)
        </span>
      </div>
    </div>
  );
};
