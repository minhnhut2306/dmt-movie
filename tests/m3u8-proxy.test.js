import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import handler from '../api/m3u8-proxy.js';
import { preparePlaybackSource } from '../src/utils/preparePlaybackSource.js';

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
const headers = { origin: 'https://dmt.test', host: 'dmt.test' };
function response() {
  return { headers: {}, setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; },
    send(body) { this.body = body; return this; },
    json(body) { this.body = body; return this; },
  };
}
function bundle() {
  const ads = Array.from({ length: 11 }, (_, i) => `#EXTINF:2.75,\n/v8/block/segment_${i}.ts`).join('\n');
  return { sourceUrl: 'https://example.test/root.m3u8', playlists: [
    { url: 'https://example.test/root.m3u8', text: '#EXTM3U\n#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="a",URI="audio.m3u8"\n#EXT-X-STREAM-INF:BANDWIDTH=1000,AUDIO="a"\nvideo.m3u8' },
    { url: 'https://example.test/video.m3u8', text: `#EXTM3U\n#EXT-X-KEY:METHOD=AES-128,URI="key.bin"\n#EXTINF:6.01,\nfilm1.ts\n#EXT-X-DISCONTINUITY\n#EXT-X-KEY:METHOD=NONE\n${ads}\n#EXT-X-DISCONTINUITY\n#EXT-X-KEY:METHOD=AES-128,URI="key.bin"\n#EXTINF:6.01,\nfilm2.ts\n#EXT-X-ENDLIST` },
    { url: 'https://example.test/audio.m3u8', text: '#EXTM3U\n#EXTINF:6,\naudio.aac\n#EXT-X-ENDLIST' },
  ] };
}
async function getPlaylist(url) {
  const result = response();
  await handler({ method: 'GET', query: Object.fromEntries(new URL(url, headers.origin).searchParams) }, result);
  return result;
}

test('browser bundle keeps master/audio on Vercel and removes the ad group', async () => {
  const result = response();
  await handler({ method: 'POST', headers, body: bundle() }, result);
  assert.equal(result.code, 200);
  assert.equal(result.body.droppedCount, 11);
  const master = await getPlaylist(result.body.url);
  assert.equal(master.code, 200);
  const variantUrl = master.body.split('\n').find(line => line.startsWith('/api/'));
  const media = await getPlaylist(variantUrl);
  assert.equal(media.code, 200);
  assert.equal(media.headers['X-Ad-Blocked-Count'], '11');
  assert.equal(media.headers['X-Ad-Filter-Mode'], 'browser-prepared');
  assert.ok(!media.body.includes('/v8/block/'));
  assert.ok(media.body.includes('https://example.test/film1.ts'));
  assert.ok(media.body.includes('https://example.test/film2.ts'));
  assert.ok(media.body.includes('URI="https://example.test/key.bin"'));
  const audioUrl = master.body.match(/URI="([^"]+)"/)[1];
  const audio = await getPlaylist(audioUrl);
  assert.equal(audio.code, 200);
  assert.ok(audio.body.includes('https://example.test/audio.aac'));
});

test('rejects bundles from a different origin and missing variants', async () => {
  const denied = response();
  await handler({ method: 'POST', headers: { ...headers, origin: 'https://other.test' }, body: bundle() }, denied);
  assert.equal(denied.code, 403);
  const incomplete = response();
  const body = bundle();
  body.playlists.pop();
  await handler({ method: 'POST', headers, body }, incomplete);
  assert.equal(incomplete.code, 502);
});

test('unknown prepared tokens fail rather than returning unfiltered video', async () => {
  const result = await getPlaylist('/api/m3u8-proxy?prepared=00000000-0000-0000-0000-000000000000');
  assert.equal(result.code, 410);
});

test('browser helper uploads all playlists and returns only the filtered URL', async () => {
  const body = bundle();
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (options.method === 'POST') {
      const uploaded = JSON.parse(options.body);
      assert.equal(uploaded.playlists.length, 3);
      return Response.json({ url: '/api/m3u8-proxy?prepared=test', droppedCount: 11 });
    }
    return new Response(body.playlists.find(entry => entry.url === url).text);
  };
  const result = await preparePlaybackSource(body.sourceUrl, '/api/m3u8-proxy?url=test', new AbortController().signal);
  assert.equal(result, '/api/m3u8-proxy?prepared=test');
  assert.equal(calls.length, 4);
});

test('failed browser and server filtering never returns the raw source', async () => {
  globalThis.fetch = async () => new Response('Not Found', { status: 404 });
  await assert.rejects(preparePlaybackSource('https://example.test/missing.m3u8', '/api/m3u8-proxy?url=test', new AbortController().signal), /Filtered playback unavailable/);
});

test('hanging source requests time out and try only the server filter', async () => {
  const signals = [];
  globalThis.fetch = (url, { signal }) => {
    signals.push(signal);
    if (url === '/filtered') return Promise.resolve(new Response('#EXTM3U\n#EXT-X-ENDLIST'));
    return new Promise(() => {});
  };
  const result = await preparePlaybackSource('https://example.test/video.m3u8', '/filtered',
    new AbortController().signal, { requestTimeoutMs: 20 });
  assert.equal(result, '/filtered');
  assert.equal(signals.length, 2);
  assert.equal(signals[0].aborted, true);
});

test('hanging response bodies and server requests cannot spin forever', async () => {
  const signals = [];
  globalThis.fetch = async (url, { signal }) => {
    signals.push(signal);
    return { ok: true, text: () => new Promise(() => {}) };
  };
  await assert.rejects(preparePlaybackSource('https://example.test/video.m3u8', '/filtered',
    new AbortController().signal, { requestTimeoutMs: 20 }), /Server playlist timed out/);
  assert.equal(signals.length, 2);
  assert.ok(signals.every(signal => signal.aborted));
});

test('cancelling preparation aborts the request without starting a fallback', async () => {
  const controller = new AbortController();
  let calls = 0;
  globalThis.fetch = (url, { signal }) => {
    calls++;
    controller.abort();
    assert.equal(signal.aborted, true);
    return new Promise(() => {});
  };
  await assert.rejects(preparePlaybackSource('https://example.test/video.m3u8', '/filtered',
    controller.signal), { name: 'AbortError' });
  assert.equal(calls, 1);
});
