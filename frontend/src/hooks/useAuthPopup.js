'use client';

import { useState, useCallback } from 'react';
import { getSession, signIn } from 'next-auth/react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export const useAuthPopup = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signInWithPopup = useCallback(async (provider, options = {}) => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);

    const width = 600;
    const height = 700;
    const left = window.screenX + Math.round((window.outerWidth - width) / 2);
    const top = window.screenY + Math.round((window.outerHeight - height) / 2);
    const popupFeatures = `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`;
    const callbackUrl = `${window.location.origin}/auth/popup-callback`;

    try {
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });

      if (!result?.url) {
        toast.error('Unable to start Google sign-in. Please try again.');
        options.onError?.('Unable to start Google sign-in. Please try again.');
        setIsAuthenticating(false);
        return;
      }

      const popup = window.open(result.url, 'NyleTravelAuth', popupFeatures);

      if (!popup) {
        toast.error('Popup blocked. Please allow popups for this site.');
        options.onError?.('Popup blocked. Please allow popups for this site.');
        setIsAuthenticating(false);
        return;
      }

      const getFreshSession = async () => {
        for (let attempt = 0; attempt < 8; attempt += 1) {
          const session = await getSession();

          if (session?.user) return session;

          await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
        }

        return null;
      };

      let checkClosed;

      const messageHandler = async (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type !== 'AUTH_SUCCESS' || event.data?.source !== 'next-auth-popup') return;

        window.removeEventListener('message', messageHandler);
        clearInterval(checkClosed);

        try {
          const session = await getFreshSession();

          if (session?.accessToken) {
            Cookies.set('token', session.accessToken, { expires: 7 });
          }

          if (!popup.closed) {
            popup.close();
          }

          if (options.onSuccess) {
            await options.onSuccess(session);
          } else {
            window.location.replace('/');
          }
        } catch (callbackError) {
          console.error('[Nyle Travel] Popup auth success handler error:', callbackError);
          toast.error('Google sign-in finished, but session setup failed. Please refresh.');
          options.onError?.('Google sign-in finished, but session setup failed. Please refresh.');
        } finally {
          setIsAuthenticating(false);
        }
      };

      window.addEventListener('message', messageHandler);

      checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          setIsAuthenticating(false);
        }
      }, 1000);
    } catch (error) {
      console.error('[Nyle Travel] Popup auth error:', error);
      toast.error('Authentication failed. Please try again.');
      options.onError?.('Authentication failed. Please try again.');
      setIsAuthenticating(false);
    }
  }, [isAuthenticating]);

  return { signInWithPopup, isAuthenticating };
};
