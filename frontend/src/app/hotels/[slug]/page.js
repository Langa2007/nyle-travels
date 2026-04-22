/**
 * hotels/[slug]/page.js  ── SERVER COMPONENT (no 'use client')
 *
 * The root cause of the persistent 500:
 *   Next.js 14 App Router still server-side-renders Client Components to
 *   produce initial HTML.  Any hook or context that reads dynamic route
 *   data (useParams, useRouter) CAN throw during that SSR pass, producing
 *   an opaque 500 that never reaches the error.js boundary.
 *
 * Correct Next.js 14 App Router pattern:
 *   ✅  Server Component receives `params` as a plain prop — always safe.
 *   ✅  Server Component finds the hotel from seed data synchronously.
 *   ✅  Passes `slug` + `initialHotel` as serializable props to <HotelDetailClient>.
 *   ✅  Client Component never calls useParams; it receives what it needs.
 */

import hotelsSeed from '@/data/hotels';
import { slugifyHotelValue, normalizeHotels } from '@/lib/hotelCatalog';
import HotelDetailClient from './_client';

function findHotelFromSeed(rawSlug) {
  try {
    const slug = slugifyHotelValue(decodeURIComponent(String(rawSlug ?? '')));
    const normalized = normalizeHotels(hotelsSeed);
    return (
      normalized.find(
        (h) =>
          slugifyHotelValue(h.slug) === slug ||
          slugifyHotelValue(h.name) === slug
      ) ?? null
    );
  } catch (err) {
    console.error('[NyleTravel:HotelDetailPage] Server-side hotel lookup failed:', err);
    return null;
  }
}

export default function HotelDetailPage({ params }) {
  const rawSlug = params?.slug ?? '';
  const slug = slugifyHotelValue(decodeURIComponent(String(rawSlug)));
  const initialHotel = findHotelFromSeed(rawSlug);

  console.info(
    `[NyleTravel:HotelDetailPage] Server render — rawSlug="${rawSlug}" slug="${slug}" found=${!!initialHotel}`
  );

  // Pass only JSON-serializable data to the Client Component
  return <HotelDetailClient slug={slug} initialHotel={initialHotel} />;
}
