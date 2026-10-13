import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const { chromium, devices } = createRequire(import.meta.url)(
  process.env.DMT_PLAYWRIGHT_MODULE || 'playwright'
);

const deployment = process.argv[2];
const slug = process.argv[3] || 'ao-ashi-tan-binh-san-co-phan-2';
const expectedDropped = Number(process.argv[4] || 17);
if (!deployment) throw new Error('Pass the Vercel preview URL');
const project = JSON.parse(readFileSync('.vercel/project.json', 'utf8'));
const cli = path.join(process.env.APPDATA, 'npm/node_modules/vercel/dist/vc.js');
const details = JSON.parse(
  execFileSync(
    process.execPath,
    [cli, 'api', `/v9/projects/${project.projectId}?teamId=${project.orgId}`, '--raw'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
  )
);
const bypass = Object.entries(details.protectionBypass || {}).find(
  ([, entry]) => entry.scope === 'automation-bypass'
)?.[0];
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
try {
  const context = await browser.newContext({
    ...(process.env.DMT_MOBILE ? devices['Pixel 7'] : { viewport: { width: 1366, height: 900 } }),
    serviceWorkers: process.env.DMT_SERVICE_WORKERS ? 'allow' : 'block',
  });
  if (bypass) {
    await context.route('**/*', (route) => {
      const request = route.request();
      if (new URL(request.url()).host === new URL(deployment).host) {
        return route.continue({ headers: { ...request.headers(), 'x-vercel-protection-bypass': bypass } });
      }
      return route.continue();
    });
  }
  const stall = process.env.DMT_STALL;
  if (stall) {
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      const stalled =
        stall === 'playlist'
          ? url.pathname.endsWith('.m3u8') || url.pathname === '/api/m3u8-proxy'
          : url.pathname.endsWith('.ts');
      if (stalled) return new Promise(() => {});
      return route.fallback();
    });
  }
  const page = await context.newPage();
  const blockedRequests = [];
  const errors = [];
  let preparation;
  let media;
  page.on('request', (request) => {
    if (/convertv[78]\/|\/v8\/.*segment_/.test(request.url())) blockedRequests.push(request.url());
  });
  page.on('console', (message) => {
    if (message.type() === 'error' && message.text().includes('[AD_BLOCK]')) errors.push(message.text());
  });
  page.on('pageerror', (err) => console.log('PAGE_ERROR', err.message));
  page.on('requestfailed', (request) => {
    if (/m3u8|\.ts/.test(request.url()))
      console.log('REQUEST_FAILED', request.url(), request.failure()?.errorText);
  });
  page.on('response', async (response) => {
    const url = new URL(response.url());
    if (url.host !== new URL(deployment).host || url.pathname !== '/api/m3u8-proxy') return;
    if (response.request().method() === 'POST') {
      preparation = { status: response.status(), body: await response.json().catch(() => null) };
      console.log('PREPARATION', preparation.status, preparation.body?.droppedCount);
    } else if (response.headers()['x-ad-filter-mode'] === 'browser-prepared') {
      const text = await response.text();
      if (text.includes('#EXTINF')) media = { text, headers: response.headers() };
    }
  });
  await page.goto(`${deployment}/movie/${slug}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.getByRole('button', { name: 'Xem Phim', exact: true }).click({ timeout: 30000 });
  if (stall) {
    await page.getByText('Không thể phát video', { exact: true }).waitFor({ timeout: 60000 });
    assert.equal(await page.getByRole('button', { name: 'Thử lại', exact: true }).count(), 1);
    assert.equal(blockedRequests.length, 0);
    console.log(JSON.stringify({ stalled: stall, retryAvailable: true, errors }, null, 2));
    await page.screenshot({ path: path.join(process.env.TEMP, `dmt-player-${stall}.png`) });
    await context.close();
    process.exitCode = 0;
  } else {
    await page.waitForFunction(
      () => {
        const video = document.querySelector('video');
        return video && video.currentTime > 3 && video.readyState >= 2;
      },
      null,
      { timeout: 60000 }
    );
    assert.equal(preparation?.status, 200, JSON.stringify({ preparation, errors }));
    assert.equal(preparation.body.droppedCount, expectedDropped);
    assert.equal(media?.headers['x-ad-blocked-count'], String(expectedDropped));
    assert.ok(!/convertv[78]\/|\/v8\/.*segment_/.test(media.text));
    if (process.env.DMT_FULLSCREEN) {
      const video = await page.locator('video').elementHandle();
      const source = await video.evaluate(node => node.src);
      assert.equal(await video.evaluate(node => node.controls), true);
      assert.equal(await page.getByRole('button', { name: /^(Toàn màn hình|Thoát toàn màn hình)$/ }).count(), 0);
      await video.evaluate(node => node.requestFullscreen());
      await page.waitForFunction(() => document.fullscreenElement?.tagName === 'VIDEO');
      await page.setViewportSize({ width: 915, height: 412 });
      assert.equal(await video.evaluate(node => node.isConnected), true);
      assert.equal(await video.evaluate(node => node.src), source);
      await page.screenshot({ path: path.join(process.env.TEMP, 'dmt-real-video-fullscreen.png') });
      await page.evaluate(() => document.exitFullscreen());
      await page.waitForFunction(() => !document.fullscreenElement);
      await page.setViewportSize({ width: 412, height: 915 });
      assert.equal(await video.evaluate(node => node.isConnected), true);
      console.log('FULLSCREEN stable video and source');
    }
    await page.evaluate(() => {
      const video = document.querySelector('video');
      video.currentTime = 880;
      return video.play();
    });
    await page.waitForFunction(() => document.querySelector('video')?.currentTime > 883, null, {
      timeout: 45000,
    });
    assert.equal(blockedRequests.length, 0);
    console.log(
      JSON.stringify(
        {
          preparationStatus: preparation.status,
          removedSegments: preparation.body.droppedCount,
          mediaStatus: 'filtered',
          adSegmentRequests: blockedRequests.length,
          playback: await page.evaluate(() => {
            const v = document.querySelector('video');
            return { time: v.currentTime, duration: v.duration, readyState: v.readyState };
          }),
          errors,
        },
        null,
        2
      )
    );
  }
} finally {
  await browser.close();
}
