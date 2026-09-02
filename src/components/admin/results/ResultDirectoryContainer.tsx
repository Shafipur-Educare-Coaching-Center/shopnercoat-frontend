'use client';

import React, { useState, useEffect, useTransition, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Exam } from '@/types/exam.types';
import { Student } from '@/types/student.types';
import { Result } from '@/types/result.types';
import { getAdminExamResultsAction } from '@/features/admin/results/actions/getAdminExamResultsAction';
import { ResultHeader } from './ResultHeader';
import { ResultStatsBanner } from './ResultStatsBanner';
import { ResultTable } from './ResultTable';
import { ResultEntryDialog } from './ResultEntryDialog';
import { ResultBulkEntryDialog } from './ResultBulkEntryDialog';
import { ResultPublishDialog } from './ResultPublishDialog';

interface ResultDirectoryContainerProps {
  initialResults: Result[];
  exams: Exam[];
  students: Student[];
  initialExamId?: string;
}

export function ResultDirectoryContainer({
  initialResults,
  exams,
  students,
  initialExamId,
}: ResultDirectoryContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedExamId, setSelectedExamId] = useState<string>(() => {
    if (initialExamId) return initialExamId;
    return exams[0]?.id || '';
  });

  const [results, setResults] = useState<Result[]>(initialResults);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isSingleEntryOpen, setIsSingleEntryOpen] = useState(false);
  const [isBulkEntryOpen, setIsBulkEntryOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [editResult, setEditResult] = useState<Result | null>(null);

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  // Fetch results when exam selection changes
  const fetchResultsForExam = useCallback((examId: string) => {
    if (!examId) return;
    startTransition(async () => {
      const res = await getAdminExamResultsAction(examId);
      if (res.success && res.results) {
        setResults(res.results);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchResultsForExam(selectedExamId);
    }
  }, [selectedExamId, fetchResultsForExam]);

  // Filter results by search query
  const filteredResults = useMemo(() => {
    return results.filter((res) => {
      const q = searchQuery.toLowerCase().trim();
      const studentName = (res.student?.fullName || '').toLowerCase();
      const rollNumber = String(res.student?.rollNumber || '');
      const college = (res.student?.collegeName || '').toLowerCase();

      return (
        q === '' ||
        studentName.includes(q) ||
        rollNumber.includes(q) ||
        college.includes(q)
      );
    });
  }, [results, searchQuery]);

  const handleRefresh = () => {
    if (selectedExamId) {
      fetchResultsForExam(selectedExamId);
    }
    startTransition(() => {
      router.refresh();
      toast.success('Mark Sheet Tabulation Synchronized');
    });
  };

  const handleSingleEntrySuccess = (savedResult: Result) => {
    setResults((prev) => {
      const existingIdx = prev.findIndex((r) => r.id === savedResult.id || r.studentId === savedResult.studentId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = savedResult;
        return updated;
      }
      return [savedResult, ...prev];
    });
    handleRefresh();
  };

  const isExamPublished = selectedExam?.status === 'RESULT_PUBLISHED';

  return (
    <div className="w-full flex flex-col select-none">
      
      {/* 1. Header with Controls & Actions */}
      <ResultHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedExamId={selectedExamId}
        onExamChange={setSelectedExamId}
        exams={exams}
        onOpenSingleEntry={() => {
          setEditResult(null);
          setIsSingleEntryOpen(true);
        }}
        onOpenBulkEntry={() => setIsBulkEntryOpen(true)}
        onOpenPublish={() => setIsPublishOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isPending}
        isExamPublished={isExamPublished}
      />

      {/* 2. Top Evaluation Metrics Banner */}
      <ResultStatsBanner results={filteredResults} />

      {/* 3. Mark Sheet Tabulation Table */}
      <ResultTable
        results={filteredResults}
        onEditResult={(res) => {
          setEditResult(res);
          setIsSingleEntryOpen(true);
        }}
      />

      {/* 4. Single Mark Entry Modal */}
      {selectedExam && (
        <ResultEntryDialog
          isOpen={isSingleEntryOpen}
          onClose={() => {
            setIsSingleEntryOpen(false);
            setEditResult(null);
          }}
          exam={selectedExam}
          students={students}
          editResult={editResult}
          onSuccess={handleSingleEntrySuccess}
        />
      )}

      {/* 5. Bulk Spreadsheet Mark Entry Modal */}
      {selectedExam && (
        <ResultBulkEntryDialog
          isOpen={isBulkEntryOpen}
          onClose={() => setIsBulkEntryOpen(false)}
          exam={selectedExam}
          students={students}
          onSuccess={handleRefresh}
        />
      )}

      {/* 6. Publish Results & Dense Ranking Confirmation Modal */}
      {selectedExam && (
        <ResultPublishDialog
          isOpen={isPublishOpen}
          onClose={() => setIsPublishOpen(false)}
          exam={selectedExam}
          totalEvaluated={results.length}
          onSuccess={handleRefresh}
        />
      )}

    </div>
  );
}
