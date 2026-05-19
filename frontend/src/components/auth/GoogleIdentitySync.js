'use client';

import { useEffect, useRef } from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { createAuthTrace, reportAuthDiagnostic } from '@/lib/authDiagnostics';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '766373716111-naoh8vma3on54nnhtlolhr2orae6q14v.apps.googleusercontent.com';

async function waitForSession() {
  for (let attempt = 0; attempt < 15; attempt += 1) {
    const session = await getSession();

    if (session?.user) {
      return session;
    }

    await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
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
      const trace = createAuthTrace(`google-button-${context}`);

      reportAuthDiagnostic(trace, 'credential_received', {
        hasCredential: Boolean(response?.credential),
        credentialLength: response?.credential?.length,
        selectBy: response?.select_by,
      });

      try {
        const result = await signIn('google-id-token', {
          id_token: response.credential,
          trace_id: trace.traceId,
          redirect: false,
        });

        reportAuthDiagnostic(trace, 'nextauth_signin_result', {
          ok: result?.ok,
          status: result?.status,
          error: result?.error,
          url: result?.url,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        const session = await waitForSession();

        reportAuthDiagnostic(trace, 'session_wait_result', {
          hasSession: Boolean(session?.user),
          hasAccessToken: Boolean(session?.accessToken),
          userEmail: session?.user?.email,
        });
        
        if (session?.accessToken) {
          Cookies.set('token', session.accessToken, { expires: 7 });
        }

        if (onSuccessRef.current) {
          await onSuccessRef.current(session);
        } else {
          window.location.replace('/');
        }
      } catch (error) {
        reportAuthDiagnostic(trace, 'google_signin_failed', { error });
        console.error('[Nyle Travel] Google popup sign-in error:', error);
        const message = error.message || 'Google sign-in failed. Please try again.';
        if (onErrorRef.current) {
          onErrorRef.current(message);
        } else {
          toast.error(message);
        }
      }
    };

    buttonRef.current.innerHTML = '';

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      use_fedcm_for_prompt: false,
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
