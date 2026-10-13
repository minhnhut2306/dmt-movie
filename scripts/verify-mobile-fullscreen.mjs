import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';

const { chromium, devices } = createRequire(import.meta.url)(process.env.DMT_PLAYWRIGHT_MODULE || 'playwright');
const base = process.argv[2] || 'http://127.0.0.1:4183';
const fixture = {
  status: true,
  movie: { _id: 'fullscreen-test', name: 'Fullscreen Test', slug: 'fullscreen-test',
    origin_name: 'Fullscreen Test', type: 'single', content: '', year: 2026,
    quality: 'FHD', lang: 'Vietsub', actor: [], director: [], category: [], country: [] },
  episodes: [{ server_name: 'Vietsub', server_data: [{ name: 'Full',
    link_m3u8: 'https://media.example.test/index.m3u8', link_embed: 'https://embed.example.test/player' }] }],
};
const playlist = '#EXTM3U\n#EXT-X-TARGETDURATION:6\n#EXTINF:6,\nhttps://media.example.test/segment.ts\n#EXT-X-ENDLIST';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  for (const mode of ['mobile', 'desktop', 'fallback', 'native-ios']) {
    const context = await browser.newContext({
      ...(mode === 'desktop' ? { viewport: { width: 1366, height: 900 } } : devices['Pixel 7']),
      serviceWorkers: 'block',
    });
    await context.addInitScript(mode => {
      window.orientationCalls = [];
      Object.defineProperty(screen.orientation, 'lock', { configurable: true, value: async value => window.orientationCalls.push(value) });
      Object.defineProperty(screen.orientation, 'unlock', { configurable: true, value: () => window.orientationCalls.push('unlock') });
      if (mode === 'fallback' || mode === 'native-ios') {
        Object.defineProperty(Element.prototype, 'requestFullscreen', { configurable: true, value: undefined });
        Object.defineProperty(Element.prototype, 'webkitRequestFullscreen', { configurable: true, value: undefined });
      }
      if (mode === 'native-ios') {
        HTMLVideoElement.prototype.webkitEnterFullscreen = function () {
          this.webkitDisplayingFullscreen = true;
          this.dispatchEvent(new Event('webkitbeginfullscreen'));
        };
        HTMLVideoElement.prototype.webkitExitFullscreen = function () {
          this.webkitDisplayingFullscreen = false;
          this.dispatchEvent(new Event('webkitendfullscreen'));
        };
      }
    }, mode);
    await context.route('https://phimapi.com/**', route => route.fulfill({ json:
      new URL(route.request().url()).pathname === '/phim/fullscreen-test' ? fixture : { status: true, data: { items: [] } } }));
    let preparations = 0;
    await context.route('**/api/m3u8-proxy**', route => {
      if (route.request().method() === 'POST') {
        preparations++;
        return route.fulfill({ json: { url: '/api/m3u8-proxy?prepared=fixture', droppedCount: 0 } });
      }
      return route.fulfill({ body: playlist, contentType: 'application/vnd.apple.mpegurl' });
    });
    await context.route('https://media.example.test/**', route => {
      if (route.request().url().endsWith('.ts')) return new Promise(() => {});
      return route.fulfill({ body: playlist, contentType: 'application/vnd.apple.mpegurl', headers: { 'Access-Control-Allow-Origin': '*' } });
    });
    let embedLoads = 0;
    await context.route('https://embed.example.test/**', route => {
      embedLoads++;
      return route.fulfill({ contentType: 'text/html', body: '<html><body style="margin:0;background:#187657;color:white"><button onclick="document.documentElement.requestFullscreen()">Child fullscreen</button><p>Server 2 fixture</p></body></html>' });
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto(`${base}/movie/fullscreen-test`);
    await page.getByRole('button', { name: 'Xem Phim', exact: true }).click();
    await page.locator('video').waitFor();
    assert.equal(await page.locator('video').evaluate(node => node.controls), true);
    assert.equal(await page.getByRole('button', { name: /^(Toàn màn hình|Thoát toàn màn hình)$/ }).count(), 0);
    // Switch to Server 2 and verify no implicit return to the HLS player.
    await page.getByRole('button', { name: 'Server 2', exact: true }).click();
    const iframe = await page.locator('iframe[title="Video Server 2"]').elementHandle();
    await page.frameLocator('iframe[title="Video Server 2"]').getByText('Server 2 fixture').waitFor();
    assert.equal(await iframe.evaluate(node => node.allowFullscreen), true);
    const beforeEmbed = preparations;
    const supportsElementFullscreen = mode === 'mobile' || mode === 'desktop';
    // Let the embedded player's own control enter fullscreen.
    if (supportsElementFullscreen) {
      await page.frameLocator('iframe[title="Video Server 2"]').getByRole('button', { name: 'Child fullscreen' }).click();
      await page.waitForFunction(() => document.fullscreenElement?.tagName === 'IFRAME');
    }
    const landscape = mode === 'desktop' ? { width: 600, height: 900 } : { width: 915, height: 412 };
    await page.setViewportSize(landscape);
    assert.equal(await iframe.evaluate(node => node.isConnected), true, `${mode}: iframe remounted`);
    assert.equal(embedLoads, 1, `${mode}: iframe reloaded`);
    assert.equal(preparations, beforeEmbed, `${mode}: switched to Server 1`);
    if (supportsElementFullscreen) {
      const bounds = await iframe.boundingBox();
      const viewport = await page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
      assert.ok(Math.abs(bounds.width - viewport.width) < 2 && Math.abs(bounds.height - viewport.height) < 2);
      assert.equal(await page.evaluate(() => !!document.elementFromPoint(10, 10)?.closest('.video-player-shell')), true);
    }
    await page.screenshot({ path: path.join(process.env.TEMP, `dmt-fullscreen-${mode}.png`) });
    if (supportsElementFullscreen) {
      await page.evaluate(() => document.exitFullscreen());
      await page.waitForFunction(() => !document.fullscreenElement);
    }
    assert.equal(await iframe.evaluate(node => node.isConnected), true);
    await page.getByRole('button', { name: 'Server 1', exact: true }).click();
    const video = await page.locator('video').elementHandle();
    await page.waitForFunction(() => document.querySelector('video')?.src.startsWith('blob:'));
    const source = await video.evaluate(node => node.src);
    const beforeVideo = preparations;
    if (supportsElementFullscreen) {
      await video.evaluate(node => node.requestFullscreen());
      await page.waitForFunction(() => document.fullscreenElement?.tagName === 'VIDEO');
    } else if (mode === 'native-ios') {
      await video.evaluate(node => node.webkitEnterFullscreen());
      await page.waitForFunction(() => document.querySelector('video')?.webkitDisplayingFullscreen);
    }
    // Browsers without a fullscreen API still keep their native video controls
    // and the same mounted player when the viewport crosses the layout breakpoint.
    await page.setViewportSize({ width: 412, height: 915 });
    assert.equal(await video.evaluate(node => node.isConnected), true, `${mode}: video remounted`);
    assert.equal(await video.evaluate(node => node.src), source, `${mode}: video source changed`);
    assert.equal(preparations, beforeVideo, `${mode}: playback restarted`);
    if (supportsElementFullscreen) {
      await page.evaluate(() => document.exitFullscreen());
      await page.waitForFunction(() => !document.fullscreenElement);
    } else if (mode === 'native-ios') {
      await video.evaluate(node => node.webkitExitFullscreen());
      await page.waitForFunction(() => !document.querySelector('video')?.webkitDisplayingFullscreen);
    }
    assert.equal(await video.evaluate(node => node.isConnected), true);
    assert.equal(await video.evaluate(node => node.controls), true);
    assert.equal(await page.getByRole('button', { name: /^(Toàn màn hình|Thoát toàn màn hình)$/ }).count(), 0);
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await page.getByRole('button', { name: 'Server 2', exact: true }).click();
    await page.locator('iframe[title="Video Server 2"]').waitFor();
    await page.frameLocator('iframe[title="Video Server 2"]').getByText('Server 2 fixture').waitFor();
    const beforeRetry = preparations;
    await page.getByRole('button', { name: 'Tải lại video', exact: true }).click();
    await page.locator('iframe[title="Video Server 2"]').waitFor();
    await page.frameLocator('iframe[title="Video Server 2"]').getByText('Server 2 fixture').waitFor();
    assert.equal(await page.locator('video').count(), 0, `${mode}: retry changed server`);
    assert.equal(preparations, beforeRetry);
    if (mode === 'mobile') assert.ok((await page.evaluate(() => window.orientationCalls)).includes('landscape'));
    assert.deepEqual(pageErrors, []);
    console.log(JSON.stringify({ mode, stableIframe: true, stableVideo: true, embedLoads, preparations, pageErrors }));
    await context.close();
  }
} finally {
  await browser.close();
}
