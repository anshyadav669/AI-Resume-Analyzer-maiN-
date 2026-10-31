import React from 'react';
import { Heart, Sparkles, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/60 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Powered by Google Gemini API & PyMuPDF Engine</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Zero Data Retention • Client-Side Privacy
          </span>
          <span>© {new Date().getFullYear()} ResumeATS.ai</span>
        </div>
      </div>
    </footer>
  );
};
