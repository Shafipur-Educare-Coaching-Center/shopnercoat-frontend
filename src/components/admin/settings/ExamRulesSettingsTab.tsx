'use client';

import React from 'react';
import { BookOpen, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { ExamRuleSettings } from '@/types/settings.types';

interface ExamRulesSettingsTabProps {
  examRules: ExamRuleSettings;
  onChange: (field: keyof ExamRuleSettings, value: number | boolean | string) => void;
}

export function ExamRulesSettingsTab({ examRules, onChange }: ExamRulesSettingsTabProps) {
  return (
    <div className="space-y-6 select-none animate-in fade-in-0 duration-200">
      
      {/* 1. Evaluation & Negative Marking Standards */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="size-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Award className="size-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-slate-900">
              Grading &amp; Negative Marking Parameters
            </h3>
            <p className="text-[11px] text-slate-500">
              Applied automatically during single mark entry, bulk spreadsheet tabulation, and exam creation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Default Negative Marking */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Default Negative Mark Penalty per Wrong Answer *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min={0}
                max={2}
                value={examRules.defaultNegativeMark}
                onChange={(e) => onChange('defaultNegativeMark', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-rose-600 font-bold">
                marks / wrong
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Standard medical entrance formula: 1 wrong answer = -0.25 mark deduction.
            </p>
          </div>

          {/* Pass Percentage */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Default Pass Threshold Percentage *
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                value={examRules.defaultPassPercentage}
                onChange={(e) => onChange('defaultPassPercentage', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-teal-600 font-bold">
                % marks
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Minimum percentage required to achieve PASSED status (e.g. 40%).
            </p>
          </div>

        </div>
      </div>

      {/* 2. Automated 4-Level Dense Tiebreaker Rule Matrix */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-slate-900">
              National Merit List &amp; Dense Tiebreaker Algorithm
            </h3>
            <p className="text-[11px] text-slate-500">
              Server-enforced logic executing during <code>POST /results/admin/exam/:id/publish</code>.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Level 1 Priority</p>
              <p className="font-heading font-black text-indigo-900">Net Obtained Marks (DESC)</p>
            </div>

            <ArrowRight className="size-4 text-slate-400" />

            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Level 2 Priority</p>
              <p className="font-heading font-black text-teal-700">Correct Answers (DESC)</p>
            </div>

            <ArrowRight className="size-4 text-slate-400" />

            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Level 3 Priority</p>
              <p className="font-heading font-black text-amber-700">Wrong Answers (ASC)</p>
            </div>

            <ArrowRight className="size-4 text-slate-400" />

            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Level 4 Priority</p>
              <p className="font-heading font-black text-slate-700">Total Attempted (DESC)</p>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Candidates tied on all four levels share the same dense rank position, with subsequent positions assigned without skipping integers (1, 2, 2, 3).
          </p>
        </div>
      </div>

      {/* 3. Candidate Roll & Security Standards */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <p className="font-bold text-xs text-slate-900">7-Digit Cryptographic Roll Number</p>
            <p className="text-[11px] text-slate-500">
              Assigned automatically on student profile completion; immutable across all model tests.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-indigo-700 shadow-2xs">
          7-Digits Enforced
        </span>
      </div>

    </div>
  );
}
