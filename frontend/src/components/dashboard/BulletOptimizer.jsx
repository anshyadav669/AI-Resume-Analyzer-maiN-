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
    <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Bullet Point Optimizer (Google XYZ Formula)</span>
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
            Accomplished [X] measured by [Y] by doing [Z]
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          ATS parsers and senior recruiters rank achievement-oriented, metric-driven statements significantly higher than passive duty descriptions.
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
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col gap-4 hover:border-slate-700 transition-all"
              >
                {/* Before */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    Original Bullet Point:
                  </span>
                  <p className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-900">
                    "{item.original}"
                  </p>
                </div>

                {/* Critique */}
                {item.critique && (
                  <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11px]">
                      <strong className="text-slate-300">Why optimize: </strong>
                      {item.critique}
                    </p>
                  </div>
                )}

                {/* After */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      AI Recommended Rewrite (High Impact):
                    </span>
                    <button
                      onClick={() => handleCopy(item.improved, idx)}
                      className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Rewrite</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-emerald-200 font-mono bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/30 leading-relaxed">
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
      <div className="border-t border-slate-800/80 pt-6">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-indigo-400" />
          Test & Rewrite Any Custom Bullet Point
        </h4>
        <p className="text-xs text-slate-400 mb-3">
          Paste any sentence from your resume to generate an instant quantifiable rewrite.
        </p>

        <form onSubmit={handleCustomOptimize} className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={customBullet}
              onChange={(e) => setCustomBullet(e.target.value)}
              placeholder="e.g., Managed databases and wrote backend code for the application..."
              rows={2}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-mono"
            />
          </div>

          <div className="flex items-center justify-between">
            {error ? (
              <span className="text-xs text-rose-400">{error}</span>
            ) : (
              <span className="text-[11px] text-slate-500">Powered by Gemini Executive Rewriter</span>
            )}

            <button
              type="submit"
              disabled={isOptimizing || !customBullet.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
            >
              {isOptimizing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Rewriting...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Rewrite with Action Verb & Metrics
                </>
              )}
            </button>
          </div>
        </form>

        {customResult && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Rewritten Output:
              </span>
              <button
                onClick={() => handleCopy(customResult.optimized, 'custom')}
                className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {copiedIdx === 'custom' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs font-mono text-emerald-200 leading-relaxed">
              "{customResult.optimized}"
            </p>
            {customResult.critique && (
              <p className="text-[11px] text-slate-400 mt-1">
                <span className="font-semibold text-slate-300">Analysis: </span>
                {customResult.critique}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
