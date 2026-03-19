'use client';

import { useState } from 'react';

export function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const updatePagination = (newTotal) => {
    setTotal(newTotal);
    setTotalPages(Math.ceil(newTotal / limit));
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return {
    page,
    limit,
    total,
    totalPages,
    setLimit,
    updatePagination,
    nextPage,
    prevPage,
    goToPage,
  };
}