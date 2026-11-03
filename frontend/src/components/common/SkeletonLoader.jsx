import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-pulse">
      {/* Top action bar skeleton */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="h-5 w-40 bg-slate-200 rounded-lg" />
        <div className="flex gap-3">
          <div className="h-9 w-28 bg-slate-200 rounded-xl" />
          <div className="h-9 w-36 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Hero Score Gauge Skeleton */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
        <div className="space-y-3 flex-1 w-full">
          <div className="h-6 w-48 bg-slate-200 rounded-full" />
          <div className="h-10 w-3/4 bg-slate-200 rounded-2xl" />
          <div className="h-4 w-1/2 bg-slate-200 rounded-lg" />
          <div className="h-8 w-32 bg-slate-200 rounded-xl mt-4" />
        </div>
        <div className="w-44 h-44 rounded-full bg-slate-100 border-8 border-slate-200 shrink-0" />
      </div>

      {/* 5 Score Breakdown Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-xl bg-slate-200" />
              <div className="w-16 h-3 bg-slate-200 rounded" />
            </div>
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-full bg-slate-200 rounded" />
            <div className="h-2 w-full bg-slate-200 rounded-full mt-4" />
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 h-80 shadow-xs" />
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 h-36 shadow-xs" />
          <div className="bg-white border border-slate-200 rounded-3xl p-6 h-36 shadow-xs" />
        </div>
      </div>
    </div>
  );
};
