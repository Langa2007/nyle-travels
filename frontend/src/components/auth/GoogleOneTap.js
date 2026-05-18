'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getSession, signIn, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import {
  buildGoogleAccountNotFoundUrl,
  isGoogleAccountNotFoundError,
} from '@/lib/googleAuthError';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '766373716111-naoh8vma3on54nnhtlolhr2orae6q14v.apps.googleusercontent.com';

async function waitForSession() {
  for (let attempt = 0; attempt < 15; attempt += 1) {
    const session = await getSession();
    if (session?.user) return session;
    await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
  }
  return null;
}

export default function GoogleOneTap() {
  const { status } = useSession();
  const pathname = usePathname();
  const initializedRef = useRef(false);

  useEffect(() => {
    const isAuthPage =
      pathname === '/login' ||
      pathname === '/register' ||
      pathname?.startsWith('/auth/');

    if (
      isAuthPage ||
      status === 'loading' ||
      status === 'authenticated' ||
      typeof window === 'undefined' ||
      initializedRef.current
    ) {
      return;
    }

    const handleCredentialResponse = async (response) => {
      // Immediately remove the One Tap UI
      if (window.google) {
        window.google.accounts.id.cancel();
      }
      
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

        window.location.replace('/');
      } catch (error) {
        console.error('[Nyle Travel] One Tap error:', error);
      }
    };

    const initializeOneTap = () => {
      if (!window.google || initializedRef.current) return;
      
      try {
        initializedRef.current = true;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          itp_support: true,
          use_fedcm_for_prompt: true,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt();
      } catch (err) {
        console.warn('[Nyle Travel] Google GSI initialization failed (likely blocked by client):', err.message);
      }
    };

    if (window.google) {
      initializeOneTap();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initializeOneTap();
        }
      }, 500);
      return () => {
        clearInterval(interval);
        if (initializedRef.current) {
          window.google?.accounts?.id?.cancel();
        }
      };
    }

    return () => {
      if (initializedRef.current) {
        window.google?.accounts?.id?.cancel();
      }
    };
  }, [pathname, status]);

  return null; // This component doesn't render anything visible
}
