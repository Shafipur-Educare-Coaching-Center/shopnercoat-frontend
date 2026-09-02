'use client';

import React from 'react';
import { Paperclip, Edit3, Trash2, CheckCircle2, FileEdit, Archive, ExternalLink, Megaphone } from 'lucide-react';
import { Announcement } from '@/types/announcement.types';

interface AnnouncementTableProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
  onStatusChange: (announcement: Announcement, newStatus: Announcement['status']) => void;
}

export function AnnouncementTable({
  announcements,
  onEdit,
  onDelete,
  onStatusChange,
}: AnnouncementTableProps) {
  if (announcements.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center select-none">
        <div className="size-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-3">
          <Megaphone className="size-8" />
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
    <div className="w-full overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          
          {/* Table Header */}
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 px-4">Title &amp; Notice Preview</th>
              <th scope="col" className="py-3.5 px-4 text-center">Status</th>
              <th scope="col" className="py-3.5 px-4">Published Date</th>
              <th scope="col" className="py-3.5 px-4">Expiration Date</th>
              <th scope="col" className="py-3.5 px-4">Attachment</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {announcements.map((item) => {
              const pubDate = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft';
              const expDate = item.expiresAt ? new Date(item.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Title & Preview */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-bold text-slate-900 leading-snug line-clamp-1">{item.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.content}</p>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
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
                  </td>

                  {/* Published Date */}
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {pubDate}
                  </td>

                  {/* Expiration Date */}
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {expDate}
                  </td>

                  {/* Attachment */}
                  <td className="py-3.5 px-4">
                    {item.attachmentUrl ? (
                      <a
                        href={item.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-bold transition-colors"
                      >
                        <Paperclip className="size-3" />
                        <span>View</span>
                        <ExternalLink className="size-2.5 opacity-60" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">None</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <select
                        value={item.status}
                        onChange={(e) => onStatusChange(item, e.target.value as Announcement['status'])}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>

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
