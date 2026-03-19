'use client';

import { useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';

export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  return {
    filters,
    searchTerm,
    debouncedSearch,
    setSearchTerm,
    updateFilter,
    removeFilter,
    clearFilters,
  };
}