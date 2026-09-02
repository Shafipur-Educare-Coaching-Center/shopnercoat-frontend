'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Student } from '@/types/student.types';
import { StudentDirectoryHeader } from './StudentDirectoryHeader';
import { StudentStatsBanner } from './StudentStatsBanner';
import { StudentTable } from './StudentTable';
import { StudentDetailDrawer } from './StudentDetailDrawer';
import { StudentFormDialog } from './StudentFormDialog';
import { StudentDeleteDialog } from './StudentDeleteDialog';

interface StudentDirectoryContainerProps {
  initialStudents: Student[];
  totalCount: number;
  initialPage: number;
  initialLimit: number;
}

export function StudentDirectoryContainer({
  initialStudents,
  totalCount,
  initialPage,
  initialLimit,
}: StudentDirectoryContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Modal / Drawer states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);

  // Client-side instant filter fallback over initial items
  const filteredStudents = useMemo(() => {
    return initialStudents.filter((student) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        student.fullName.toLowerCase().includes(q) ||
        String(student.rollNumber).includes(q) ||
        String(student.registrationNumber).includes(q) ||
        (student.collegeName && student.collegeName.toLowerCase().includes(q)) ||
        (student.user?.mobileNumber && student.user.mobileNumber.includes(q)) ||
        (student.user?.email && student.user.email.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'ALL' || student.registrationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialStudents, searchQuery, statusFilter]);

  const pageSize = initialLimit || 10;
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
      toast.success('Directory Refreshed', {
        description: 'Synchronized with latest applicant records.',
      });
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      
      {/* 1. Header with Live Search, Filter & Add Candidate */}
      <StudentDirectoryHeader
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(st) => {
          setStatusFilter(st);
          setCurrentPage(1);
        }}
        onOpenAdd={() => setIsAddOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isPending}
      />

      {/* 2. Top Summary Metrics Banner */}
      <StudentStatsBanner
        students={initialStudents}
        totalCount={totalCount}
      />

      {/* 3. Candidate Data Table */}
      <StudentTable
        students={paginatedStudents}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={filteredStudents.length}
        onPageChange={(page) => setCurrentPage(page)}
        onViewStudent={(student) => setViewStudent(student)}
        onEditStudent={(student) => setEditStudent(student)}
        onDeleteStudent={(student) => setDeleteStudent(student)}
      />

      {/* 4. Candidate Detail Slide-Over Drawer */}
      <StudentDetailDrawer
        student={viewStudent}
        isOpen={Boolean(viewStudent)}
        onClose={() => setViewStudent(null)}
        onEdit={(student) => {
          setViewStudent(null);
          setEditStudent(student);
        }}
      />

      {/* 5. Add / Edit Candidate Form Dialog */}
      <StudentFormDialog
        isOpen={isAddOpen || Boolean(editStudent)}
        student={editStudent}
        onClose={() => {
          setIsAddOpen(false);
          setEditStudent(null);
        }}
        onSuccess={() => {
          startTransition(() => {
            router.refresh();
          });
        }}
      />

      {/* 6. Suspend / Delete Safety Confirmation Dialog */}
      <StudentDeleteDialog
        student={deleteStudent}
        isOpen={Boolean(deleteStudent)}
        onClose={() => setDeleteStudent(null)}
        onSuccess={() => {
          startTransition(() => {
            router.refresh();
          });
        }}
      />

    </div>
  );
}
