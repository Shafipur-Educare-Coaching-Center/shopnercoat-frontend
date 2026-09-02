'use client';

import React from 'react';
import { Settings, Save, CheckCircle2, RotateCcw } from 'lucide-react';

interface SettingsHeaderProps {
  onSaveAll: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

export function SettingsHeader({ onSaveAll, onReset, isSaving }: SettingsHeaderProps) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 select-none">
      
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
            <Settings className="size-5" />
          </div>
          <h1 className="font-heading font-black text-2xl tracking-tight text-slate-900">
            System Settings &amp; Administration
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1 pl-11">
          Configure organization profiles, exam evaluation policies, gateway diagnostics, admin security, and cache controls.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3.5 text-slate-400" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="button"
          onClick={onSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? (
            <>
              <CheckCircle2 className="size-3.5 animate-pulse text-white" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5 text-white" />
              <span>Save System Settings</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
}
