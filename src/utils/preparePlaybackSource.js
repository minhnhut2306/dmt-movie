export async function preparePlaybackSource(
  sourceUrl,
  proxyUrl,
  signal,
  { requestTimeoutMs = 12000, preparationTimeoutMs = 30000 } = {}
) {
  try {
    return await withTimeout(
      (preparationSignal) => prepareBrowserPlaylists(sourceUrl, preparationSignal, requestTimeoutMs),
      signal,
      preparationTimeoutMs,
      'Playlist preparation'
    );
  } catch (err) {
    if (signal.aborted) throw err;
    console.warn('[AD_BLOCK] Browser preparation failed; trying server filter', err.message);
    return withTimeout(
      async (requestSignal) => {
        const response = await fetch(proxyUrl, { signal: requestSignal });
        if (!response.ok || !(await response.text()).trimStart().startsWith('#EXTM3U')) {
          throw new Error('Filtered playback unavailable');
        }
        return proxyUrl;
      },
      signal,
      requestTimeoutMs,
      'Server playlist'
    );
  }
}

async function prepareBrowserPlaylists(sourceUrl, preparationSignal, requestTimeoutMs) {
  const playlists = new Map();
  let bytes = 0;
  const visit = async (url) => {
    if (playlists.has(url)) return;
    if (playlists.size >= 16) throw new Error('Too many playlists');
    playlists.set(url, null);
    const { text, baseUrl } = await withTimeout(
      async (requestSignal) => {
        const response = await fetch(url, { signal: requestSignal });
        if (!response.ok) throw new Error(`Source playlist failed: ${response.status}`);
        return { text: await response.text(), baseUrl: response.url || url };
      },
      preparationSignal,
      requestTimeoutMs,
      'Source playlist'
    );
    if (!text.trimStart().startsWith('#EXTM3U')) throw new Error('Invalid source playlist');
    bytes += new TextEncoder().encode(text).length;
    if (bytes > 700000) throw new Error('Playlist bundle too large');
    playlists.set(url, { url, baseUrl, text });
    if (text.includes('#EXT-X-STREAM-INF')) {
      const children = text.split('\n').flatMap((raw) => {
        const line = raw.trim();
        if (line && !line.startsWith('#')) return [new URL(line, baseUrl).toString()];
        if (line.startsWith('#EXT-X-MEDIA:')) {
          const uri = line.match(/URI="([^"]+)"/)?.[1];
          return uri ? [new URL(uri, baseUrl).toString()] : [];
        }
        return [];
      });
      for (const child of children) await visit(child);
    } else if (!text.includes('#EXT-X-ENDLIST')) {
      throw new Error('Browser preparation requires VOD');
    }
  };
  await visit(sourceUrl);
  const result = await withTimeout(
    async (requestSignal) => {
      const response = await fetch('/api/m3u8-proxy', {
        method: 'POST',
        signal: requestSignal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceUrl, playlists: [...playlists.values()] }),
      });
      if (!response.ok) throw new Error(`Playlist filtering failed: ${response.status}`);
      return response.json();
    },
    preparationSignal,
    requestTimeoutMs,
    'Playlist filtering'
  );
  if (!result.url?.startsWith('/api/m3u8-proxy?prepared=')) throw new Error('Invalid filtered playlist URL');
  console.info('[AD_BLOCK] Vercel prepared filtered playlists', { droppedCount: result.droppedCount });
  return result.url;
}

function withTimeout(operation, signal, timeoutMs, label) {
  if (signal.aborted) return Promise.reject(new DOMException('Playback cancelled', 'AbortError'));
  const controller = new AbortController();
  let timeout;
  let onAbort;
  const deadline = new Promise((_, reject) => {
    onAbort = () => {
      controller.abort();
      reject(new DOMException('Playback cancelled', 'AbortError'));
    };
    signal.addEventListener('abort', onAbort, { once: true });
    timeout = setTimeout(() => {
      controller.abort();
      reject(new Error(`${label} timed out`));
    }, timeoutMs);
  });
  return Promise.race([Promise.resolve().then(() => operation(controller.signal)), deadline]).finally(() => {
    clearTimeout(timeout);
    signal.removeEventListener('abort', onAbort);
  });
}
