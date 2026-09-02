'use client';

import React from 'react';
import { Trophy, CheckCircle2, User, Sparkles } from 'lucide-react';
import { Result } from '@/types/result.types';

interface RankingTop10PreviewProps {
  results: Result[];
}

export function RankingTop10Preview({ results }: RankingTop10PreviewProps) {
  // Sort results by position ASC or obtainedMarks DESC
  const sorted = [...results].sort((a, b) => {
    if (a.position && b.position) return a.position - b.position;
    if (a.position) return -1;
    if (b.position) return 1;
    return (b.obtainedMarks || 0) - (a.obtainedMarks || 0);
  });

  const top10 = sorted.slice(0, 10);
  const rank1 = top10[0];
  const rank2 = top10[1];
  const rank3 = top10[2];
  const restRankers = top10.slice(3);

  if (results.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center select-none">
        <div className="size-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-3">
          <Trophy className="size-8" />
        </div>
        <h3 className="font-heading font-black text-base text-slate-800">
          No Results Recorded For This Exam
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Record student marks in <strong>Result Management</strong> first to generate the Top-10 ranking snapshot.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      
      {/* 1. Top-3 Visual Podium Preview */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-900/60 relative overflow-hidden flex flex-col items-center">
        
        <div className="flex items-center gap-2 mb-8 z-10">
          <Sparkles className="size-4 text-amber-400" />
          <h2 className="font-heading font-black text-lg tracking-tight text-white uppercase">
            Top 3 Merit Podium Preview
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
            Public Snapshot
          </span>
        </div>

        {/* 3-Column Podium Grid */}
        <div className="w-full max-w-2xl grid grid-cols-3 gap-3 items-end z-10">
          
          {/* 🥈 2nd Place (Left) */}
          <div className="flex flex-col items-center">
            {rank2 ? (
              <div className="flex flex-col items-center mb-3 text-center">
                <div className="relative mb-2">
                  {rank2.student?.photoUrl ? (
                    <img
                      src={rank2.student.photoUrl}
                      alt={rank2.student.fullName}
                      className="size-16 rounded-2xl object-cover border-2 border-slate-300 shadow-md"
                    />
                  ) : (
                    <div className="size-16 rounded-2xl bg-slate-800 border-2 border-slate-400 text-slate-200 font-black text-sm flex items-center justify-center shadow-md">
                      {rank2.student?.fullName?.slice(0, 2).toUpperCase() || <User className="size-6" />}
                    </div>
                  )}
                  <span className="absolute -bottom-2 -right-1 size-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center shadow-sm">
                    2
                  </span>
                </div>
                <p className="font-heading font-black text-xs text-white truncate max-w-[110px]">
                  {rank2.student?.fullName || 'Candidate'}
                </p>
                <p className="text-[10px] text-slate-300 font-mono">
                  Roll #{rank2.student?.rollNumber || 'N/A'}
                </p>
                <p className="text-xs font-mono font-black text-slate-200 mt-1">
                  {rank2.obtainedMarks} pts
                </p>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic mb-4">Awaiting 2nd</div>
            )}

            {/* Pedestal 2 */}
            <div className="w-full h-24 rounded-t-2xl bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800 flex items-center justify-center text-white font-heading font-black text-3xl shadow-lg border-t-2 border-slate-200">
              2
            </div>
          </div>

          {/* 🥇 1st Place (Center - Tallest) */}
          <div className="flex flex-col items-center">
            {rank1 ? (
              <div className="flex flex-col items-center mb-3 text-center">
                <div className="relative mb-2">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-300 animate-bounce">
                    👑
                  </div>
                  {rank1.student?.photoUrl ? (
                    <img
                      src={rank1.student.photoUrl}
                      alt={rank1.student.fullName}
                      className="size-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
                    />
                  ) : (
                    <div className="size-20 rounded-2xl bg-amber-950 border-2 border-amber-400 text-amber-300 font-black text-base flex items-center justify-center shadow-xl">
                      {rank1.student?.fullName?.slice(0, 2).toUpperCase() || <User className="size-7" />}
                    </div>
                  )}
                  <span className="absolute -bottom-2 -right-1 size-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                    1
                  </span>
                </div>
                <p className="font-heading font-black text-sm text-amber-300 truncate max-w-[130px]">
                  {rank1.student?.fullName || 'Candidate'}
                </p>
                <p className="text-[10px] text-slate-300 font-mono">
                  Roll #{rank1.student?.rollNumber || 'N/A'}
                </p>
                <p className="text-sm font-mono font-black text-amber-400 mt-1">
                  {rank1.obtainedMarks} pts ({rank1.percentage}%)
                </p>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic mb-4">Awaiting 1st</div>
            )}

            {/* Pedestal 1 */}
            <div className="w-full h-36 rounded-t-2xl bg-gradient-to-b from-amber-400 via-yellow-600 to-amber-900 flex items-center justify-center text-slate-950 font-heading font-black text-4xl shadow-xl border-t-2 border-yellow-200">
              1
            </div>
          </div>

          {/* 🥉 3rd Place (Right) */}
          <div className="flex flex-col items-center">
            {rank3 ? (
              <div className="flex flex-col items-center mb-3 text-center">
                <div className="relative mb-2">
                  {rank3.student?.photoUrl ? (
                    <img
                      src={rank3.student.photoUrl}
                      alt={rank3.student.fullName}
                      className="size-16 rounded-2xl object-cover border-2 border-amber-600 shadow-md"
                    />
                  ) : (
                    <div className="size-16 rounded-2xl bg-slate-800 border-2 border-amber-600 text-amber-300 font-black text-sm flex items-center justify-center shadow-md">
                      {rank3.student?.fullName?.slice(0, 2).toUpperCase() || <User className="size-6" />}
                    </div>
                  )}
                  <span className="absolute -bottom-2 -right-1 size-6 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                    3
                  </span>
                </div>
                <p className="font-heading font-black text-xs text-white truncate max-w-[110px]">
                  {rank3.student?.fullName || 'Candidate'}
                </p>
                <p className="text-[10px] text-slate-300 font-mono">
                  Roll #{rank3.student?.rollNumber || 'N/A'}
                </p>
                <p className="text-xs font-mono font-black text-slate-200 mt-1">
                  {rank3.obtainedMarks} pts
                </p>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic mb-4">Awaiting 3rd</div>
            )}

            {/* Pedestal 3 */}
            <div className="w-full h-20 rounded-t-2xl bg-gradient-to-b from-amber-600 via-orange-800 to-slate-900 flex items-center justify-center text-white font-heading font-black text-3xl shadow-lg border-t-2 border-amber-400">
              3
            </div>
          </div>

        </div>

      </div>

      {/* 2. Top 4 to 10 Merit List Table */}
      {restRankers.length > 0 && (
        <div className="overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wide">
              Top 4 – 10 National Merit List
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Positions 4 to {Math.min(10, top10.length)}
            </span>
          </div>

          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="py-3 px-4 text-center">Position</th>
                <th scope="col" className="py-3 px-4">Candidate Student</th>
                <th scope="col" className="py-3 px-4 text-center">Correct / Wrong</th>
                <th scope="col" className="py-3 px-4 text-center">Net Score</th>
                <th scope="col" className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {restRankers.map((item, idx) => {
                const pos = item.position || idx + 4;
                const studentName = item.student?.fullName || 'Candidate';
                const rollNumber = item.student?.rollNumber || 'N/A';
                const college = item.student?.collegeName || 'Shafipur Educare';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center size-6 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-xs border border-indigo-100">
                        #{pos}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{studentName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Roll #{rollNumber} • {college}</p>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="text-teal-600 font-bold">+{item.correctAnswered}</span> / <span className="text-rose-600 font-semibold">-{item.wrongAnswered}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-black text-sm text-slate-900">
                      {item.obtainedMarks} ({item.percentage}%)
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold">
                        <CheckCircle2 className="size-3 text-teal-600" />
                        <span>PASSED</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
