'use client';

import { useEffect, useState } from 'react';
import {
  HOTELS_SETTINGS_KEY,
  normalizeHotels,
  slugifyHotelValue,
} from '@/lib/hotelCatalog';
import { hotelsAPI } from '@/lib/api';
import { fetchAllSettings } from '@/utils/settings';

const LOG_PREFIX = '[NyleTravel:useHotelCatalog]';

function getHotelMergeKey(hotel, index = 0) {
  const slug = slugifyHotelValue(hotel?.slug);

  if (slug) {
    return slug;
  }

  const name = slugifyHotelValue(hotel?.name);

  if (name) {
    return name;
  }

  return `hotel-${index + 1}`;
}

function readSettingsArray(settings, key) {
  const value = settings?.[key];
  return Array.isArray(value) ? value : [];
}

function mergeHotelCatalogs(...sources) {
  const merged = new Map();

  sources.forEach((source) => {
    source.forEach((hotel, index) => {
      if (!hotel) {
        return;
      }

      const key = getHotelMergeKey(hotel, index);
      const current = merged.get(key) || {};
      merged.set(key, { ...current, ...hotel });
    });
  });

  return Array.from(merged.values());
}

export function useHotelCatalog(seedHotels = [], options = {}) {
  const { allowSeedFallback = false } = options;
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadHotels() {
      console.info(`${LOG_PREFIX} Starting catalog fetch...`);

      try {
        const [settingsResult, hotelsResult] = await Promise.allSettled([
          fetchAllSettings(),
          hotelsAPI.getAll({ limit: 200 }),
        ]);

        const settings =
          settingsResult.status === 'fulfilled' && settingsResult.value
            ? settingsResult.value
            : {};
        const catalog = readSettingsArray(settings, HOTELS_SETTINGS_KEY);
        const luxury = readSettingsArray(settings, 'luxury_stays_sections');
        const liveHotels =
          hotelsResult.status === 'fulfilled'
            ? hotelsResult.value?.data?.data?.hotels || []
            : [];
        const rawCatalog = mergeHotelCatalogs(catalog, luxury, liveHotels);
        const hasSaved = rawCatalog.length > 0;
        const source =
          liveHotels.length > 0 && (catalog.length > 0 || luxury.length > 0)
            ? 'MERGED (API + Settings)'
            : liveHotels.length > 0
              ? 'API (/hotels)'
              : catalog.length > 0 && luxury.length > 0
                ? 'MERGED (Catalog + Luxury)'
                : catalog.length > 0
                  ? 'DATABASE (hotels_catalog)'
                  : luxury.length > 0
                    ? 'DATABASE (luxury_stays)'
                    : allowSeedFallback
                      ? 'LOCAL FALLBACK'
                      : 'EMPTY';

        console.log(
          `%c${LOG_PREFIX} DATA SYNC CHECK:`,
          'color: #0070f3; font-weight: bold;',
          {
            hasSaved,
            count: rawCatalog.length,
            apiCount: liveHotels.length,
            catalogCount: catalog.length,
            luxuryCount: luxury.length,
            source,
          }
        );

        if (!mounted) return;

        if (hasSaved) {
          setHotels(normalizeHotels(rawCatalog));
        } else {
          const fallback = allowSeedFallback ? normalizeHotels(seedHotels) : [];

          if (allowSeedFallback) {
            console.warn(`${LOG_PREFIX} Using local seed data because no admin hotel data was found.`);
          } else {
            console.warn(`${LOG_PREFIX} No admin hotel data found. Returning an empty catalog instead of seed data.`);
          }

          setHotels(fallback);
        }

        if (settingsResult.status === 'rejected') {
          console.warn(`${LOG_PREFIX} Settings fetch failed:`, settingsResult.reason);
        }

        if (hotelsResult.status === 'rejected') {
          console.warn(`${LOG_PREFIX} Hotels API fetch failed:`, hotelsResult.reason);
        }
      } catch (err) {
        console.error(`${LOG_PREFIX} Unexpected error loading catalog:`, {
          message: err?.message,
          name: err?.name,
          stack: err?.stack,
        });

        if (!mounted) return;

        try {
          const fallback = allowSeedFallback ? normalizeHotels(seedHotels) : [];
          console.warn(
            allowSeedFallback
              ? `${LOG_PREFIX} Falling back to local seed data - ${fallback.length} hotels.`
              : `${LOG_PREFIX} Falling back to an empty hotel catalog.`
          );
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
