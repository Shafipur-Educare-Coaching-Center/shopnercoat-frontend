'use client';

import React, { useState, useTransition } from 'react';
import { X, Loader2, Megaphone, Save, Paperclip, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Announcement, AnnouncementFormData } from '@/types/announcement.types';
import { createAnnouncementAction } from '@/features/admin/announcements/actions/createAnnouncementAction';
import { updateAnnouncementAction } from '@/features/admin/announcements/actions/updateAnnouncementAction';

interface AnnouncementFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  announcement?: Announcement | null;
  onSuccess?: (saved: Announcement) => void;
}

export function AnnouncementFormDialog({
  isOpen,
  onClose,
  announcement,
  onSuccess,
}: AnnouncementFormDialogProps) {
  const [isPending, startTransition] = useTransition();

  const isEdit = Boolean(announcement);

  const [title, setTitle] = useState<string>(() => announcement?.title || '');
  const [content, setContent] = useState<string>(() => announcement?.content || '');
  const [status, setStatus] = useState<Announcement['status']>(() => announcement?.status || 'PUBLISHED');
  const [publishedAt, setPublishedAt] = useState<string>(() => {
    if (announcement?.publishedAt) return announcement.publishedAt.slice(0, 16);
    return new Date().toISOString().slice(0, 16);
  });
  const [expiresAt, setExpiresAt] = useState<string>(() => {
    if (announcement?.expiresAt) return announcement.expiresAt.slice(0, 16);
    return '';
  });
  const [attachmentUrl, setAttachmentUrl] = useState<string>(() => announcement?.attachmentUrl || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Required Fields', { description: 'Please enter both announcement title and notice content.' });
      return;
    }

    const payload: AnnouncementFormData = {
      title: title.trim(),
      content: content.trim(),
      status,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      attachmentUrl: attachmentUrl.trim() || null,
    };

    startTransition(async () => {
      if (isEdit && announcement?.id) {
        const res = await updateAnnouncementAction(announcement.id, payload);
        if (res.success && res.announcement) {
          toast.success('Announcement Updated', { description: res.message });
          onSuccess?.(res.announcement);
          onClose();
        } else {
          toast.error('Update Failed', { description: res.error });
        }
      } else {
        const res = await createAnnouncementAction(payload);
        if (res.success && res.announcement) {
          toast.success('Announcement Created', { description: res.message });
          onSuccess?.(res.announcement);
          onClose();
        } else {
          toast.error('Creation Failed', { description: res.error });
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 flex flex-col gap-4 select-none">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
            <Megaphone className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              {isEdit ? 'Edit Announcement Notice' : 'Post Official Announcement'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Noticeboard updates are published immediately to candidates.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs pt-2">
          
          {/* Title */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Headline Title *
            </label>
            <input
              type="text"
              placeholder="e.g. HSC Model Test 2026 Seat Plan & Venue Released"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Notice Content Body */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Notice Content &amp; Instructions *
            </label>
            <textarea
              rows={4}
              placeholder="Provide detailed instructions, timing, reporting guidelines, or examination notices..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              required
            />
          </div>

          {/* Status & Attachment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Notice Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Announcement['status'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="PUBLISHED">PUBLISHED (Live Notice)</option>
                <option value="DRAFT">DRAFT (Review Only)</option>
                <option value="ARCHIVED">ARCHIVED (Archived)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <Paperclip className="size-3 text-slate-400" />
                <span>Attachment URL</span>
              </label>
              <input
                type="url"
                placeholder="https://res.cloudinary.com/..."
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Dates: Published At & Expires At */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <Calendar className="size-3 text-slate-400" />
                <span>Publish Date &amp; Time</span>
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <Calendar className="size-3 text-slate-400" />
                <span>Expiration Date (Optional)</span>
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-6 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-white" />
                  <span>Saving Notice...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5 text-white" />
                  <span>{isEdit ? 'Update Notice' : 'Publish Notice'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
