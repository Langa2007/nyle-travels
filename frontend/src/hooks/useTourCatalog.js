import { useState, useEffect, useCallback } from 'react';
import { toursAPI } from '@/lib/api';

/**
 * Hook for managing tour catalog state
 * Supports filtering, sorting, and pagination
 */
export default function useTourCatalog(initialFilters = {}) {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sort: 'created_at',
    order: 'DESC',
    ...initialFilters
  });

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      const response = await toursAPI.getAll(filters);
      
      setTours(response.data.data.tours);
      setTotal(response.data.data.total);
      setTotalPages(response.data.data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError(err.response?.data?.message || 'Failed to load tours');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Reset to page 1 on filter change unless page specified
    }));
  };

  const nextPage = () => {
    if (filters.page < totalPages) {
      updateFilters({ page: filters.page + 1 });
    }
  };

  const prevPage = () => {
    if (filters.page > 1) {
      updateFilters({ page: filters.page - 1 });
    }
  };

  return {
    tours,
    loading,
    error,
    total,
    totalPages,
    currentPage: filters.page,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    refresh: fetchTours
  };
}
