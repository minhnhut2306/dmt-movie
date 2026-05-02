// Cache m3u8 trong 30s để tránh fetch lại liên tục
const cache = new Map();
const CACHE_TTL = 30000; // 30 giây

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return new Response('Missing url', { status: 400 });
  }

  const decodedUrl = decodeURIComponent(url);

  // Check cache
  const cached = cache.get(decodedUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new Response(cached.data, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=30',
      },
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout, dưới giới hạn Vercel 10s

    const response = await fetch(decodedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://player.phimapi.com/',
        'Origin': 'https://player.phimapi.com',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return new Response(`Upstream error: ${response.status} ${response.statusText}`, { status: 502 });
    }

    const text = await response.text();
    const baseUrl = decodedUrl.replace(/[^/]+$/, '');

    // Nếu là master playlist (chứa bandwidth) → rewrite sub-playlist URL
    if (text.includes('#EXT-X-STREAM-INF')) {
      const rewritten = text.split('\n').map(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const absUrl = trimmed.startsWith('http') ? trimmed : baseUrl + trimmed;
          return `/api/m3u8-proxy?url=${encodeURIComponent(absUrl)}`;
        }
        return line;
      }).join('\n');

      // Cache master playlist
      cache.set(decodedUrl, { data: rewritten, timestamp: Date.now() });

      return new Response(rewritten, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=30',
        },
      });
    }

    // Nếu là media playlist → lọc QC và rewrite segment URLs thành absolute
    const lines = text.split('\n');
    const filtered = [];
    let skipNextSegment = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === '#EXT-X-DISCONTINUITY') {
        // Peek segment tiếp theo
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

      if (line.endsWith('.ts')) {
        if (isAdSegment(line)) {
          skipNextSegment = false;
          continue;
        }
        // Rewrite thành absolute URL
        const absUrl = line.startsWith('http') ? line : baseUrl + line;
        filtered.push(absUrl);
        skipNextSegment = false;
        continue;
      }
      filtered.push(line);
    }
    const result = filtered.join('\n');

    // Cache media playlist
    cache.set(decodedUrl, { data: result, timestamp: Date.now() });

    return new Response(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=30',
      },
    });
  } catch (err) {
    return new Response('Proxy error: ' + err.message, { status: 500 });
  }
}

function isAdSegment(path) {
  return /\/v\d+\//.test(path) ||
    path.includes('convertv7/') ||
    path.includes('convertv8/') ||
    /segment_\d+\.ts/.test(path);
}
