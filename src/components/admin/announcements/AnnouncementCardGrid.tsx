'use client';

import React from 'react';
import { Calendar, Paperclip, Edit3, Trash2, CheckCircle2, FileEdit, Archive, ExternalLink } from 'lucide-react';
import { Announcement } from '@/types/announcement.types';

interface AnnouncementCardGridProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
  onStatusChange: (announcement: Announcement, newStatus: Announcement['status']) => void;
}

export function AnnouncementCardGrid({
  announcements,
  onEdit,
  onDelete,
  onStatusChange,
}: AnnouncementCardGridProps) {
  if (announcements.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center select-none">
        <div className="size-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-3">
          <Calendar className="size-8" />
        </div>
        <h3 className="font-heading font-black text-base text-slate-800">
          No Announcements Found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Click <strong>&quot;Post New Announcement&quot;</strong> above to create official candidate updates and notices.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none">
      {announcements.map((item) => {
        const pubDate = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft';
        const expDate = item.expiresAt ? new Date(item.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

        return (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
          >
            {/* Top Row: Status Badge & Actions */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                
                {/* Status Badge */}
                {item.status === 'PUBLISHED' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold">
                    <CheckCircle2 className="size-3 text-teal-600" />
                    <span>PUBLISHED</span>
                  </span>
                ) : item.status === 'DRAFT' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                    <FileEdit className="size-3 text-amber-600" />
                    <span>DRAFT</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">
                    <Archive className="size-3 text-slate-500" />
                    <span>ARCHIVED</span>
                  </span>
                )}

                {/* Date Header */}
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  <Calendar className="size-3" />
                  <span>{pubDate}</span>
                </div>
              </div>

              {/* Title & Content */}
              <h3 className="font-heading font-black text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </div>

            {/* Bottom Meta & Action Controls */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              
              {/* Attachment or Expiration Chip */}
              <div className="flex items-center justify-between gap-2">
                {item.attachmentUrl ? (
                  <a
                    href={item.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-[10px] font-bold transition-colors"
                  >
                    <Paperclip className="size-3" />
                    <span>View Attachment</span>
                    <ExternalLink className="size-2.5 opacity-60" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">No attachments</span>
                )}

                {expDate && (
                  <span className="text-[10px] text-amber-600 font-mono">
                    Expires: {expDate}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                
                {/* Status Quick Switch */}
                <select
                  value={item.status}
                  onChange={(e) => onStatusChange(item, e.target.value as Announcement['status'])}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="PUBLISHED">Set Published</option>
                  <option value="DRAFT">Set Draft</option>
                  <option value="ARCHIVED">Set Archived</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Edit Notice"
                  >
                    <Edit3 className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Notice"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}
