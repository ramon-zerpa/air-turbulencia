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
    if (!request.url().startsWith('http://127.0.0.1:4321') && !request.url().startsWith('data:')) thirdPartyRequests.push(request.url());
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle('AC Installation Tampa Florida | (813) 815-1234 | Air Turbulencia');
  await expect(page.locator('h1')).toHaveText('AC installation in Tampa.Comfort you can feel.');
  await expect(page.locator('[data-title-flow]')).toHaveCount(2);
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

test('legacy tornado favicon variants are declared and served', async ({ page }) => {
  await page.goto('/');
  const iconLinks = page.locator('head link[rel="icon"], head link[rel="apple-touch-icon"]');
  await expect(iconLinks).toHaveCount(4);
  const hrefs = await iconLinks.evaluateAll(links => links.map(link => (link as HTMLLinkElement).getAttribute('href')));
  expect(hrefs).toEqual([
    '/favicon.ico',
    '/favicons/favicon-32x32.png',
    '/favicons/android-chrome-192x192.png',
    '/favicons/apple-touch-icon.png',
  ]);
  for (const href of hrefs) {
    const response = await page.request.get(href!);
    expect(response.ok(), `${href} should be served`).toBe(true);
  }
});

test('preview robots.txt is valid while homepage remains noindex', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  const response = await request.get('/robots.txt');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('text/plain');
  expect((await response.text()).trim()).toBe('User-agent: *\nDisallow:');
});

test('static hero layers share the same cover crop', async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const layers = await page.evaluate(() => {
      const room = document.querySelector('.room-image')!.getBoundingClientRect();
      const curtain = document.querySelector('.static-curtain')!;
      const curtainBox = curtain.getBoundingClientRect();
      return {
        widthDifference: Math.abs(room.width - curtainBox.width),
        heightDifference: Math.abs(room.height - curtainBox.height),
        objectFit: getComputedStyle(curtain).objectFit,
      };
    });
    expect(layers.widthDifference).toBeLessThan(1);
    expect(layers.heightDifference).toBeLessThan(1);
    expect(layers.objectFit).toBe('cover');
  }
});

test('title airflow texture keeps readable contrast against the light surface', async ({ page }) => {
  await page.goto('/');
  const pattern = fs.readFileSync('src/assets/title-airflow.svg', 'utf8');
  expect(pattern).toContain('<feGaussianBlur');
  const highlight = pattern.match(/stop-color="([^"]+)"/)?.[1].replace('#', '');
  const opacity = Math.max(...Array.from(pattern.matchAll(/stop-opacity="([\d.]+)"/g), match => Number(match[1])));
  expect(highlight).toBeTruthy();
  const ratios = await page.evaluate(({ highlight, opacity }) => {
    const styles = getComputedStyle(document.documentElement);
    const hex = (token: string) => styles.getPropertyValue(token).trim().replace('#', '');
    const blend = (base: string, tint: string, alpha: number) => [0, 2, 4]
      .map(index => Math.round(parseInt(base.slice(index, index + 2), 16) * (1 - alpha) + parseInt(tint.slice(index, index + 2), 16) * alpha)
        .toString(16).padStart(2, '0')).join('');
    const luminance = (color: string) => {
      const channels = [0, 2, 4].map(index => parseInt(color.slice(index, index + 2), 16) / 255)
        .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const paper = luminance(hex('--paper'));
    const headingSizes = ['#hero-title', '#services-title'].map(selector =>
      parseFloat(getComputedStyle(document.querySelector(selector)!).fontSize),
    );
    return {
      headingSizes,
      ratios: ['--ink', '--ocean'].map(token => {
      const color = luminance(blend(hex(token), highlight!, opacity));
      return (Math.max(paper, color) + 0.05) / (Math.min(paper, color) + 0.05);
      }),
    };
  }, { highlight, opacity });
  expect(ratios.headingSizes.every(size => size >= 24)).toBe(true);
  expect(ratios.ratios.every(ratio => ratio >= 3)).toBe(true);
});

test('keyboard can open services, follow its links and dismiss the menu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const menu = page.locator('.services-menu > summary');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.services-dropdown')).toBeVisible();
  const navigationLeft = await page.locator('.services-menu > summary').evaluate(element => element.getBoundingClientRect().left);
  const dropdownLeft = await page.locator('.services-dropdown').evaluate(element => element.getBoundingClientRect().left);
  expect(Math.abs(dropdownLeft - navigationLeft)).toBeLessThan(1);
  const dropdownWidth = await page.locator('.services-dropdown').evaluate(element => element.getBoundingClientRect().width);
  expect(dropdownWidth).toBeLessThanOrEqual(620);
  expect(dropdownWidth).toBeGreaterThan(580);
  await page.keyboard.press('Tab');
  await expect(page.locator('.service-category > summary').first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.services-dropdown a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.services-menu')).not.toHaveAttribute('open');
  await expect(menu).toBeFocused();
});

test('mobile navigation stacks its links and groups Services into compact disclosures', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.room-image')).toHaveCSS('object-fit', 'cover');
  await page.locator('.menu-toggle').click();

  const navigation = page.locator('.primary-navigation');
  await expect(navigation.locator(':scope > *')).toHaveCount(6);
  expect(await navigation.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(1);
  const headingParts = await page.locator('#hero-title .airflow-title').evaluateAll(elements => elements.map(element => element.getBoundingClientRect()));
  expect(headingParts[1].top - headingParts[0].bottom).toBeLessThan(8);

  const quickServices = page.locator('.quick-services > a');
  await expect(quickServices.nth(0)).toHaveCSS('border-right-width', '1px');
  await expect(quickServices.nth(1)).toHaveCSS('border-right-width', '0px');
  await expect(quickServices.nth(2)).toHaveCSS('border-right-width', '1px');
  await expect(quickServices.nth(0)).toHaveCSS('border-bottom-width', '1px');
  await expect(quickServices.nth(1)).toHaveCSS('border-bottom-width', '1px');

  await page.locator('.services-menu > summary').click();
  await expect(page.locator('.services-dropdown')).toBeVisible();
  const categories = page.locator('.service-category');
  await expect(categories).toHaveCount(2);
  await expect(categories.nth(0)).not.toHaveAttribute('open', '');
  const acInstallLink = page.locator('.service-category a[href$="/air-conditioning-installation-tampa/"]');
  const heatInstallLink = page.locator('.service-category a[href$="/heating-installation-tampa/"]');
  await expect(acInstallLink).toBeHidden();
  await categories.nth(0).locator('summary').click();
  await expect(acInstallLink).toBeVisible();
  await expect(heatInstallLink).toBeHidden();
});

test('fluid fallback has no horizontal overflow and navigation remains usable', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const headingStyles = await page.locator('h1').evaluate(element => {
      const style = getComputedStyle(element);
      return {
        fontSize: parseFloat(style.fontSize),
        lineHeight: parseFloat(style.lineHeight),
        letterSpacing: parseFloat(style.letterSpacing),
        maxWidth: style.maxWidth,
      };
    });
    const expectedFontSize = Math.min(64, Math.max(40, width * 0.09));
    expect(headingStyles.fontSize).toBeCloseTo(expectedFontSize, 1);
    expect(headingStyles.lineHeight).toBeCloseTo(expectedFontSize * 1.02, 1);
    expect(headingStyles.letterSpacing).toBeCloseTo(expectedFontSize * -0.045, 1);
    expect(headingStyles.maxWidth).toBe('500px');
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

test('tablet portrait uses a page-wide reflow without switching to the mobile layout', async ({ page }) => {
  for (const width of [768, 834, 900]) {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const columns = await page.evaluate(() => {
      const count = (selector: string) => getComputedStyle(document.querySelector(selector)!).gridTemplateColumns.split(' ').length;
      return {
        quickServices: count('.quick-services'),
        servicePanels: count('.service-panels'),
        processSteps: count('.process-steps'),
        expertise: count('.expertise-grid'),
        comfort: count('.comfort-grid'),
        reviews: count('.review-pair'),
        questions: count('.questions-grid'),
        footer: count('.footer-grid'),
      };
    });
    expect(columns).toEqual({
      quickServices: 2,
      servicePanels: 2,
      processSteps: 2,
      expertise: 1,
      comfort: 1,
      reviews: 1,
      questions: 1,
      footer: 2,
    });
    const installIconLeft = await page.locator('.quick-services > a').nth(0).locator('svg').first().evaluate(element => element.getBoundingClientRect().left);
    const maintenanceIconLeft = await page.locator('.quick-services > a').nth(2).locator('svg').first().evaluate(element => element.getBoundingClientRect().left);
    expect(maintenanceIconLeft).toBe(installIconLeft);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('service cards start together and align their bottoms from tablet upward', async ({ page }) => {
  for (const width of [768, 834, 900, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const cards = page.locator('.service-panel');
    const boxes = await cards.evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      const link = element.querySelector('.panel-link')!.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, linkBottom: link.bottom };
    }));
    expect(Math.abs(boxes[0].top - boxes[1].top)).toBeLessThan(1);
    expect(Math.abs(boxes[0].bottom - boxes[1].bottom)).toBeLessThan(1);
    expect(Math.abs(boxes[0].linkBottom - boxes[1].linkBottom)).toBeLessThan(1);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const mobileCards = await page.locator('.service-panel').evaluateAll(elements => elements.map(element => element.getBoundingClientRect()));
  expect(mobileCards[1].top).toBeGreaterThan(mobileCards[0].bottom);
});

test('the first installation step stays within two lines on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const paragraph = page.locator('.process-steps li').first().locator('p');
  const metrics = await paragraph.evaluate(element => {
    const style = getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);
    return {
      lines: element.getBoundingClientRect().height / lineHeight,
      width: element.getBoundingClientRect().width,
      fontSize: style.fontSize,
    };
  });
  expect(metrics.lines, `at 1440px, paragraph width ${metrics.width}px and font size ${metrics.fontSize}`).toBeCloseTo(2, 0);
});

test('expertise copy width, service image and desktop paragraph match the approved content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.equipment-picture img')).toHaveAttribute('alt', 'An HVAC technician diagnosing an outdoor air conditioning condenser');
  await expect(page.locator('.equipment-story p')).toHaveText('We service all major makes and models, using hands-on experience to diagnose issues and deliver dependable repairs.');
  const pictureFrame = await page.locator('.equipment-picture').evaluate(element => {
    const style = getComputedStyle(element);
    return { borderColor: style.borderTopColor, borderWidth: style.borderTopWidth, shadow: style.boxShadow };
  });
  expect(pictureFrame).toMatchObject({ borderColor: 'rgb(255, 255, 255)', borderWidth: '8px' });
  expect(pictureFrame.shadow).toContain('rgba(0, 0, 0, 0.22)');
  await page.locator('.expertise-section').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.equipment-picture').evaluate(element => element.getAnimations().length)).toBe(1);
  const photoEntry = await page.locator('.equipment-picture').evaluate(element => {
    const animation = element.getAnimations()[0];
    const effect = animation?.effect as KeyframeEffect | null;
    return animation && {
      duration: animation.effect?.getTiming().duration,
      firstFrame: effect?.getKeyframes()[0],
      state: animation.playState,
    };
  });
  expect(photoEntry).toMatchObject({ duration: 1150, state: 'running' });
  expect(photoEntry?.firstFrame?.transform).toContain('scale(0.8) rotate(-5deg)');
  await page.waitForTimeout(180);
  const midpoint = await page.locator('.equipment-picture').evaluate(element => element.getAnimations()[0]?.currentTime as number);
  expect(midpoint).toBeGreaterThan(0);
  expect(midpoint).toBeLessThan(1000);
  await page.locator('.expertise-section').screenshot({ path: path.join(shots, 'expertise-photo-entry.png') });
  await page.waitForTimeout(1000);
  await page.locator('.expertise-section').screenshot({ path: path.join(shots, 'expertise-section.png') });
  const copyWidth = await page.locator('.expertise-copy p').first().evaluate(element => {
    const style = getComputedStyle(element);
    const context = document.createElement('canvas').getContext('2d')!;
    context.font = style.font;
    return { maxWidth: parseFloat(style.maxWidth), fiftyCh: context.measureText('0').width * 50 };
  });
  expect(copyWidth.maxWidth).toBeCloseTo(copyWidth.fiftyCh, 1);

  for (const width of [1100, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    const paragraph = page.locator('.equipment-story p');
    const lines = await paragraph.evaluate(element => {
      const style = getComputedStyle(element);
      return element.getBoundingClientRect().height / parseFloat(style.lineHeight);
    });
    expect(lines).toBeLessThanOrEqual(2.1);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.locator('.equipment-picture').evaluate(element => getComputedStyle(element).borderTopWidth)).toBe('6px');
});

test('homepage has no automatically detected WCAG A/AA violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  fs.writeFileSync(path.join(shots, 'axe.json'), JSON.stringify({ violations: results.violations, incomplete: results.incomplete }, null, 2));
  expect(results.violations).toEqual([]);
});
