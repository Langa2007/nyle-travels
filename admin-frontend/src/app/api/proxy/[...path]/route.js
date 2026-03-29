const DEFAULT_PROXY_TARGET = 'https://nyle-travels.onrender.com/api';
const HOP_BY_HOP_HEADERS = [
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
];

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getProxyTarget() {
  return (process.env.API_PROXY_TARGET || DEFAULT_PROXY_TARGET).replace(/\/+$/, '');
}

function filterHeaders(headers) {
  const nextHeaders = new Headers(headers);

  HOP_BY_HOP_HEADERS.forEach((header) => {
    nextHeaders.delete(header);
  });

  return nextHeaders;
}

async function proxyRequest(request, { params }) {
  const { path = [] } = await params;
  const proxyTarget = getProxyTarget();

  if (!proxyTarget) {
    return Response.json(
      { status: 'error', message: 'API proxy target is not configured.' },
      { status: 500 }
    );
  }

  const search = new URL(request.url).search;
  const pathname = path.join('/');
  const targetUrl = `${proxyTarget}/${pathname}${search}`;
  const method = request.method.toUpperCase();
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer();

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers: filterHeaders(request.headers),
      body,
      cache: 'no-store',
      redirect: 'manual',
    });

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: filterHeaders(upstreamResponse.headers),
    });
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        message: 'Failed to reach upstream API.',
        detail: error instanceof Error ? error.message : 'Unknown proxy error',
      },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
export const HEAD = proxyRequest;
