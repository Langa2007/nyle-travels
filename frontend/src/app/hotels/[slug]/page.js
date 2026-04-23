'use client';

import { useParams } from 'next/navigation';
import { slugifyHotelValue } from '@/lib/hotelCatalog';
import HotelDetailClient from './_client';

export default function HotelDetailPage() {
  const params = useParams();
  const rawSlug = params?.slug ?? '';
  const slug = slugifyHotelValue(decodeURIComponent(String(rawSlug)));

  return <HotelDetailClient slug={slug} initialHotel={null} />;
}
