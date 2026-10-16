import { test, expect } from "@playwright/test";

test("mobile navigation does not shift the hero while deferred code loads", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    (window as Window & { startupCLS: number }).startupCLS = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!shift.hadRecentInput) (window as Window & { startupCLS: number }).startupCLS += shift.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.route("**/*.js", async route => {
    await new Promise(resolve => setTimeout(resolve, 800));
    await route.continue();
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".menu-toggle")).toBeVisible();
  expect(await page.evaluate(() => (window as Window & { startupCLS: number }).startupCLS)).toBeLessThan(0.1);
});

test("airflow renders changing frames, pauses, persists and sleeps offscreen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const scene = page.locator("[data-air-scene]");
  await expect(scene).toHaveAttribute("data-state", "ready");
  await expect(scene).toHaveAttribute("data-running", "true");
  await page.waitForTimeout(1300);
  const a = await scene.screenshot();
  await page.waitForTimeout(500);
  const b = await scene.screenshot();
  expect(a.equals(b)).toBe(false);
  const toggle = page.getByRole("button", { name: "Pause animations" });
  await toggle.click();
  await expect(scene).toHaveAttribute("data-running", "false");
  const frozen = await scene.screenshot();
  await page.waitForTimeout(350);
  expect(frozen.equals(await scene.screenshot())).toBe(true);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Resume animations" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Resume animations" }).click();
  await expect(scene).toHaveAttribute("data-running", "true");
  await page.locator("#final-title").scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-running", "false");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(scene).toHaveAttribute("data-running", "true");
});

test("reduced motion skips GPU module and remains readable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".motion-toggle")).toBeHidden();
  expect(requests.some((url) => /\/airflow\..*\.js/.test(url))).toBe(false);
  expect(
    await page
      .locator(".air-canvas")
      .evaluate((el) => getComputedStyle(el).opacity),
  ).toBe("0");
  await page.screenshot({ path: "docs/evidence/option-02/reduced-motion.png" });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("[data-air-scene]")).toHaveAttribute(
    "data-state",
    "ready",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-air-scene]")).toHaveAttribute(
    "data-state",
    "static",
  );
});

test("GPU absence and context loss retain the scene", async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const native = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type === "webgl2") return null;
      return native.apply(this, [type, ...args] as never);
    } as typeof native;
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("[data-air-scene]")).toHaveAttribute(
    "data-state",
    "fallback",
  );
  await expect(page.locator(".static-curtain")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Request Service" }).first(),
  ).toBeVisible();
  await context.close();
  const ctx = await browser.newContext();
  const normal = await ctx.newPage();
  await normal.goto("/");
  await expect(normal.locator("[data-air-scene]")).toHaveAttribute(
    "data-state",
    "ready",
  );
  await normal.locator("canvas").evaluate((el) => {
    (el as HTMLCanvasElement)
      .getContext("webgl2")!
      .getExtension("WEBGL_lose_context")!
      .loseContext();
  });
  await expect(normal.locator("[data-air-scene]")).toHaveAttribute(
    "data-state",
    "fallback",
  );
  await expect(normal.locator(".static-curtain")).toBeVisible();
  await ctx.close();
});

test("no JavaScript retains mobile navigation, contact and native FAQ", async ({
  browser,
}) => {
  const ctx = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
  await page
    .locator(".questions-list details")
    .nth(1)
    .locator("summary")
    .click();
  await expect(page.locator(".questions-list details").nth(1)).toHaveAttribute(
    "open",
    "",
  );
  await expect(page.locator(".motion-toggle")).toBeHidden();
  await ctx.close();
});

test("landscape, short desktop and enlarged text preserve reflow", async ({
  page,
}) => {
  for (const size of [
    { width: 844, height: 390 },
    { width: 1280, height: 650 },
  ]) {
    await page.setViewportSize(size);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.addStyleTag({
    content:
      "p,a,summary,button{font-size:125%!important;line-height:1.7!important}",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
