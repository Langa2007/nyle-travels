import { NextResponse } from 'next/server';

const MAX_STRING_LENGTH = 500;

function maskEmail(value) {
  if (typeof value !== 'string' || !value.includes('@')) return value;

  return value.replace(
    /([A-Z0-9._%+-]{2})([A-Z0-9._%+-]*)@([A-Z0-9.-]+\.[A-Z]{2,})/gi,
    (_, visible, rest, domain) => `${visible}${'*'.repeat(Math.max(rest.length, 1))}@${domain}`
  );
}

function redactValue(key, value) {
  const normalizedKey = key.toLowerCase();

  if (
    normalizedKey.includes('token') ||
    normalizedKey.includes('credential') ||
    normalizedKey.includes('secret') ||
    normalizedKey.includes('password')
  ) {
    return '[redacted]';
  }

  if (normalizedKey.includes('email')) {
    return maskEmail(value);
  }

  if (typeof value === 'string' && value.length > MAX_STRING_LENGTH) {
    return `${maskEmail(value).slice(0, MAX_STRING_LENGTH)}...[truncated]`;
  }

  return typeof value === 'string' ? maskEmail(value) : value;
}

function sanitize(input) {
  if (!input || typeof input !== 'object') return input;

  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return [key, sanitize(value)];
      }

      return [key, redactValue(key, value)];
    })
  );
}

export async function POST(request) {
  try {
    const payload = sanitize(await request.json());

    console.info('[AUTH_DIAGNOSTIC_CLIENT]', {
      ...payload,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    });
  } catch (error) {
    console.warn('[AUTH_DIAGNOSTIC_CLIENT_PARSE_FAILED]', {
      message: error.message,
    });
  }

  return NextResponse.json({ ok: true });
}
