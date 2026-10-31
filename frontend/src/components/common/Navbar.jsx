import React, { useState, useEffect } from 'react';
import { FileCheck, Sparkles, Sun, Moon, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { checkHealth } from '../../services/api';

export const Navbar = ({ currentPage, onNavigate, backendHealthy = null }) => {
  const { theme, toggleTheme } = useTheme();
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
    <header className="sticky top-0 z-40 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200/80 bg-navy-950/85 dark:bg-navy-950/85 bg-white/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform">
            <FileCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg dark:text-white text-slate-900 tracking-tight">
                ResumeATS<span className="text-indigo-500">.ai</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI-Powered ATS Score & Resume Optimizer</p>
          </div>
        </div>

        {/* Center Page Nav links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 dark:bg-slate-900/60 bg-slate-100/90 border border-slate-800/80 dark:border-slate-800/80 border-slate-200 rounded-xl p-1 text-xs transition-colors">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              currentPage === 'landing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              currentPage === 'upload'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Workspace
          </button>
          <button
            type="button"
            onClick={() => onNavigate('results')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              currentPage === 'results'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Results Dashboard
          </button>
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Backend Status Pill */}
          <div 
            title={isHealthy ? "FastAPI backend is connected and healthy" : "Running in client fallback/smart simulation mode"}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 dark:bg-slate-900/80 bg-slate-100 border border-slate-800 dark:border-slate-800 border-slate-200 text-[11px] text-slate-300 dark:text-slate-300 text-slate-700 transition-colors"
          >
            <span 
              className={`w-2 h-2 rounded-full ${
                isHealthy === true 
                  ? 'bg-emerald-400 animate-pulse' 
                  : isHealthy === false 
                  ? 'bg-amber-400' 
                  : 'bg-indigo-400'
              }`} 
            />
            <span className="font-medium text-xs">
              {isHealthy === true ? 'FastAPI Online' : isHealthy === false ? 'Smart Fallback' : 'Connecting...'}
            </span>
          </div>

          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className="p-2 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-800 hover:bg-slate-200 border border-slate-800 dark:border-slate-800 border-slate-200 text-slate-300 dark:text-slate-300 text-slate-700 transition-all cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform -rotate-12 hover:rotate-0" />
            )}
          </button>

          {/* Scan Action Button */}
          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Scan Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
