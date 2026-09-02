'use client';

import React from 'react';
import { CheckCircle2, XCircle, Edit3, FileText } from 'lucide-react';
import { Result } from '@/types/result.types';

interface ResultTableProps {
  results: Result[];
  onEditResult?: (result: Result) => void;
}

export function ResultTable({ results, onEditResult }: ResultTableProps) {
  if (results.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center select-none">
        <div className="size-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-3">
          <FileText className="size-8" />
        </div>
        <h3 className="font-heading font-black text-base text-slate-800">
          No Results Recorded For This Exam Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Click <strong>&quot;Single Entry&quot;</strong> or <strong>&quot;Bulk Entry&quot;</strong> above to record student exam marks.
        </p>
      </div>
    );
  }

  // Sort by position ASC (or obtainedMarks DESC)
  const sorted = [...results].sort((a, b) => {
    if (a.position && b.position) return a.position - b.position;
    if (a.position) return -1;
    if (b.position) return 1;
    return (b.obtainedMarks || 0) - (a.obtainedMarks || 0);
  });

  return (
    <div className="w-full overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          
          {/* Table Header */}
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 px-4 text-center">Rank</th>
              <th scope="col" className="py-3.5 px-4">Examinee Candidate</th>
              <th scope="col" className="py-3.5 px-4 text-center">Attempted / Skipped</th>
              <th scope="col" className="py-3.5 px-4 text-center">Correct / Wrong</th>
              <th scope="col" className="py-3.5 px-4 text-center">Deductions</th>
              <th scope="col" className="py-3.5 px-4 text-center">Obtained Marks</th>
              <th scope="col" className="py-3.5 px-4 text-center">Status</th>
              <th scope="col" className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {sorted.map((res) => {
              const studentName = res.student?.fullName || 'Examinee Candidate';
              const rollNumber = res.student?.rollNumber || 'N/A';
              const college = res.student?.collegeName || 'Shafipur Educare';
              const photoUrl = res.student?.photoUrl;
              const pos = res.position;

              return (
                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Position / Rank Podium Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {pos === 1 ? (
                      <span className="inline-flex items-center justify-center size-7 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-xs shadow-xs">
                        🥇 1
                      </span>
                    ) : pos === 2 ? (
                      <span className="inline-flex items-center justify-center size-7 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 text-slate-900 font-black text-xs shadow-xs">
                        🥈 2
                      </span>
                    ) : pos === 3 ? (
                      <span className="inline-flex items-center justify-center size-7 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white font-black text-xs shadow-xs">
                        🥉 3
                      </span>
                    ) : pos ? (
                      <span className="inline-flex items-center justify-center size-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs font-mono">
                        #{pos}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">-</span>
                    )}
                  </td>

                  {/* Candidate Profile */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={studentName}
                          className="size-9 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="size-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {studentName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{studentName}</p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Roll #{rollNumber} • {college}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Attempted & Skipped */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="font-bold text-slate-800">{res.totalAnswered}</span>
                    <span className="text-slate-400 text-[11px]"> / {res.skipped} skipped</span>
                  </td>

                  {/* Correct & Wrong */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="font-bold text-teal-600">+{res.correctAnswered}</span>
                    <span className="text-rose-500 text-[11px] font-semibold"> / -{res.wrongAnswered}</span>
                  </td>

                  {/* Deductions */}
                  <td className="py-3.5 px-4 text-center font-mono text-rose-600 font-semibold">
                    -{res.deductMark}
                  </td>

                  {/* Obtained Marks & Percentage */}
                  <td className="py-3.5 px-4 text-center">
                    <p className="font-heading font-black text-sm text-slate-900 leading-tight font-mono">
                      {res.obtainedMarks}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono font-bold">
                      {res.percentage}%
                    </p>
                  </td>

                  {/* Pass / Fail Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {res.resultStatus === 'PASSED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold">
                        <CheckCircle2 className="size-3 text-teal-600" />
                        <span>PASSED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                        <XCircle className="size-3 text-rose-600" />
                        <span>FAILED</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onEditResult?.(res)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="size-3 text-slate-500" />
                      <span>Edit Marks</span>
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}
