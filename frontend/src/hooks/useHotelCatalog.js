'use client';

import { useEffect, useState } from 'react';
import {
  HOTELS_SETTINGS_KEY,
  normalizeHotels,
} from '@/lib/hotelCatalog';
import { fetchAllSettings } from '@/utils/settings';

export function useHotelCatalog(seedHotels = []) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadHotels() {
      try {
        const settings = await fetchAllSettings();
        const savedCatalog = settings?.[HOTELS_SETTINGS_KEY];

        if (mounted) {
          if (Array.isArray(savedCatalog) && savedCatalog.length > 0) {
            setHotels(normalizeHotels(savedCatalog));
          } else {
            setHotels(normalizeHotels(seedHotels));
          }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { hotels, loading };
}

export default useHotelCatalog;
