// Cache m3u8 trong 30s để tránh fetch lại liên tục
const cache = new Map();
const CACHE_TTL = 30000; // 30 giây

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url');

  const decodedUrl = decodeURIComponent(url);

  // Check cache
  const cached = cache.get(decodedUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=30');
    return res.status(200).send(cached.data);
  }

  try {
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://player.phimapi.com/',
        'Origin': 'https://player.phimapi.com',
      },
    });

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

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=30');
      return res.status(200).send(rewritten);
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

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
}

function isAdSegment(path) {
  return /\/v\d+\//.test(path) ||
    path.includes('convertv7/') ||
    path.includes('convertv8/') ||
    /segment_\d+\.ts/.test(path);
}
