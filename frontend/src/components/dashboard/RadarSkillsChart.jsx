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
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-md text-xs">
        <p className="font-bold text-slate-900 mb-1">{data.subject}</p>
        <p className="text-blue-600 font-semibold">Candidate: {data.candidate}%</p>
        <p className="text-slate-500">Benchmark: {data.benchmark}%</p>
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
      subject: 'Experience & Projects',
      candidate: scores.experience_impact_score,
      benchmark: 80,
    },
    {
      subject: 'Layout & Structure',
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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between h-full shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Resume Competency Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            5-dimensional alignment comparison against top-tier applicants
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-700 font-medium">Candidate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="text-slate-500">Benchmark (85%)</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <Radar
              name="Target Benchmark"
              dataKey="benchmark"
              stroke="#cbd5e1"
              fill="#f1f5f9"
              fillOpacity={0.6}
            />
            <Radar
              name="Candidate Score"
              dataKey="candidate"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.35}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between font-medium">
        <span>Highest scoring area:</span>
        <span className="text-slate-900 font-bold">
          {scores.keyword_match_score >= scores.formatting_readability_score ? 'Keywords Match' : 'Layout & Formatting'} ({Math.max(scores.keyword_match_score, scores.formatting_readability_score)}%)
        </span>
      </div>
    </div>
  );
};
