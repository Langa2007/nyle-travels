'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function AdminSettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/admin/media');
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-3xl mx-auto py-20">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center space-y-4">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary-600">
          Settings Moved
        </p>
        <h1 className="text-3xl font-serif font-black text-gray-900">
          Homepage media now lives in Site Content.
        </h1>
        <p className="text-gray-600 font-medium">
          Hero slides, homepage images, and video are managed from the unified content editor so the
          frontend and admin stay in sync.
        </p>
        <div className="flex items-center justify-center">
          <Button href="/admin/media" variant="primary">
            Open Site Content
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Redirecting automatically. If nothing happens, use{' '}
          <Link href="/admin/media" className="text-primary-600 font-semibold hover:underline">
            Site Content
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
