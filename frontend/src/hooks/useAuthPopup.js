'use client';

import { useState, useCallback } from 'react';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

/**
 * useAuthPopup Hook for Nyle Travel
 *
 * Key insight: For OAuth providers (Google), NextAuth's signIn() ALWAYS
 * redirects the current page, even with `redirect: false`. The only reliable
 * way to open a provider in a popup is to navigate the popup window directly
 * to NextAuth's built-in OAuth initiation URL:
 *   /api/auth/signin/<provider>?callbackUrl=<popup-callback-url>
 *
 * The popup then handles the full Google → NextAuth callback flow.
 * On success, /auth/popup-callback fires postMessage to the parent window.
 */
export const useAuthPopup = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signInWithPopup = useCallback((provider, options = {}) => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);

    // Center the popup on screen
    const width = 600;
    const height = 700;
    const left = window.screenX + Math.round((window.outerWidth - width) / 2);
    const top = window.screenY + Math.round((window.outerHeight - height) / 2);
    const popupFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    // The URL the popup should land on after successful authentication
    const popupCallbackUrl = `${window.location.origin}/auth/popup-callback`;

    // Navigate the popup to our /auth/google-popup page which:
    //   1. Fetches the NextAuth CSRF token
    //   2. Auto-POSTs to /api/auth/signin/google
    //   3. Google redirects back → NextAuth → /auth/popup-callback
    // We cannot POST directly from the main window because the redirect would
    // hijack the main page. Opening this intermediary page in the popup is the
    // only reliable cross-browser approach.
    const signinUrl = `/auth/google-popup?callbackUrl=${encodeURIComponent(popupCallbackUrl)}`;

    // Open the popup synchronously (before any async work) to avoid popup blockers
    const popup = window.open(signinUrl, 'NyleTravelAuth', popupFeatures);

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      toast.error('Popup blocked. Please allow popups for this site and try again.');
      setIsAuthenticating(false);
      return;
    }

    // Poll for a fresh session after the popup signals AUTH_SUCCESS
    const getFreshSession = async () => {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const session = await getSession();
        if (session?.user) return session;
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
      }
      return null;
    };

    let checkClosed;

    // Listen for the AUTH_SUCCESS message posted by /auth/popup-callback
    const messageHandler = async (event) => {
      if (event.origin !== window.location.origin) return;

      if (
        event.data?.type === 'AUTH_SUCCESS' &&
        event.data?.source === 'next-auth-popup'
      ) {
        window.removeEventListener('message', messageHandler);
        clearInterval(checkClosed);

        try {
          const session = await getFreshSession();
          if (options.onSuccess) {
            await options.onSuccess(session);
          } else {
            window.location.reload();
          }
        } catch (callbackError) {
          console.error('[useAuthPopup] onSuccess handler error:', callbackError);
          toast.error('Signed in, but could not complete session setup. Please refresh.');
        } finally {
          setIsAuthenticating(false);
        }
      }
    };

    window.addEventListener('message', messageHandler);

    // Clean up if the user closes the popup manually without finishing
    checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        setIsAuthenticating(false);
      }
    }, 1000);
  }, [isAuthenticating]);

  return { signInWithPopup, isAuthenticating };
};
