const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const origin = process.env.ORIGIN || 'http://127.0.0.1:3000';
  const routes = ['/admin/dashboard','/faculty/dashboard','/student/dashboard','/placement/dashboard'];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  for (const route of routes) {
    const res = { route, url: origin + route, consoleErrors: [], pageErrors: [], requestFailures: [], badResponses: [], navigationError: null, finalUrl: null };

    const onConsole = msg => { if (msg.type() === 'error') res.consoleErrors.push(msg.text()); };
    const onPageError = err => { res.pageErrors.push(err.stack || String(err)); };
    const onRequestFailed = req => { res.requestFailures.push({ url: req.url(), failure: (req.failure() && req.failure().errorText) || null }); };
    const onResponse = response => { try { const status = response.status(); if (status >= 400) res.badResponses.push({ url: response.url(), status }); } catch (e) {} };

    page.on('console', onConsole);
    page.on('pageerror', onPageError);
    page.on('requestfailed', onRequestFailed);
    page.on('response', onResponse);

    try {
      await page.goto(origin + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      res.finalUrl = page.url();
      res.bodyLength = (await page.content()).length;
    } catch (e) {
      res.navigationError = String(e);
    }

    page.off('console', onConsole);
    page.off('pageerror', onPageError);
    page.off('requestfailed', onRequestFailed);
    page.off('response', onResponse);

    results.push(res);
  }

  await browser.close();
  const out = { timestamp: new Date().toISOString(), results };
  fs.writeFileSync('backend/tools/playwright_route_report.json', JSON.stringify(out, null, 2));
  console.log('Wrote backend/tools/playwright_route_report.json');
})();
