'use client';
import { useState } from 'react';

export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handleNextPage = () => setPage((p) => p + 1);
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handlePageChange = (p: number) => setPage(p);
  const handleLimitChange = (l: number) => {
    setLimit(l);
    setPage(1);
  };

  return { page, limit, handleNextPage, handlePrevPage, handlePageChange, handleLimitChange };
}
