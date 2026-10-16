import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const shots = path.resolve('docs/evidence/option-02');
fs.mkdirSync(shots, { recursive: true });

test('desktop preserves the approved search intent, page coverage and local assets', async ({ page }) => {
  const errors: string[] = [];
  const thirdPartyRequests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1:4322') && !request.url().startsWith('data:')) thirdPartyRequests.push(request.url());
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle('AC Installation Tampa Florida | (813) 815-1234 | Air Turbulencia');
  await expect(page.locator('h1')).toHaveText('AC installation in Tampa.Comfort you can feel.');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.airturbulencia.com/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  expect(await page.locator('h1').evaluate(el => getComputedStyle(el).fontFamily)).toContain('Archivo Black');
  const inventory = JSON.parse(fs.readFileSync('docs/evidence/site-inventory.json', 'utf8'));
  const linked = await page.locator('a[href]').evaluateAll(links => links.map(link => (link as HTMLAnchorElement).href));
  for (const item of inventory.pages.filter((item: { status?: number }) => item.status === 200)) {
    if (item.url === 'https://www.airturbulencia.com/') continue;
    expect(linked).toContain(item.url);
  }
  const images = await page.locator('img').evaluateAll(images => images.map(image => ({ width: image.getAttribute('width'), height: image.getAttribute('height') })));
  expect(images.every(image => image.width && image.height)).toBe(true);
  await page.evaluate(async () => {
    for (const img of document.images) {
      img.loading = 'eager';
      await img.decode();
    }
  });
  await page.screenshot({ path: path.join(shots, 'desktop.png'), fullPage: true });
  await page.locator('.air-hero').screenshot({ path: path.join(shots, 'hero-desktop.png') });
  expect(thirdPartyRequests).toEqual([]);
  expect(errors).toEqual([]);
  const bundleScripts = await page.locator('script[src]').count();
  expect(bundleScripts).toBeLessThanOrEqual(2);
});

test('keyboard can open services, follow its links and dismiss the menu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const menu = page.locator('.services-menu summary');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.services-dropdown')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('.services-dropdown a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.services-menu')).not.toHaveAttribute('open');
  await expect(menu).toBeFocused();
});

test('fluid fallback has no horizontal overflow and navigation remains usable', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) {
      const toggle = page.locator('.menu-toggle');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await page.evaluate(async () => { for (const img of document.images) { img.loading = 'eager'; await img.decode(); } });
      await page.screenshot({ path: path.join(shots, 'mobile-fallback.png'), fullPage: true });
    }
  }
});

test('homepage has no automatically detected WCAG A/AA violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  fs.writeFileSync(path.join(shots, 'axe.json'), JSON.stringify({ violations: results.violations, incomplete: results.incomplete }, null, 2));
  expect(results.violations).toEqual([]);
});
