import React from 'react';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="font-medium text-slate-700">ResumeChecker</span>
          <span>• Inspired by industry-leading ATS parsers & Enhancv guidelines</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Private & Confidential • No Data Stored
          </span>
          <span className="text-slate-400">© {new Date().getFullYear()} ResumeChecker</span>
        </div>
      </div>
    </footer>
  );
};
