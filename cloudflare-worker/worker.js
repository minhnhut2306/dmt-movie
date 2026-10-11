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

function getPathWithoutQuery(path) {
  return path.split('?')[0].split('#')[0];
}

function isMediaSegmentLine(path) {
  return /\.(ts|m4s|mp4|m4v|aac|vtt)$/i.test(getPathWithoutQuery(path));
}

function isRoundDuration(d) {
  return Number.isInteger(d) || Math.abs(d - Math.round(d)) < 0.05;
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

// Pattern chung chung — nhiều nguồn phim thật cũng đặt tên segment kiểu này,
// nên chỉ cắt khi nằm trong một cụm có cấu trúc giống block QC thật.
function isGenericAdUrl(path) {
  return /\/v\d+\//.test(path) || /segment_\d+\.(ts|m4s|mp4|m4v)$/i.test(getPathWithoutQuery(path));
}

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

function toAbsoluteUrl(url, baseUrl) {
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, baseUrl).toString();
}

function logAdBlockResult(sourceUrl, analysis) {
  if (!analysis?.droppedCount) return;

  console.log('[AD_BLOCK]', JSON.stringify({
    sourceUrl,
    segmentCount: analysis.segmentCount,
    droppedCount: analysis.droppedCount,
    adGroups: analysis.adGroups,
    droppedPreview: analysis.droppedPreview?.slice(0, 12),
  }));
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

function filterMediaPlaylist(text, baseUrl) {
  return analyzeMediaPlaylist(text, baseUrl).result;
}

function rewriteMasterPlaylist(text, baseUrl, workerUrl) {
  return text.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const absUrl = toAbsoluteUrl(trimmed, baseUrl);
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
    const debug = url.searchParams.get('debug') === '1';

    trackRequest(ctx, url.pathname);

    const decodedUrl = decodeURIComponent(targetUrl);
    const baseUrl = decodedUrl.replace(/[^/]+$/, '');
    const workerUrl = `${url.origin}${url.pathname}`;

    const cache = caches.default;
    const cacheKey = new Request(request.url);
    const cachedResponse = debug ? null : await cache.match(cacheKey);
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
      let debugPayload = null;

      if (text.includes('#EXT-X-STREAM-INF')) {
        result = rewriteMasterPlaylist(text, baseUrl, workerUrl);
        debugPayload = {
          type: 'master',
          sourceUrl: decodedUrl,
          variants: text.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(line => toAbsoluteUrl(line, baseUrl)),
        };
      } else {
        const analyzed = analyzeMediaPlaylist(text, baseUrl);
        result = analyzed.result;
        logAdBlockResult(decodedUrl, analyzed.analysis);
        debugPayload = {
          type: 'media',
          sourceUrl: decodedUrl,
          ...analyzed.analysis,
        };
      }

      if (debug) {
        return new Response(JSON.stringify(debugPayload, null, 2), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store',
          },
        });
      }

      const finalResponse = new Response(result, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': `public, max-age=${CACHE_TTL}`,
          'X-Ad-Blocked-Count': debugPayload?.droppedCount?.toString() || '0',
          'X-Ad-Blocked-Groups': debugPayload?.adGroups?.length?.toString() || '0',
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
