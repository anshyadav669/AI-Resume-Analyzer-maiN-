import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start gap-3 backdrop-blur-xl ${
                isSuccess
                  ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100 shadow-emerald-500/10'
                  : isError
                  ? 'bg-rose-950/90 border-rose-500/30 text-rose-100 shadow-rose-500/10'
                  : isWarning
                  ? 'bg-amber-950/90 border-amber-500/30 text-amber-100 shadow-amber-500/10'
                  : 'bg-slate-900/90 border-indigo-500/30 text-slate-100 shadow-indigo-500/10'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <XCircle className="w-5 h-5 text-rose-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-indigo-400" />}
              </div>

              <div className="flex-1 min-w-0">
                {toast.title && <h5 className="text-xs font-bold leading-tight mb-0.5">{toast.title}</h5>}
                <p className="text-xs text-slate-200 leading-relaxed break-words">{toast.message}</p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(toast.id)}
                className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
