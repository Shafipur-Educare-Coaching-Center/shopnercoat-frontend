'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AuditLogItem, AuditLogCategory, AuditLogStatus } from '@/types/admin-overview.types';

interface RecentAuditLogsTableProps {
  logs: AuditLogItem[];
}

export function RecentAuditLogsTable({ logs }: RecentAuditLogsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filter logs based on search, category and status
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || log.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'ALL' || log.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [logs, searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status: AuditLogStatus) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
            <CheckCircle2 className="size-3 text-emerald-600" />
            <span>Success</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
            <AlertTriangle className="size-3 text-amber-600" />
            <span>Warning</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-semibold">
            <Clock className="size-3 text-sky-600" />
            <span>In Progress</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold">
            <XCircle className="size-3 text-rose-600" />
            <span>Failed</span>
          </span>
        );
    }
  };

  const getCategoryBadge = (category: AuditLogCategory) => {
    switch (category) {
      case 'RESULT_PUBLISH':
        return <Badge variant="calmAmber">Result Publish</Badge>;
      case 'ADMIT_CARD':
        return <Badge variant="calmTeal">Admit Card</Badge>;
      case 'EXAM_LIFECYCLE':
        return <Badge variant="calmIndigo">Exam Lifecycle</Badge>;
      case 'STUDENT_SECURITY':
        return <Badge variant="destructive">Security Hold</Badge>;
      case 'AUTH_LOGIN':
        return <Badge variant="secondary">Authentication</Badge>;
      default:
        return <Badge variant="outline">System</Badge>;
    }
  };

  // Format time deterministically
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Recent';
      return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white/95 border border-white/90 shadow-[0_8px_24px_rgba(20,40,90,0.06)] p-5 sm:p-6 backdrop-blur-xl select-none">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700">
              <ShieldAlert className="size-4" />
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              Recent System Audit Logs
            </h3>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Real-time audit trail of administrative exam publications, batch admit cards, and security events.
          </p>
        </div>

        {/* Filters & Search Input */}
        <div className="w-full lg:w-auto flex items-center flex-wrap gap-2.5">
          
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search action, actor, entity..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 transition-all cursor-pointer">
              <Filter className="size-3 text-slate-500" />
              <span>
                {selectedCategory === 'ALL'
                  ? 'All Categories'
                  : selectedCategory.replace('_', ' ')}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1 rounded-xl">
              <DropdownMenuItem onClick={() => setSelectedCategory('ALL')}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory('RESULT_PUBLISH')}>
                Result Publish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory('ADMIT_CARD')}>
                Admit Cards
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory('EXAM_LIFECYCLE')}>
                Exam Lifecycle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory('STUDENT_SECURITY')}>
                Student Security
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory('AUTH_LOGIN')}>
                Auth & Login
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 transition-all cursor-pointer">
              <span>Status: {selectedStatus}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 p-1 rounded-xl">
              <DropdownMenuItem onClick={() => setSelectedStatus('ALL')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus('SUCCESS')}>
                Success
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus('WARNING')}>
                Warning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus('IN_PROGRESS')}>
                In Progress
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 bg-white/40">
        <table className="w-full text-left text-xs text-slate-700 border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Event & Category</th>
              <th className="py-3 px-4">Admin Actor</th>
              <th className="py-3 px-4">Target Entity</th>
              <th className="py-3 px-4">IP & Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/60 transition-colors group cursor-default"
                >
                  {/* Action & Category */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-900">
                        {log.action}
                      </span>
                      <div>{getCategoryBadge(log.category)}</div>
                    </div>
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">
                        {log.actorName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {log.actorRole}
                      </span>
                    </div>
                  </td>

                  {/* Target Entity */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-slate-800 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/60 text-[11px] font-medium">
                      {log.targetEntity}
                    </span>
                  </td>

                  {/* IP & Location */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col text-[11px]">
                      <span className="font-mono text-slate-700">{log.ipAddress}</span>
                      <span className="text-slate-400">{log.location}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(log.status)}
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-4 text-right font-medium text-slate-500 whitespace-nowrap">
                    {formatTime(log.timestamp)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                  <FileCheck className="size-8 mx-auto text-slate-300 mb-2" />
                  No audit log events match your search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{paginatedLogs.length}</strong> of{' '}
          <strong className="text-slate-800">{filteredLogs.length}</strong> total events
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="size-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>

          <span className="text-xs font-semibold text-slate-700 px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="size-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
