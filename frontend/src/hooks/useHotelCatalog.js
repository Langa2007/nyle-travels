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

        console.info(
          `${LOG_PREFIX} fetchAllSettings returned — ` +
          `hasSaved=${hasSaved} ` +
          `count=${hasSaved ? rawCatalog.length : 'n/a'} ` +
          `source=${settings?.[HOTELS_SETTINGS_KEY] ? 'hotels_catalog' : (settings?.luxury_stays_sections ? 'luxury_stays' : 'none')}`
        );

        if (!mounted) return;

        if (hasSaved) {
          const normalized = normalizeHotels(rawCatalog);
          console.info(`${LOG_PREFIX} Using admin catalog — ${normalized.length} hotels.`);
          setHotels(normalized);
        } else {
          const normalized = normalizeHotels(seedHotels);
          console.info(
            `${LOG_PREFIX} Admin catalog empty or unavailable — using seed data (${normalized.length} hotels).`
          );
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
