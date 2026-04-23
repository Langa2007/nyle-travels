'use client';

import { useState, useCallback } from 'react';
import { getSession, signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

/**
 * useAuthPopup Hook
 * Manages the lifecycle of an authentication popup window.
 * Aligned with Nyle Store implementation for maximum compatibility.
 */
export const useAuthPopup = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signInWithPopup = useCallback(async (provider, options = {}) => {
    if (isAuthenticating) return;
    
    setIsAuthenticating(true);
    
    // Define popup parameters
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popupFeatures = `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`;
    
    // The callback URL points to our popup-callback route
    const callbackUrl = `${window.location.origin}/auth/popup-callback`;
    
    // 1. Open a blank popup immediately to avoid popup blockers
    const popup = window.open('', 'NyleTravelAuth', popupFeatures);
    
    if (!popup) {
      toast.error('Popup blocked. Please allow popups for this site.');
      setIsAuthenticating(false);
      return;
    }

    try {
      // 2. Trigger NextAuth signIn but handle the URL manually for the popup
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });

      if (!result?.url) {
        popup.close();
        toast.error('Unable to start authentication. Please try again.');
        setIsAuthenticating(false);
        return;
      }

      // 3. Set the popup location to the actual Google auth URL
      popup.location.href = result.url;

      const getFreshSession = async () => {
        for (let attempt = 0; attempt < 5; attempt += 1) {
          const session = await getSession();
          if (session?.user) return session;
          await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
        }
        return null;
      };

      let checkClosed;

      const messageHandler = async (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data?.type === 'AUTH_SUCCESS' && event.data?.source === 'next-auth-popup') {
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
            console.error('Popup Auth Success Handler Error:', callbackError);
            toast.error('Sign-in finished, but we could not complete the session setup.');
          } finally {
            setIsAuthenticating(false);
          }
        }
      };

      window.addEventListener('message', messageHandler);

      // Monitor if popup was closed without finishing
      checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          setIsAuthenticating(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Popup Auth Error:', error);
      if (popup) popup.close();
      toast.error('Authentication failed. Please try again.');
      setIsAuthenticating(false);
    }
  }, [isAuthenticating]);

  return {
    signInWithPopup,
    isAuthenticating
  };
};
