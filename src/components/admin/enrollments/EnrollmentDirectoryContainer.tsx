'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Exam, ExamEnrollmentAdmin, EnrollmentStatus } from '@/types/exam.types';
import { EnrollmentDirectoryHeader } from './EnrollmentDirectoryHeader';
import { EnrollmentStatsBanner } from './EnrollmentStatsBanner';
import { EnrollmentCardGrid } from './EnrollmentCardGrid';
import { EnrollmentTable } from './EnrollmentTable';
import { EnrollmentFormDialog } from './EnrollmentFormDialog';
import { EnrollmentDetailDrawer } from './EnrollmentDetailDrawer';
import { EnrollmentDeleteDialog } from './EnrollmentDeleteDialog';
import { updateEnrollmentAction } from '@/features/admin/enrollments/actions/updateEnrollmentAction';
import { triggerAdmitCardsAction } from '@/features/admin/enrollments/actions/triggerAdmitCardsAction';

interface EnrollmentDirectoryContainerProps {
  initialEnrollments: ExamEnrollmentAdmin[];
  exams: Exam[];
}

export function EnrollmentDirectoryContainer({
  initialEnrollments,
  exams,
}: EnrollmentDirectoryContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local state for instant optimistic UI updates
  const [enrollments, setEnrollments] = useState<ExamEnrollmentAdmin[]>(initialEnrollments);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [examFilter, setExamFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('TABLE');

  // Modals & Drawer states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewEnrollment, setViewEnrollment] = useState<ExamEnrollmentAdmin | null>(null);
  const [deleteEnrollment, setDeleteEnrollment] = useState<ExamEnrollmentAdmin | null>(null);

  // Client-side instant filtering
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const student = item.student;
      const exam = item.exam;

      const matchesSearch =
        q === '' ||
        student?.fullName.toLowerCase().includes(q) ||
        String(student?.rollNumber).includes(q) ||
        String(student?.registrationNumber).includes(q) ||
        student?.collegeName.toLowerCase().includes(q) ||
        exam?.code.toLowerCase().includes(q) ||
        exam?.title.toLowerCase().includes(q);

      const matchesExam = examFilter === 'ALL' || item.examId === examFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesExam && matchesStatus;
    });
  }, [enrollments, searchQuery, examFilter, statusFilter]);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
      toast.success('Enrollments Refreshed', {
        description: 'Synchronized with latest registration records.',
      });
    });
  };

  const handleEnrollmentCreated = (newEnrollment?: ExamEnrollmentAdmin) => {
    if (newEnrollment) {
      setEnrollments((prev) => [newEnrollment, ...prev]);
    }
    startTransition(() => {
      router.refresh();
    });
  };

  const handleStatusChange = (enrollment: ExamEnrollmentAdmin) => {
    const nextStatus: EnrollmentStatus =
      enrollment.status === 'ENROLLED' ? 'CANCELLED' : 'ENROLLED';

    startTransition(async () => {
      const res = await updateEnrollmentAction(enrollment.id, nextStatus);
      if (res.success && res.enrollment) {
        toast.success('Status Updated', { description: res.message });
        setEnrollments((prev) =>
          prev.map((e) => (e.id === enrollment.id ? { ...e, status: nextStatus } : e))
        );
        router.refresh();
      } else {
        toast.error('Status Update Failed', { description: res.error });
      }
    });
  };

  const handleEnrollmentDeleted = (deletedId: string) => {
    setEnrollments((prev) => prev.filter((e) => e.id !== deletedId));
    startTransition(() => {
      router.refresh();
    });
  };

  const handleTriggerAdmitCards = () => {
    const targetExamId = examFilter !== 'ALL' ? examFilter : exams[0]?.id;
    if (!targetExamId) return;

    startTransition(async () => {
      const res = await triggerAdmitCardsAction(targetExamId);
      if (res.success) {
        toast.success('Admit Card Dispatch Triggered', {
          description: res.message,
        });
      } else {
        toast.error('Dispatch Failed', { description: res.error });
      }
    });
  };

  return (
    <div className="w-full flex flex-col select-none">
      
      {/* 1. Directory Header with Filters & Triggers */}
      <EnrollmentDirectoryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        examFilter={examFilter}
        onExamFilterChange={setExamFilter}
        exams={exams}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={() => setIsCreateOpen(true)}
        onRefresh={handleRefresh}
        onTriggerAdmitCards={handleTriggerAdmitCards}
        isRefreshing={isPending}
      />

      {/* 2. Top Summary KPI Metrics Banner */}
      <EnrollmentStatsBanner enrollments={enrollments} />

      {/* 3. Main Data View (Grid or Table) */}
      {viewMode === 'GRID' ? (
        <EnrollmentCardGrid
          enrollments={filteredEnrollments}
          onView={setViewEnrollment}
          onChangeStatus={handleStatusChange}
          onDelete={setDeleteEnrollment}
        />
      ) : (
        <EnrollmentTable
          enrollments={filteredEnrollments}
          onView={setViewEnrollment}
          onChangeStatus={handleStatusChange}
          onDelete={setDeleteEnrollment}
        />
      )}

      {/* 4. Candidate Dossier Drawer */}
      <EnrollmentDetailDrawer
        enrollment={viewEnrollment}
        isOpen={Boolean(viewEnrollment)}
        onClose={() => setViewEnrollment(null)}
        onChangeStatus={handleStatusChange}
        onDelete={(e) => {
          setViewEnrollment(null);
          setDeleteEnrollment(e);
        }}
      />

      {/* 5. Manual Enrollment Dialog */}
      <EnrollmentFormDialog
        isOpen={isCreateOpen}
        exams={exams}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleEnrollmentCreated}
      />

      {/* 6. Revoke Registration Safety Dialog */}
      <EnrollmentDeleteDialog
        isOpen={Boolean(deleteEnrollment)}
        enrollment={deleteEnrollment}
        onClose={() => setDeleteEnrollment(null)}
        onSuccess={handleEnrollmentDeleted}
      />

    </div>
  );
}
