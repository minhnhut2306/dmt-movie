/**
 * Cloudflare Worker - M3U8 Proxy với lọc quảng cáo
 */

const CACHE_TTL = 30;
const TRACKER_URL = 'https://nm-insights.nhutnm2306.workers.dev/ping';

function trackRequest(ctx, path) {
  // Skip tracking trong dev environment để tránh CORS error
  if (path.includes('localhost')) return;
  
  ctx.waitUntil(
    fetch(TRACKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site: 'dmt-movie-proxy', path }),
    }).catch(() => {})
  );
}

function isAdSegment(path) {
  return (
    path.includes('/adjump/') ||
    path.includes('convertv7/') ||
    path.includes('convertv8/') ||
    /\/v\d+\//.test(path) ||
    /segment_\d+\.ts/.test(path)
  );
}

function filterMediaPlaylist(text, baseUrl) {
  const lines = text.split('\n');
  const filtered = [];
  let skipNextSegment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '#EXT-X-DISCONTINUITY') {
      const nextSeg = lines.slice(i + 1, i + 6).find(l => l.trim().endsWith('.ts'));
      if (nextSeg && isAdSegment(nextSeg.trim())) {
        skipNextSegment = true;
        continue;
      }
      if (skipNextSegment) {
        skipNextSegment = false;
        continue;
      }
      filtered.push(line);
      continue;
    }

    if (line.startsWith('#EXT-X-KEY') && skipNextSegment) continue;

    if (line.startsWith('#EXTINF')) {
      const nextLine = lines[i + 1]?.trim();
      if (nextLine && isAdSegment(nextLine)) {
        skipNextSegment = true;
        continue;
      }
      filtered.push(line);
      continue;
    }

    if (line.endsWith('.ts') || line.endsWith('.t') || line.endsWith('.m4s') || line.endsWith('.mp4')) {
      if (isAdSegment(line)) {
        skipNextSegment = false;
        continue;
      }
      const absUrl = line.startsWith('http') ? line : baseUrl + line;
      filtered.push(absUrl);
      skipNextSegment = false;
      continue;
    }

    filtered.push(line);
  }

  return filtered.join('\n');
}

function rewriteMasterPlaylist(text, baseUrl, workerUrl) {
  return text.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const absUrl = trimmed.startsWith('http') ? trimmed : baseUrl + trimmed;
      return `${workerUrl}?url=${encodeURIComponent(absUrl)}`;
    }
    return line;
  }).join('\n');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }

    trackRequest(ctx, url.pathname);

    const decodedUrl = decodeURIComponent(targetUrl);
    const baseUrl = decodedUrl.replace(/[^/]+$/, '');
    const workerUrl = `${url.origin}${url.pathname}`;

    const cache = caches.default;
    const cacheKey = new Request(request.url);
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      // Đảm bảo cached response luôn có CORS header
      const newHeaders = new Headers(cachedResponse.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        headers: newHeaders,
      });
    }

    try {
      const targetOrigin = new URL(decodedUrl).origin;
      const response = await fetch(decodedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': targetOrigin + '/',
          'Origin': targetOrigin,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
        },
      });

      if (!response.ok) {
        return new Response(`Upstream error: ${response.status} ${response.statusText} | url: ${decodedUrl}`, {
          status: 502,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
      }

      const text = await response.text();
      let result;

      if (text.includes('#EXT-X-STREAM-INF')) {
        result = rewriteMasterPlaylist(text, baseUrl, workerUrl);
      } else {
        result = filterMediaPlaylist(text, baseUrl);
      }

      const finalResponse = new Response(result, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': `public, max-age=${CACHE_TTL}`,
        },
      });

      ctx.waitUntil(cache.put(cacheKey, finalResponse.clone()));

      return finalResponse;
    } catch (err) {
      return new Response(`Proxy error: ${err.message}`, {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};
