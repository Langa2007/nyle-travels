'use client';

import { useEffect, useState } from 'react';
import { toursAPI } from '@/lib/api';

export function useTourCatalog() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadTours() {
      try {
        setLoading(true);
        const response = await toursAPI.getAll();
        if (mounted) {
          setTours(response.data.data.tours || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          console.error('Failed to load tours:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTours();

    return () => {
      mounted = false;
    };
  }, []);

  return { tours, loading, error };
}

export default useTourCatalog;