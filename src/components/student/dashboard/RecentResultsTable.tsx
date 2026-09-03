'use client';

import React from 'react';
import Link from 'next/link';
import { RecentScorecardItem } from '@/types/student-analytics.types';
import { ROUTES } from '@/constants/routes';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowRight,
  Inbox,
} from 'lucide-react';

interface RecentResultsTableProps {
  recentScorecards: RecentScorecardItem[];
}

export function RecentResultsTable({ recentScorecards }: RecentResultsTableProps) {
  return (
    <div className="w-full rounded-[28px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,118,110,0.04)]">
      
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-teal-50 text-[#00796B] flex items-center justify-center">
            <FileText className="size-4.5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 tracking-tight">
              Recent Model Test Scorecards
            </h3>
            <p className="text-xs text-slate-500">
              Verified OMR evaluations, negative marks log, and national rank standings.
            </p>
          </div>
        </div>

        <Link
          href={ROUTES.STUDENT_RESULTS}
          className="text-xs font-bold text-[#00796B] hover:text-[#00594D] flex items-center gap-1 hover:underline transition-colors shrink-0"
        >
          <span>View All Results</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Table Container */}
      {recentScorecards.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Model Test</th>
                <th className="pb-3 font-semibold text-center">Correct</th>
                <th className="pb-3 font-semibold text-center">Wrong</th>
                <th className="pb-3 font-semibold text-center">Deductions</th>
                <th className="pb-3 font-semibold text-center">Net Score</th>
                <th className="pb-3 font-semibold text-center">National Rank</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentScorecards.map((item, idx) => {
                const formattedDate = item.examDate
                  ? new Date(item.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Session 2026';

                const isPassed = item.resultStatus === 'PASSED';

                return (
                  <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    {/* Exam Title & Code */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.examCode}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {item.examTitle}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {formattedDate}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Correct Answers */}
                    <td className="py-3.5 text-center font-mono font-bold text-emerald-700">
                      +{item.correctAnswered}
                    </td>

                    {/* Wrong Answers */}
                    <td className="py-3.5 text-center font-mono font-bold text-rose-600">
                      {item.wrongAnswered}
                    </td>

                    {/* Deductions */}
                    <td className="py-3.5 text-center font-mono font-bold text-rose-600">
                      -{Number(item.deductMark).toFixed(2)}
                    </td>

                    {/* Net Score */}
                    <td className="py-3.5 text-center">
                      <span className="font-mono font-black text-sm text-[#00796B]">
                        {Number(item.obtainedMarks).toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400"> / {item.totalMarks || 100}</span>
                    </td>

                    {/* National Rank Position */}
                    <td className="py-3.5 text-center">
                      {item.position ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-[#00695C] border border-teal-200/70 font-bold font-mono text-xs">
                          <Trophy className="size-3 text-amber-500" />
                          #{item.position}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs">--</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isPassed
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                            : 'bg-rose-50 text-rose-800 border border-rose-200/70'
                        }`}
                      >
                        {isPassed ? (
                          <>
                            <CheckCircle2 className="size-3 text-emerald-600" />
                            <span>PASSED</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="size-3 text-rose-600" />
                            <span>FAILED</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 p-8 text-center flex flex-col items-center justify-center space-y-2">
          <Inbox className="size-7 text-slate-400" />
          <p className="font-bold text-xs sm:text-sm text-slate-700">No Model Test Results Published Yet</p>
          <p className="text-[11px] text-slate-500 max-w-sm">
            Once your offline OMR answer sheets are scanned and evaluated by the central board, your detailed scorecards, negative marking audit, and merit ranks will appear here.
          </p>
        </div>
      )}

    </div>
  );
}

export default RecentResultsTable;
