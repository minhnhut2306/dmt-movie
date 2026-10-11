// Cache m3u8 trong 30s để tránh fetch lại liên tục
const cache = new Map();
const CACHE_TTL = 30000; // 30 giây

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'X-Ad-Blocked-Count, X-Ad-Blocked-Groups');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, debug } = req.query;
  
  if (!url) {
    return res.status(400).send('Missing url');
  }

  const decodedUrl = decodeURIComponent(url);

  // Check cache
  const cached = cache.get(decodedUrl);
  if (!debug && cached && Date.now() - cached.timestamp < CACHE_TTL) {
    if (cached.analysis) {
      logAdBlockResult(decodedUrl, cached.analysis, true);
      res.setHeader('X-Ad-Blocked-Count', cached.analysis.droppedCount.toString());
      res.setHeader('X-Ad-Blocked-Groups', cached.analysis.adGroups.length.toString());
    }
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
      console.error('[AD_BLOCK_ERROR]', JSON.stringify({ sourceUrl: decodedUrl, upstreamStatus: response.status }));
      return res.status(502).send(`Upstream error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    const baseUrl = decodedUrl.replace(/[^/]+$/, '');

    // Nếu là master playlist (chứa bandwidth) → rewrite sub-playlist URL
    if (text.includes('#EXT-X-STREAM-INF')) {
      const rewritten = text.split('\n').map(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const absUrl = toAbsoluteUrl(trimmed, baseUrl);
          return `/api/m3u8-proxy?url=${encodeURIComponent(absUrl)}`;
        }
        return line;
      }).join('\n');

      if (!debug) cache.set(decodedUrl, { data: rewritten, timestamp: Date.now() });

      if (debug) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).send(JSON.stringify({
          type: 'master',
          sourceUrl: decodedUrl,
          variants: text.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(line => toAbsoluteUrl(line, baseUrl)),
        }, null, 2));
      }

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Cache-Control', 'public, max-age=30');
      return res.status(200).send(rewritten);
    }

    // Nếu là media playlist → lọc QC và rewrite segment URLs thành absolute
    const analyzed = analyzeMediaPlaylist(text, baseUrl);
    const result = analyzed.result;
    logAdBlockResult(decodedUrl, analyzed.analysis);

    if (!debug) cache.set(decodedUrl, { data: result, analysis: analyzed.analysis, timestamp: Date.now() });

    if (debug) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(JSON.stringify({
        type: 'media',
        sourceUrl: decodedUrl,
        ...analyzed.analysis,
      }, null, 2));
    }

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.setHeader('X-Ad-Blocked-Count', analyzed.analysis.droppedCount.toString());
    res.setHeader('X-Ad-Blocked-Groups', analyzed.analysis.adGroups.length.toString());
    res.status(200).send(result);
  } catch (err) {
    console.error('[AD_BLOCK_ERROR]', JSON.stringify({ sourceUrl: decodedUrl, message: err.message }));
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

function getPathWithoutQuery(path) {
  return path.split('?')[0].split('#')[0];
}

function isMediaSegmentLine(path) {
  return /\.(ts|m4s|mp4|m4v|aac|vtt)$/i.test(getPathWithoutQuery(path));
}

// Pattern chung chung — nhiều nguồn phim thật cũng đặt tên segment kiểu này
// (vd /v2/segment_5.ts là url thật), nên chỉ cắt khi VỪA khớp tên VỪA nằm
// trong 1 khoảng có cấu trúc giống block QC thật (xem findRoundDurationRanges)
function isGenericAdUrl(path) {
  return /\/v\d+\//.test(path) || /segment_\d+\.(ts|m4s|mp4|m4v)$/i.test(getPathWithoutQuery(path));
}

function toAbsoluteUrl(url, baseUrl) {
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, baseUrl).toString();
}

function logAdBlockResult(sourceUrl, analysis, cacheHit = false) {
  console.log('[AD_BLOCK]', JSON.stringify({
    sourceUrl,
    status: analysis.droppedCount > 0 ? 'segments_removed' : 'no_matching_segments',
    cacheHit,
    segmentCount: analysis.segmentCount,
    droppedCount: analysis.droppedCount,
    adGroups: analysis.adGroups,
    droppedPreview: analysis.droppedPreview?.slice(0, 12),
  }));
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
function buildAdDropAnalysis(lines) {
  const segments = [];
  const groups = new Map();
  let pendingDuration = null;
  let accumulated = 0;
  let groupId = 0;

  groups.set(groupId, {
    id: groupId,
    startedByDiscontinuity: false,
    endedByDiscontinuity: false,
    keyNone: false,
    duration: 0,
    segments: [],
    genericCount: 0,
    specificCount: 0,
  });

  const currentGroup = () => groups.get(groupId);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === '#EXT-X-DISCONTINUITY') {
      currentGroup().endedByDiscontinuity = true;
      groupId++;
      groups.set(groupId, {
        id: groupId,
        startedByDiscontinuity: true,
        endedByDiscontinuity: false,
        keyNone: false,
        duration: 0,
        segments: [],
        genericCount: 0,
        specificCount: 0,
      });
      pendingDuration = null;
      continue;
    }
    if (line.startsWith('#EXT-X-KEY')) {
      if (/METHOD=NONE/i.test(line)) currentGroup().keyNone = true;
      continue;
    }
    if (line.startsWith('#EXTINF')) {
      const match = line.match(/^#EXTINF:([\d.]+)/);
      pendingDuration = match ? parseFloat(match[1]) : null;
      continue;
    }
    if (isMediaSegmentLine(line)) {
      const duration = pendingDuration ?? 0;
      const seg = { url: line, duration, start: accumulated, groupId };
      segments.push(seg);
      const group = currentGroup();
      group.duration += duration;
      group.segments.push(seg);
      if (isGenericAdUrl(line)) group.genericCount++;
      if (isSpecificAdUrl(line)) group.specificCount++;
      accumulated += duration;
      pendingDuration = null;
    }
  }

  const ranges = findRoundDurationRanges(segments);
  const adGroups = [...groups.values()].filter(group => (
    group.segments.length >= 2 &&
    group.duration >= 15 &&
    group.duration <= 120 &&
    group.genericCount / group.segments.length >= 0.8 &&
    group.startedByDiscontinuity &&
    (group.endedByDiscontinuity || group.keyNone)
  ));
  const adGroupIds = new Set(adGroups.map(group => group.id));
  const dropSet = new Set();
  for (const seg of segments) {
    if (isSpecificAdUrl(seg.url)) {
      dropSet.add(seg.url);
    } else if (isGenericAdUrl(seg.url) && ranges.some(r => seg.start >= r.start && seg.start < r.end)) {
      dropSet.add(seg.url);
    } else if (isGenericAdUrl(seg.url) && adGroupIds.has(seg.groupId)) {
      dropSet.add(seg.url);
    }
  }

  return {
    dropSet,
    segmentCount: segments.length,
    droppedCount: dropSet.size,
    ranges,
    adGroups: adGroups.map(group => ({
      id: group.id,
      duration: Number(group.duration.toFixed(2)),
      segments: group.segments.length,
      genericCount: group.genericCount,
      keyNone: group.keyNone,
      startedByDiscontinuity: group.startedByDiscontinuity,
      endedByDiscontinuity: group.endedByDiscontinuity,
      firstUrl: group.segments[0]?.url,
      lastUrl: group.segments[group.segments.length - 1]?.url,
    })),
    droppedPreview: segments
      .filter(seg => dropSet.has(seg.url))
      .slice(0, 30)
      .map(seg => ({
        start: Number(seg.start.toFixed(2)),
        duration: seg.duration,
        groupId: seg.groupId,
        url: seg.url,
      })),
  };
}

function analyzeMediaPlaylist(text, baseUrl) {
  const lines = text.split('\n');
  const analysis = buildAdDropAnalysis(lines);
  const { dropSet } = analysis;
  const filtered = [];
  let skipNextSegment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '#EXT-X-DISCONTINUITY') {
      const nextSeg = lines.slice(i + 1, i + 6).find(l => isMediaSegmentLine(l.trim()));
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

    if (isMediaSegmentLine(line)) {
      if (dropSet.has(line)) {
        skipNextSegment = false;
        continue;
      }
      filtered.push(toAbsoluteUrl(line, baseUrl));
      skipNextSegment = false;
      continue;
    }
    filtered.push(line);
  }

  return { result: filtered.join('\n'), analysis };
}
