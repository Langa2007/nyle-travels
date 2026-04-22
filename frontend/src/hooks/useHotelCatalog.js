'use client';

import { useEffect, useState } from 'react';
import {
  HOTELS_SETTINGS_KEY,
  normalizeHotels,
} from '@/lib/hotelCatalog';
import { fetchAllSettings } from '@/utils/settings';

const LOG_PREFIX = '[NyleTravel:useHotelCatalog]';

export function useHotelCatalog(seedHotels = []) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadHotels() {
      console.info(`${LOG_PREFIX} Starting catalog fetch…`);

      try {
        const settings = await fetchAllSettings();
        
        // Try the primary key first, then the legacy/homepage key
        let rawCatalog = settings?.[HOTELS_SETTINGS_KEY] || settings?.['luxury_stays_sections'];

        // Robustly handle stringified JSON if the DB driver returns it as such
        if (typeof rawCatalog === 'string') {
          try {
            rawCatalog = JSON.parse(rawCatalog);
          } catch (e) {
            console.error(`${LOG_PREFIX} Failed to parse stringified catalog:`, e);
            rawCatalog = null;
          }
        }

        const hasSaved = Array.isArray(rawCatalog) && rawCatalog.length > 0;
        const source = settings?.[HOTELS_SETTINGS_KEY] ? 'DATABASE (hotels_catalog)' : (settings?.['luxury_stays_sections'] ? 'DATABASE (luxury_stays)' : 'NONE (Falling back to seed)');

        console.log(
          `%c${LOG_PREFIX} DATA SYNC CHECK:`,
          'color: #0070f3; font-weight: bold;',
          {
            hasSaved,
            count: hasSaved ? rawCatalog.length : 0,
            source,
            firstItemName: hasSaved ? rawCatalog[0].name : 'N/A'
          }
        );

        if (!mounted) return;

        if (hasSaved) {
          const normalized = normalizeHotels(rawCatalog);
          setHotels(normalized);
        } else {
          const normalized = normalizeHotels(seedHotels);
          console.warn(`${LOG_PREFIX} Using local seed data (Unsplash-free) because no database settings were found.`);
          setHotels(normalized);
        }
      } catch (err) {
        console.error(`${LOG_PREFIX} Unexpected error loading catalog:`, {
          message: err?.message,
          name: err?.name,
          stack: err?.stack,
        });

        if (!mounted) return;

        // Fall back to seed data so the page still renders
        try {
          const fallback = normalizeHotels(seedHotels);
          console.warn(`${LOG_PREFIX} Falling back to seed data — ${fallback.length} hotels.`);
          setHotels(fallback);
        } catch (seedErr) {
          console.error(`${LOG_PREFIX} Seed data normalization also failed:`, seedErr);
          setHotels([]);
        }

        setError(err);
      } finally {
        if (mounted) {
          setLoading(false);
          console.info(`${LOG_PREFIX} Catalog load complete.`);
        }
      }
    }

    loadHotels();

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { hotels, loading, error };
}

export default useHotelCatalog;
