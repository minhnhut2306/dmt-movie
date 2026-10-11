export async function preparePlaybackSource(sourceUrl, proxyUrl, signal) {
  try {
    const playlists = new Map();
    let bytes = 0;
    const visit = async url => {
      if (playlists.has(url)) return;
      if (playlists.size >= 16) throw new Error('Too many playlists');
      playlists.set(url, null);
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error(`Source playlist failed: ${response.status}`);
      const text = await response.text();
      if (!text.trimStart().startsWith('#EXTM3U')) throw new Error('Invalid source playlist');
      bytes += new TextEncoder().encode(text).length;
      if (bytes > 700000) throw new Error('Playlist bundle too large');
      const baseUrl = response.url || url;
      playlists.set(url, { url, baseUrl, text });
      if (text.includes('#EXT-X-STREAM-INF')) {
        const children = text.split('\n').flatMap(raw => {
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
    const response = await fetch('/api/m3u8-proxy', {
      method: 'POST', signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceUrl, playlists: [...playlists.values()] }),
    });
    if (!response.ok) throw new Error(`Playlist filtering failed: ${response.status}`);
    const result = await response.json();
    if (!result.url?.startsWith('/api/m3u8-proxy?prepared=')) throw new Error('Invalid filtered playlist URL');
    console.info('[AD_BLOCK] Vercel prepared filtered playlists', { droppedCount: result.droppedCount });
    return result.url;
  } catch (err) {
    if (signal.aborted) throw err;
    console.warn('[AD_BLOCK] Browser preparation failed; trying server filter', err.message);
    const response = await fetch(proxyUrl, { signal });
    if (!response.ok || !(await response.text()).trimStart().startsWith('#EXTM3U')) {
      throw new Error('Filtered playback unavailable');
    }
    return proxyUrl;
  }
}
