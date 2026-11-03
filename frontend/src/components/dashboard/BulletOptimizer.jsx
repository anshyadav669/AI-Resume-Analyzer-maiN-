import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Lightbulb, Wand2 } from 'lucide-react';
import { optimizeBulletPoint } from '../../services/api';

export const BulletOptimizer = ({ initialBullets = [], targetRole = '' }) => {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [customBullet, setCustomBullet] = useState('');
  const [customResult, setCustomResult] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const handleCustomOptimize = async (e) => {
    e.preventDefault();
    if (!customBullet.trim() || customBullet.trim().length < 10) {
      setError('Please enter at least 10 characters to optimize.');
      return;
    }

    setError(null);
    setIsOptimizing(true);
    try {
      const data = await optimizeBulletPoint({
        bullet: customBullet,
        targetRole,
      });
      setCustomResult(data);
    } catch (err) {
      console.error('Failed to optimize custom bullet:', err);
      setError('Failed to optimize bullet. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Bullet Point Optimizer (Google XYZ Formula)</span>
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            Accomplished [X] measured by [Y] by doing [Z]
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Hiring managers and ATS parsers favor quantifiable, action-driven statements over generic task lists.
        </p>
      </div>

      {/* Recommended Rewrites from Analysis */}
      <div className="space-y-4">
        {initialBullets && initialBullets.length > 0 ? (
          initialBullets.map((item, idx) => {
            const isCopied = copiedIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col gap-4 shadow-xs"
              >
                {/* Before */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    Original Bullet Point:
                  </span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                    "{item.original}"
                  </p>
                </div>

                {/* Critique */}
                {item.critique && (
                  <div className="flex items-start gap-2 text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11px]">
                      <strong className="text-slate-900 font-semibold">Why rewrite: </strong>
                      {item.critique}
                    </p>
                  </div>
                )}

                {/* After */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Recommended High-Impact Rewrite:
                    </span>
                    <button
                      onClick={() => handleCopy(item.improved, idx)}
                      className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Rewrite</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 leading-relaxed">
                    "{item.improved}"
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-500">No initial bullet rewrites provided.</p>
        )}
      </div>

      {/* Interactive Live Bullet Rewriter */}
      <div className="border-t border-slate-200 pt-6">
        <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-blue-600" />
          Test & Rewrite Any Bullet Point
        </h4>
        <p className="text-xs text-slate-500 mb-3">
          Paste any phrase from your resume to generate an instant quantifiable rewrite.
        </p>

        <form onSubmit={handleCustomOptimize} className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={customBullet}
              onChange={(e) => setCustomBullet(e.target.value)}
              placeholder="e.g., Managed databases and wrote backend code for the application..."
              rows={2}
              className="w-full rounded-xl bg-white border border-slate-300 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none shadow-xs"
            />
          </div>

          <div className="flex items-center justify-between">
            {error ? (
              <span className="text-xs text-rose-600 font-medium">{error}</span>
            ) : (
              <span className="text-[11px] text-slate-500">Optimized with Google XYZ formatting</span>
            )}

            <button
              type="submit"
              disabled={isOptimizing || !customBullet.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {isOptimizing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Rewriting...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Rewrite Bullet Point
                </>
              )}
            </button>
          </div>
        </form>

        {customResult && (
          <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Rewritten Output:
              </span>
              <button
                onClick={() => handleCopy(customResult.optimized, 'custom')}
                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                {copiedIdx === 'custom' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-900 font-medium leading-relaxed bg-white p-3 rounded-xl border border-blue-100">
              "{customResult.optimized}"
            </p>
            {customResult.critique && (
              <p className="text-[11px] text-slate-600 mt-1">
                <span className="font-semibold text-slate-800">Analysis: </span>
                {customResult.critique}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
