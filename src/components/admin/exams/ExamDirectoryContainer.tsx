'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Exam } from '@/types/exam.types';
import { getExamCentresAction } from '@/features/admin/exams/actions/examCentreActions';
import { getExamEnrollmentsCountAction } from '@/features/admin/enrollments/actions/getExamEnrollmentsCountAction';
import { ExamDirectoryHeader } from './ExamDirectoryHeader';
import { ExamStatsBanner } from './ExamStatsBanner';
import { ExamCardGrid } from './ExamCardGrid';
import { ExamTable } from './ExamTable';
import { ExamDetailDrawer } from './ExamDetailDrawer';
import { ExamFormDialog } from './ExamFormDialog';
import { ExamStatusTransitionDialog } from './ExamStatusTransitionDialog';
import { ExamCentresModal } from './ExamCentresModal';
import { ExamDeleteDialog } from './ExamDeleteDialog';

interface ExamDirectoryContainerProps {
  initialExams: Exam[];
}

export function ExamDirectoryContainer({ initialExams }: ExamDirectoryContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local state for live exams, dynamic centre & enrollment hydration
  const [exams, setExams] = useState<Exam[]>(initialExams);

  // Sync state with initialExams and fetch centres & live enrollment counts
  useEffect(() => {
    let active = true;

    initialExams.forEach((exam) => {
      // 1. Live Centre Hydration
      getExamCentresAction(exam.id).then((res) => {
        if (active && res.success && res.centres && res.centres.length > 0) {
          setExams((prev) =>
            prev.map((e) => (e.id === exam.id ? { ...e, centres: res.centres } : e))
          );
        }
      });

      // 2. Live Enrollment Count Hydration
      getExamEnrollmentsCountAction(exam.id).then((res) => {
        if (active && res.success && res.count !== undefined) {
          setExams((prev) =>
            prev.map((e) =>
              e.id === exam.id
                ? { ...e, _count: { ...e._count, enrollments: res.count } }
                : e
            )
          );
        }
      });
    });

    return () => {
      active = false;
    };
  }, [initialExams]);

  // Search, Filter & View Mode states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Modals & Drawer states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewExam, setViewExam] = useState<Exam | null>(null);
  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [manageCentresExam, setManageCentresExam] = useState<Exam | null>(null);
  const [statusExam, setStatusExam] = useState<Exam | null>(null);
  const [deleteExam, setDeleteExam] = useState<Exam | null>(null);

  // Client-side instant filter over exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        exam.title.toLowerCase().includes(q) ||
        exam.code.toLowerCase().includes(q) ||
        exam.description.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'COMPLETED'
          ? exam.status === 'COMPLETED' || exam.status === 'RESULT_PUBLISHED'
          : exam.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [exams, searchQuery, statusFilter]);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
      toast.success('Directory Refreshed', {
        description: 'Synchronized with latest exam sessions and enrollments.',
      });
    });
  };

  const handleExamDeleted = (deletedExamId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== deletedExamId));
    startTransition(() => {
      router.refresh();
    });
  };

  const handleExamSaved = (savedExam?: Exam, isEdit?: boolean) => {
    if (savedExam) {
      if (isEdit) {
        setExams((prev) => prev.map((e) => (e.id === savedExam.id ? { ...e, ...savedExam } : e)));
      } else {
        setExams((prev) => [savedExam, ...prev]);
      }
    }
    startTransition(() => {
      router.refresh();
    });
  };

  const handleStatusChanged = (updatedExam?: Exam) => {
    if (updatedExam) {
      setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? { ...e, ...updatedExam } : e)));
    }
    startTransition(() => {
      router.refresh();
    });
  };

  const handleCentresUpdated = () => {
    if (manageCentresExam?.id) {
      getExamCentresAction(manageCentresExam.id).then((res) => {
        if (res.success && res.centres) {
          setExams((prev) =>
            prev.map((e) => (e.id === manageCentresExam.id ? { ...e, centres: res.centres } : e))
          );
        }
      });
    }
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="w-full flex flex-col select-none">
      
      {/* 1. Header with Search, Status Tabs, View Switcher & Create Trigger */}
      <ExamDirectoryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={() => setIsCreateOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isPending}
      />

      {/* 2. Top Summary Metrics Banner */}
      <ExamStatsBanner exams={exams} />

      {/* 3. Main Content: Grid View or Table View */}
      {viewMode === 'GRID' ? (
        <ExamCardGrid
          exams={filteredExams}
          onViewExam={setViewExam}
          onEditExam={setEditExam}
          onManageCentres={setManageCentresExam}
          onChangeStatus={setStatusExam}
          onDeleteExam={setDeleteExam}
        />
      ) : (
        <ExamTable
          exams={filteredExams}
          onViewExam={setViewExam}
          onEditExam={setEditExam}
          onManageCentres={setManageCentresExam}
          onChangeStatus={setStatusExam}
          onDeleteExam={setDeleteExam}
        />
      )}

      {/* 4. Inspection Drawer */}
      <ExamDetailDrawer
        exam={viewExam}
        isOpen={Boolean(viewExam)}
        onClose={() => setViewExam(null)}
        onEdit={(e) => {
          setViewExam(null);
          setEditExam(e);
        }}
        onManageCentres={(e) => {
          setViewExam(null);
          setManageCentresExam(e);
        }}
        onChangeStatus={(e) => {
          setViewExam(null);
          setStatusExam(e);
        }}
      />

      {/* 5. Create / Edit Exam Form Dialog */}
      <ExamFormDialog
        isOpen={isCreateOpen || Boolean(editExam)}
        exam={editExam}
        onClose={() => {
          setIsCreateOpen(false);
          setEditExam(null);
        }}
        onSuccess={handleExamSaved}
      />

      {/* 6. Lifecycle Status Transition Modal */}
      <ExamStatusTransitionDialog
        isOpen={Boolean(statusExam)}
        exam={statusExam}
        onClose={() => setStatusExam(null)}
        onSuccess={handleStatusChanged}
      />

      {/* 7. Centres & Seat Plan Modal */}
      <ExamCentresModal
        isOpen={Boolean(manageCentresExam)}
        exam={manageCentresExam}
        onClose={() => setManageCentresExam(null)}
        onSuccess={handleCentresUpdated}
      />

      {/* 8. Delete / Cancel Dialog */}
      <ExamDeleteDialog
        isOpen={Boolean(deleteExam)}
        exam={deleteExam}
        onClose={() => setDeleteExam(null)}
        onSuccess={handleExamDeleted}
      />

    </div>
  );
}
