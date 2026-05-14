'use client';

import { useEffect, useRef } from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { getPostAuthRedirect } from '@/lib/authRedirect';
import {
  buildGoogleAccountNotFoundUrl,
  isGoogleAccountNotFoundError,
} from '@/lib/googleAuthError';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '766373716111-naoh8vma3on54nnhtlolhr2orae6q14v.apps.googleusercontent.com';

async function waitForSession() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const session = await getSession();
    if (session?.user) return session;
    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  return null;
}

export default function GoogleOneTap() {
  const { status } = useSession();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (
      status === 'authenticated' ||
      typeof window === 'undefined' ||
      initializedRef.current
    ) {
      return;
    }

    const handleCredentialResponse = async (response) => {
      try {
        const result = await signIn('google-id-token', {
          id_token: response.credential,
          flow: 'signin',
          redirect: false,
        });

        if (result?.error) {
          if (isGoogleAccountNotFoundError(result.error)) {
            window.location.href = buildGoogleAccountNotFoundUrl('/login');
            return;
          }

          throw new Error(result.error);
        }

        const session = await waitForSession();
        
        if (session?.accessToken) {
          Cookies.set('token', session.accessToken, { expires: 7 });
        }

        window.location.href = getPostAuthRedirect(window.location.pathname + window.location.search + window.location.hash);
      } catch (error) {
        console.error('[Nyle Travel] One Tap error:', error);
      }
    };

    const initializeOneTap = () => {
      if (!window.google) return;
      
      initializedRef.current = true;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        itp_support: true,
        use_fedcm_for_prompt: true,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt();
    };

    if (window.google) {
      initializeOneTap();
    } else {
      // Wait for the script to load if it's not ready yet
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initializeOneTap();
        }
      }, 100);
      return () => {
        clearInterval(interval);
        window.google?.accounts?.id?.cancel();
      };
    }

    return () => {
      window.google?.accounts?.id?.cancel();
    };
  }, [status]);

  return null; // This component doesn't render anything visible
}
