'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';


// GoogleIdentitySync Component
// Integrates Google Identity Services (One Tap & Popup) with NextAuth.

export default function GoogleIdentitySync() {
  const { status } = useSession();

  useEffect(() => {
    // Only initialize if the user is not authenticated and the SDK is loaded
    if (status === 'authenticated' || typeof window === 'undefined' || !window.google) {
      return;
    }

    const handleCredentialResponse = async (response) => {
      try {
        console.log('Google credential received');
        // Sign in via  custom token handler in NextAuth
        await signIn('google-id-token', {
          id_token: response.credential,
          redirect: false,
        });

        // Refresh the page to update auth state
        window.location.reload();
      } catch (error) {
        console.error('Login error:', error);
      }
    };

    // Initialize Google Identity
    window.google.accounts.id.initialize({
      client_id: '766373716111-naoh8vma3on54nnhtlolhr2orae6q14v.apps.googleusercontent.com',
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
      prompt_parent_id: 'g_id_onload', // Added for One Tap stability
    });

    // Prompt for One Tap
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        console.log('One Tap not displayed:', notification.getNotDisplayedReason());
      } else if (notification.isSkippedMoment()) {
        console.log('One Tap skipped:', notification.getSkippedReason());
      } else if (notification.isDismissedMoment()) {
        console.log('One Tap dismissed:', notification.getDismissedReason());
      }
    });

  }, [status]);

  return <div id="g_id_onload" style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}></div>;
}
