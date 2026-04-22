'use client';

/**
 * hotels/[slug]/error.js
 * Next.js App Router error boundary for the hotel detail route.
 * Catches any thrown error during render and shows a human-readable page.
 * The error is also logged to console so it appears in Vercel function logs.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle, FiRefreshCw, FiChevronLeft } from 'react-icons/fi';

const LOG_PREFIX = '[NyleTravel:HotelDetail:ErrorBoundary]';

export default function HotelDetailError({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // This surfaces in Vercel Runtime Logs — filter by LOG_PREFIX
    console.error(`${LOG_PREFIX} Unhandled render error:`, {
      message: error?.message,
      name: error?.name,
      digest: error?.digest,   // Next.js internal error ID — matches Vercel logs
      stack: error?.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-[#faf8f2] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-400 mb-8">
        <FiAlertTriangle size={36} />
      </div>

      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-500 max-w-md mb-2">
        We hit an unexpected error while loading this hotel page.
      </p>

      {/* Show error message in development only */}
      {process.env.NODE_ENV !== 'production' && (
        <pre className="mt-4 mb-8 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl p-4 max-w-lg overflow-auto text-left whitespace-pre-wrap">
          {error?.message ?? 'Unknown error'}
          {error?.stack ? `\n\n${error.stack}` : ''}
        </pre>
      )}

      {process.env.NODE_ENV === 'production' && (
        <p className="text-gray-400 text-sm mb-8">
          Our team has been notified. You can try again or return to the hotels listing.
        </p>
      )}

      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={() => router.push('/hotels')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <FiChevronLeft className="w-4 h-4" />
          Back to Hotels
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          <FiRefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
