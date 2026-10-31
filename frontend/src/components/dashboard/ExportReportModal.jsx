import React from 'react';
import { X, Printer, Download, Check } from 'lucide-react';

export const ExportReportModal = ({ isOpen, onClose, analysisData }) => {
  if (!isOpen || !analysisData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysisData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ats_report_${analysisData.candidate_name || 'candidate'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h3 className="text-base font-bold text-white">ATS Audit Report Summary</h3>
            <p className="text-xs text-slate-400">Ready for review, download, or printing</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {analysisData.candidate_name || 'Candidate Resume Audit'}
              </h2>
              <p className="text-xs text-slate-400">Target Role: {analysisData.target_role_detected}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-indigo-400">
                {analysisData.scores?.overall_score}%
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Overall ATS Score</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              Recruiter Verdict
            </h4>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "{analysisData.recruiter_verdict}"
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-lg font-bold text-white">{analysisData.scores?.keyword_match_score}%</span>
              <p className="text-[10px] text-slate-400">Keywords Match</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-lg font-bold text-white">{analysisData.scores?.experience_impact_score}%</span>
              <p className="text-[10px] text-slate-400">Impact & Metrics</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-lg font-bold text-white">{analysisData.scores?.formatting_readability_score}%</span>
              <p className="text-[10px] text-slate-400">Formatting</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-lg font-bold text-white">{analysisData.scores?.education_cert_score}%</span>
              <p className="text-[10px] text-slate-400">Education</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2">Priority Action Checklist:</h4>
            <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
              {analysisData.action_items_priority?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
