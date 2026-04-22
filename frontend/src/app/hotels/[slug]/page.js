'use client';

import { useParams } from 'next/navigation';
import hotelsSeed from '@/data/hotels';
import { slugifyHotelValue, normalizeHotels } from '@/lib/hotelCatalog';
import HotelDetailClient from './_client';

export default function HotelDetailPage() {
  const params = useParams();
  const rawSlug = params?.slug ?? '';
  const slug = slugifyHotelValue(decodeURIComponent(String(rawSlug)));

  let initialHotel = null;
  try {
    const normalized = normalizeHotels(hotelsSeed);
    initialHotel = normalized.find(
      (h) =>
        slugifyHotelValue(h.slug) === slug ||
        slugifyHotelValue(h.name) === slug
    ) ?? null;
  } catch (err) {
    console.error('[NyleTravel:HotelDetailPage] Client-side hotel lookup failed:', err);
  }

  return <HotelDetailClient slug={slug} initialHotel={initialHotel} />;
}
