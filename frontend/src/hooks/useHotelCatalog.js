'use client';

import { useEffect, useState } from 'react';
import {
  HOTELS_SETTINGS_KEY,
  normalizeHotels,
} from '@/lib/hotelCatalog';
import { fetchAllSettings } from '@/utils/settings';

export function useHotelCatalog(seedHotels = []) {
  const [hotels, setHotels] = useState(() => normalizeHotels(seedHotels));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadHotels() {
      try {
        const settings = await fetchAllSettings();
        const savedCatalog = settings?.[HOTELS_SETTINGS_KEY];

        if (mounted && Array.isArray(savedCatalog) && savedCatalog.length > 0) {
          setHotels(normalizeHotels(savedCatalog));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHotels();

    return () => {
      mounted = false;
    };
  }, []);

  return { hotels, loading };
}

export default useHotelCatalog;
