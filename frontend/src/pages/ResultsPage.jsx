import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Printer,
  RotateCcw,
  Sparkles,
  LayoutDashboard,
  Cpu,
  Wand2,
  ListChecks,
  Share2,
  Check,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

import { ScoreGauge } from '../components/dashboard/ScoreGauge';
import { ScoreBreakdownCards } from '../components/dashboard/ScoreBreakdownCards';
import { RadarSkillsChart } from '../components/dashboard/RadarSkillsChart';
import { SkillsGapSection } from '../components/dashboard/SkillsGapSection';
import { BulletOptimizer } from '../components/dashboard/BulletOptimizer';
import { RecruiterVerdict } from '../components/dashboard/RecruiterVerdict';
import { ExportReportModal } from '../components/dashboard/ExportReportModal';

export const ResultsPage = ({ analysisData, onBackToUpload, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!analysisData) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBackToUpload}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Upload Workspace</span>
        </button>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Audit'}</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>Print / PDF Export</span>
          </button>

          <button
            onClick={onNewAnalysis}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Resume Audit</span>
          </button>
        </div>
      </div>

      {/* Hero Circular Gauge Section */}
      <ScoreGauge
        score={analysisData.scores?.overall_score || 0}
        candidateName={analysisData.candidate_name}
        targetRole={analysisData.target_role_detected}
      />

      {/* 5-Dimension Mathematical Score Metric Cards */}
      <ScoreBreakdownCards scores={analysisData.scores} detailedScoring={analysisData.detailed_scoring} />

      {/* Tab Navigation Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Competency Radar & Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Skills & Keyword Match</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-700 font-semibold border border-slate-200">
            {analysisData.skills_analysis?.reduce((acc, c) => acc + (c.matched?.length || 0) + (c.missing?.length || 0), 0) || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('optimizer')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'optimizer'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Google XYZ Bullet Optimizer</span>
        </button>

        <button
          onClick={() => setActiveTab('verdict')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'verdict'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>Recruiter Verdict & Checklist</span>
        </button>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <RadarSkillsChart scores={analysisData.scores} />

              <div className="flex flex-col gap-6">
                {/* Executive Recruiter Verdict Summary */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-bold text-slate-900">Executive Recruiter Verdict</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      "{analysisData.recruiter_verdict}"
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Target Role Match:</span>
                    <span className="text-blue-700 font-bold">{analysisData.target_role_detected}</span>
                  </div>
                </div>

                {/* Top Action Items Checklist Preview */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex-1 flex flex-col justify-between shadow-xs">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-blue-600" />
                      <span>Top Priority Score Boosters</span>
                    </h4>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {analysisData.action_items_priority?.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-blue-600 font-bold shrink-0">#{idx + 1}</span>
                          <span className="leading-relaxed font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setActiveTab('verdict')}
                    className="mt-5 text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1.5 self-start cursor-pointer"
                  >
                    <span>View full action plan & section audits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <SkillsGapSection
              skillsAnalysis={analysisData.skills_analysis}
              missingCritical={analysisData.missing_critical_skills}
              missingBonus={analysisData.missing_bonus_skills}
              allSkills={analysisData.all_skills}
            />
          )}

          {activeTab === 'optimizer' && (
            <BulletOptimizer
              initialBullets={analysisData.bullet_improvements}
              targetRole={analysisData.target_role_detected}
            />
          )}

          {activeTab === 'verdict' && (
            <RecruiterVerdict
              verdict={analysisData.recruiter_verdict}
              strengths={analysisData.strengths}
              weaknesses={analysisData.weaknesses}
              sectionsReview={analysisData.sections_review}
              actionItems={analysisData.action_items_priority}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        analysisData={analysisData}
      />
    </div>
  );
};
