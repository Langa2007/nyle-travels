'use client';

const AUTH_DIAGNOSTIC_ENDPOINT = '/api/auth/debug';

function createTraceId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function safeError(error) {
  if (!error) return undefined;

  return {
    name: error.name,
    message: error.message || String(error),
  };
}

export function createAuthTrace(source) {
  return {
    source,
    traceId: createTraceId(),
    startedAt: Date.now(),
  };
}

export function reportAuthDiagnostic(trace, stage, details = {}) {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify({
    traceId: trace?.traceId,
    source: trace?.source,
    stage,
    path: window.location.pathname,
    elapsedMs: trace?.startedAt ? Date.now() - trace.startedAt : undefined,
    ...details,
    error: safeError(details.error),
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(AUTH_DIAGNOSTIC_ENDPOINT, blob);
      return;
    }

    fetch(AUTH_DIAGNOSTIC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch (_) {
    // Diagnostics must never interrupt auth.
  }
}
