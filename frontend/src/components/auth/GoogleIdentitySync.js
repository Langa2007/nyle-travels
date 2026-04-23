'use client';

import { useEffect, useRef } from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '766373716111-naoh8vma3on54nnhtlolhr2orae6q14v.apps.googleusercontent.com';

async function waitForSession() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const session = await getSession();

    if (session?.user) {
      return session;
    }

    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }

  return null;
}

export default function GoogleIdentitySync({
  text = 'continue_with',
  context = 'signin',
  onSuccess,
  onError,
  className = '',
}) {
  const { status } = useSession();
  const buttonRef = useRef(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onError, onSuccess]);

  useEffect(() => {
    if (
      status === 'authenticated' ||
      typeof window === 'undefined' ||
      !window.google ||
      !buttonRef.current
    ) {
      return;
    }

    const handleCredentialResponse = async (response) => {
      try {
        const result = await signIn('google-id-token', {
          id_token: response.credential,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        const session = await waitForSession();
        
        if (session?.accessToken) {
          Cookies.set('token', session.accessToken, { expires: 7 });
        }

        if (onSuccessRef.current) {
          await onSuccessRef.current(session);
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error('[Nyle Travel] Google popup sign-in error:', error);
        onErrorRef.current?.('Google sign-in failed. Please try again.');
      }
    };

    buttonRef.current.innerHTML = '';

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      context,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text,
      shape: 'pill',
      logo_alignment: 'left',
      width: buttonRef.current.offsetWidth || 320,
    });

    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = '';
      }
    };
  }, [context, status, text]);

  return <div ref={buttonRef} className={className} />;
}
