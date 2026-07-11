// Cache m3u8 trong 30s để tránh fetch lại liên tục
const cache = new Map();
const CACHE_TTL = 30000; // 30 giây

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send('Missing url');
  }

  const decodedUrl = decodeURIComponent(url);

  // Check cache
  const cached = cache.get(decodedUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'public, max-age=30');
    return res.status(200).send(cached.data);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

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
      return res.status(502).send(`Upstream error: ${response.status} ${response.statusText}`);
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

      cache.set(decodedUrl, { data: rewritten, timestamp: Date.now() });

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Cache-Control', 'public, max-age=30');
      return res.status(200).send(rewritten);
    }

    // Nếu là media playlist → lọc QC và rewrite segment URLs thành absolute
    const lines = text.split('\n');
    const dropSet = buildAdDropSet(lines);
    const filtered = [];
    let skipNextSegment = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === '#EXT-X-DISCONTINUITY') {
        const nextSeg = lines.slice(i + 1, i + 6).find(l => l.trim().endsWith('.ts'));
        if (nextSeg && dropSet.has(nextSeg.trim())) {
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
        if (nextLine && dropSet.has(nextLine)) {
          skipNextSegment = true;
          continue;
        }
        filtered.push(line);
        continue;
      }

      if (line.endsWith('.ts')) {
        if (dropSet.has(line)) {
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
    const result = filtered.join('\n');

    cache.set(decodedUrl, { data: result, timestamp: Date.now() });

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
}

// Dấu hiệu server QC rõ ràng — luôn cắt, không cần xác nhận thêm
function isSpecificAdUrl(path) {
  return path.includes('/adjump/') ||
    path.includes('convertv7/') ||
    path.includes('convertv8/') ||
    path.includes('/ads/') ||
    path.includes('/ad/') ||
    /\/commercial\//.test(path);
}

// Pattern chung chung — nhiều nguồn phim thật cũng đặt tên segment kiểu này
// (vd /v2/segment_5.ts là url thật), nên chỉ cắt khi VỪA khớp tên VỪA nằm
// trong 1 khoảng có cấu trúc giống block QC thật (xem findRoundDurationRanges)
function isGenericAdUrl(path) {
  return /\/v\d+\//.test(path) || /segment_\d+\.ts/.test(path);
}

function isRoundDuration(d) {
  return Number.isInteger(d) || Math.abs(d - Math.round(d)) < 0.05;
}

// Tìm các khoảng [start, end] trên timeline mà 1 chuỗi ≥6 segment liên tiếp
// có thời lượng tròn số, tổng 15-120s — đặc trưng của 1 block QC được chèn,
// khác với các segment phim gốc thường có thời lượng lẻ
function findRoundDurationRanges(segments) {
  const ranges = [];
  let accumulated = 0;
  let roundStart = null;
  let roundCount = 0;

  const flush = (endAccumulated) => {
    if (roundCount >= 6) {
      const duration = endAccumulated - roundStart;
      if (duration >= 15 && duration <= 120) {
        ranges.push({ start: roundStart, end: endAccumulated });
      }
    }
    roundStart = null;
    roundCount = 0;
  };

  for (const seg of segments) {
    if (isRoundDuration(seg.duration)) {
      if (roundStart === null) roundStart = accumulated;
      roundCount++;
    } else {
      flush(accumulated);
    }
    accumulated += seg.duration;
  }
  flush(accumulated);

  return ranges;
}

// Duyệt toàn bộ playlist 1 lượt để biết segment nào thực sự nên bị cắt,
// trước khi ghép lại output ở vòng lặp chính bên dưới
function buildAdDropSet(lines) {
  const segments = [];
  let pendingDuration = null;
  let accumulated = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('#EXTINF')) {
      const match = line.match(/^#EXTINF:([\d.]+)/);
      pendingDuration = match ? parseFloat(match[1]) : null;
      continue;
    }
    if (line.endsWith('.ts')) {
      const duration = pendingDuration ?? 0;
      segments.push({ url: line, duration, start: accumulated });
      accumulated += duration;
      pendingDuration = null;
    }
  }

  const ranges = findRoundDurationRanges(segments);
  const dropSet = new Set();
  for (const seg of segments) {
    if (isSpecificAdUrl(seg.url)) {
      dropSet.add(seg.url);
    } else if (isGenericAdUrl(seg.url) && ranges.some(r => seg.start >= r.start && seg.start < r.end)) {
      dropSet.add(seg.url);
    }
  }
  return dropSet;
}
