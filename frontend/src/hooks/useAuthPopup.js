'use client';

import { useState, useCallback, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

/**
 * useAuthPopup Hook
 * Manages the lifecycle of an authentication popup window.
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
    
    // The callback URL should point to our special callback page
    const callbackUrl = `${window.location.origin}/auth/popup-callback`;
    
    try {
      // Trigger NextAuth signIn but handle the URL manually for the popup
      // Note: We use redirect: false to prevent the main window from redirecting
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });

      if (result?.url) {
        // Open the Google/provider auth URL in the popup
        const popup = window.open(result.url, 'Authentication', popupFeatures);
        
        if (!popup) {
          toast.error('Popup blocked. Please allow popups for this site.');
          setIsAuthenticating(false);
          return;
        }

        // Listen for the success message from the popup
        const messageHandler = (event) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data?.type === 'AUTH_SUCCESS' && event.data?.source === 'next-auth-popup') {
            window.removeEventListener('message', messageHandler);
            toast.success('Authentication successful!');
            
            // Refresh the page or session to reflect login status
            if (options.onSuccess) {
              options.onSuccess();
            } else {
              window.location.reload();
            }
            setIsAuthenticating(false);
          }
        };

        window.addEventListener('message', messageHandler);

        // Monitor if popup was closed without finishing
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            setIsAuthenticating(false);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Popup Auth Error:', error);
      toast.error('Authentication failed. Please try again.');
      setIsAuthenticating(false);
    }
  }, [isAuthenticating]);

  return {
    signInWithPopup,
    isAuthenticating
  };
};
