import React, { useState, useEffect } from 'react';
import { FileCheck2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { checkHealth } from '../../services/api';

export const Navbar = ({ currentPage, onNavigate, backendHealthy = null }) => {
  const [isHealthy, setIsHealthy] = useState(backendHealthy);

  useEffect(() => {
    let isMounted = true;
    checkHealth()
      .then((data) => {
        if (isMounted) {
          setIsHealthy(data?.status === 'healthy');
        }
      })
      .catch(() => {
        if (isMounted) setIsHealthy(false);
      });
    return () => {
      isMounted = false;
    };
  }, [backendHealthy]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <FileCheck2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Resume<span className="text-blue-600">Checker</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                FREE ATS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">AI-Powered ATS Score & Resume Optimizer</p>
          </div>
        </div>

        {/* Center Page Nav links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 border border-slate-200 rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              currentPage === 'landing'
                ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              currentPage === 'upload'
                ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Check Resume
          </button>
          <button
            type="button"
            onClick={() => onNavigate('results')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              currentPage === 'results'
                ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Sample Results
          </button>
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Backend Status Pill */}
          <div 
            title={isHealthy ? "FastAPI backend is connected and healthy" : "Running in client fallback/smart simulation mode"}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600"
          >
            <span 
              className={`w-2 h-2 rounded-full ${
                isHealthy === true 
                  ? 'bg-emerald-500 animate-pulse' 
                  : isHealthy === false 
                  ? 'bg-amber-500' 
                  : 'bg-blue-500'
              }`} 
            />
            <span className="font-medium text-xs text-slate-700">
              {isHealthy === true ? 'FastAPI Online' : isHealthy === false ? 'Smart Fallback' : 'Checking...'}
            </span>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>Scan Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
