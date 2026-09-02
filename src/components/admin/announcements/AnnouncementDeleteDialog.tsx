'use client';

import React, { useTransition } from 'react';
import { X, Loader2, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Announcement } from '@/types/announcement.types';
import { deleteAnnouncementAction } from '@/features/admin/announcements/actions/deleteAnnouncementAction';

interface AnnouncementDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  announcement?: Announcement | null;
  onSuccess?: (deletedId: string) => void;
}

export function AnnouncementDeleteDialog({
  isOpen,
  onClose,
  announcement,
  onSuccess,
}: AnnouncementDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!isOpen || !announcement) return null;

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteAnnouncementAction(announcement.id);
      if (res.success) {
        toast.success('Announcement Deleted', { description: res.message });
        onSuccess?.(announcement.id);
        onClose();
      } else {
        toast.error('Deletion Failed', { description: res.error });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 flex flex-col gap-4 select-none">
        
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
          <div className="size-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              Delete Announcement
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This action permanently deletes this notice from the database.
            </p>
          </div>
        </div>

        {/* Target Details */}
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs text-slate-700">
          <p className="font-bold text-slate-900 line-clamp-1">{announcement.title}</p>
          <p className="text-slate-500 text-[11px] mt-1 line-clamp-2">{announcement.content}</p>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-white" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5 text-white" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
