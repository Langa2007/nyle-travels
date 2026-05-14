'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Authentication Popup Callback Page
 * This page is loaded inside a popup window after successful OAuth.
 * it signals the parent window and closes itself.
 */
function AuthPopupCallbackInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasAuthError = Boolean(searchParams.get('error'));
    const messageType = hasAuthError ? 'AUTH_ERROR' : 'AUTH_SUCCESS';

    if (window.opener) {
      window.opener.postMessage(
        {
          type: messageType,
          source: 'next-auth-popup',
          error: searchParams.get('error'),
        },
        window.location.origin
      );
    }
    
    // Close the popup after a brief delay to ensure message is sent
    const timer = setTimeout(() => {
      window.close();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8 text-center">
      <div>
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Finishing Authentication</h1>
        <p className="text-gray-500">Completing secure login... this window will close automatically.</p>
      </div>
    </div>
  );
}

export default function AuthPopupCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white p-8 text-center">
          <div>
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Finishing Authentication</h1>
            <p className="text-gray-500">Completing secure login... this window will close automatically.</p>
          </div>
        </div>
      }
    >
      <AuthPopupCallbackInner />
    </Suspense>
  );
}
