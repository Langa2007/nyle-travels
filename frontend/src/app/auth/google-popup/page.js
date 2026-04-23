'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Google OAuth Popup Redirect
 * Opened inside the popup window.  It immediately POSTs to NextAuth's
 * /api/auth/signin/google endpoint using a dynamically-created form, which
 * causes the popup to skip the NextAuth sign-in page and go straight to
 * Google's OAuth consent screen.
 */
export default function GooglePopupRedirect() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/auth/popup-callback';

  useEffect(() => {
    const redirect = async () => {
      try {
        // Fetch the CSRF token required by NextAuth for form submissions
        const csrfRes = await fetch('/api/auth/csrf');
        const { csrfToken } = await csrfRes.json();

        // Build and auto-submit a hidden form to /api/auth/signin/google
        // This is the only reliable way to bypass the NextAuth sign-in page
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/api/auth/signin/google';
        form.style.display = 'none';

        const csrfInput = document.createElement('input');
        csrfInput.name = 'csrfToken';
        csrfInput.value = csrfToken;

        const callbackInput = document.createElement('input');
        callbackInput.name = 'callbackUrl';
        callbackInput.value = callbackUrl;

        form.appendChild(csrfInput);
        form.appendChild(callbackInput);
        document.body.appendChild(form);
        form.submit();
      } catch (err) {
        console.error('[GooglePopupRedirect] Failed to initiate OAuth:', err);
      }
    };

    redirect();
  }, [callbackUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-sm font-medium">Connecting to Google...</p>
      </div>
    </div>
  );
}
