'use client';

import React, { useState, useTransition, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Announcement } from '@/types/announcement.types';
import { getAdminAnnouncementsAction } from '@/features/admin/announcements/actions/getAdminAnnouncementsAction';
import { updateAnnouncementAction } from '@/features/admin/announcements/actions/updateAnnouncementAction';
import { AnnouncementHeader } from './AnnouncementHeader';
import { AnnouncementStatsBanner } from './AnnouncementStatsBanner';
import { AnnouncementCardGrid } from './AnnouncementCardGrid';
import { AnnouncementTable } from './AnnouncementTable';
import { AnnouncementFormDialog } from './AnnouncementFormDialog';
import { AnnouncementDeleteDialog } from './AnnouncementDeleteDialog';

interface AnnouncementDirectoryContainerProps {
  initialAnnouncements: Announcement[];
}

export function AnnouncementDirectoryContainer({
  initialAnnouncements,
}: AnnouncementDirectoryContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null);
  const [deleteAnnouncement, setDeleteAnnouncement] = useState<Announcement | null>(null);

  const fetchFreshAnnouncements = useCallback(() => {
    startTransition(async () => {
      const res = await getAdminAnnouncementsAction();
      if (res.success && res.announcements) {
        setAnnouncements(res.announcements);
      }
    });
  }, []);

  const handleRefresh = () => {
    fetchFreshAnnouncements();
    startTransition(() => {
      router.refresh();
      toast.success('Noticeboard Synchronized');
    });
  };

  const handleStatusChange = (item: Announcement, newStatus: Announcement['status']) => {
    startTransition(async () => {
      const res = await updateAnnouncementAction(item.id, { status: newStatus });
      if (res.success && res.announcement) {
        toast.success(`Notice Marked as ${newStatus}`);
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === item.id ? { ...a, status: newStatus } : a))
        );
      } else {
        toast.error('Status Update Failed', { description: res.error });
      }
    });
  };

  const handleSaved = (saved: Announcement) => {
    setAnnouncements((prev) => {
      const existing = prev.findIndex((a) => a.id === saved.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = saved;
        return updated;
      }
      return [saved, ...prev];
    });
    handleRefresh();
  };

  const handleDeleted = (deletedId: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== deletedId));
    handleRefresh();
  };

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [announcements, searchQuery, statusFilter]);

  return (
    <div className="w-full flex flex-col select-none">
      
      {/* 1. Header with Controls & Create Action */}
      <AnnouncementHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={() => {
          setEditAnnouncement(null);
          setIsFormOpen(true);
        }}
        onRefresh={handleRefresh}
        isRefreshing={isPending}
      />

      {/* 2. Top Summary KPI Metrics Banner */}
      <AnnouncementStatsBanner announcements={announcements} />

      {/* 3. Main Content: Grid View or Table View */}
      {viewMode === 'GRID' ? (
        <AnnouncementCardGrid
          announcements={filteredAnnouncements}
          onEdit={(a) => {
            setEditAnnouncement(a);
            setIsFormOpen(true);
          }}
          onDelete={setDeleteAnnouncement}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <AnnouncementTable
          announcements={filteredAnnouncements}
          onEdit={(a) => {
            setEditAnnouncement(a);
            setIsFormOpen(true);
          }}
          onDelete={setDeleteAnnouncement}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* 4. Create / Edit Form Dialog */}
      <AnnouncementFormDialog
        isOpen={isFormOpen}
        announcement={editAnnouncement}
        onClose={() => {
          setIsFormOpen(false);
          setEditAnnouncement(null);
        }}
        onSuccess={handleSaved}
      />

      {/* 5. Delete Safety Dialog */}
      <AnnouncementDeleteDialog
        isOpen={Boolean(deleteAnnouncement)}
        announcement={deleteAnnouncement}
        onClose={() => setDeleteAnnouncement(null)}
        onSuccess={handleDeleted}
      />

    </div>
  );
}
