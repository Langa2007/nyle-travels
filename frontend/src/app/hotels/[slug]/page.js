/**
 * hotels/[slug]/page.js
 *
 * Next.js 14 App Router rule: useParams() (and any hook that reads "dynamic"
 * context) inside a Client Component must be wrapped in a <Suspense> boundary
 * at the page level, otherwise Next.js cannot complete the server pre-render
 * and throws a 500.
 *
 * This file is therefore a THIN Server Component wrapper that supplies the
 * Suspense shell.  All real work lives in HotelDetailClient below.
 */

import { Suspense } from 'react';
import HotelDetailClient from './_client';

export default function HotelDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f2] flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-serif italic">Preparing your stay…</p>
        </div>
      }
    >
      <HotelDetailClient />
    </Suspense>
  );
}
