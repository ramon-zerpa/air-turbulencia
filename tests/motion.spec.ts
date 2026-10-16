import { test, expect } from "@playwright/test";

test("mobile navigation does not shift the hero while deferred code loads", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    (window as unknown as Window & { startupCLS: number }).startupCLS = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!shift.hadRecentInput) (window as unknown as Window & { startupCLS: number }).startupCLS += shift.value;
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
  expect(await page.evaluate(() => (window as unknown as Window & { startupCLS: number }).startupCLS)).toBeLessThan(0.1);
});

test("airflow renders changing frames, pauses, persists and sleeps offscreen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const scene = page.locator("[data-air-scene]");
  await expect(scene).toHaveAttribute("data-state", "ready");
  await expect(scene).toHaveAttribute("data-running", "true");
  const surface = scene.locator(".scene-surface");
  await page.mouse.move(1320, 250);
  await page.waitForTimeout(80);
  expect(await surface.evaluate(el => (el as HTMLElement).style.getPropertyValue("--scene-x"))).toBe("");
  expect(await surface.evaluate(el => (el as HTMLElement).style.getPropertyValue("--scene-y"))).toBe("");
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

test("the shared motion control pauses and resumes the continuous title airflow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const title = page.locator("#hero-title .airflow-title--ink");
  const animationState = () => title.evaluate(el => {
    const animation = el.getAnimations()[0] as CSSAnimation | undefined;
    return animation && {
      name: animation.animationName,
      state: animation.playState,
      pending: animation.pending,
      time: animation.currentTime as number,
    };
  });
  await expect.poll(animationState).toMatchObject({ name: "title-airflow-flow", state: "running" });

  await page.getByRole("button", { name: "Pause animations" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect.poll(animationState).toMatchObject({ state: "paused", pending: false });
  const pausedAt = (await animationState())!.time;
  await page.waitForTimeout(220);
  expect((await animationState())!.time).toBe(pausedAt);

  await page.getByRole("button", { name: "Resume animations" }).click();
  await expect.poll(animationState).toMatchObject({ state: "running" });
  await expect.poll(async () => (await animationState())!.time).toBeGreaterThan(pausedAt);
  await page.locator("#services-title").scrollIntoViewIfNeeded();
  await expect(page.locator("#services-title")).toHaveAttribute("data-flow-visible", "true");
  await expect(page.locator("#hero-title")).toHaveAttribute("data-flow-visible", "false");
  await expect.poll(() => page.locator("#services-title .airflow-title--ocean").evaluate(el => getComputedStyle(el).animationPlayState)).toBe("running");
  await expect.poll(animationState).toMatchObject({ state: "paused" });
});

test("expertise atmosphere stays static and decorative", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const section = page.locator(".expertise-section");
  await expect(section).not.toHaveAttribute("data-airflow-texture");
  await expect(section).not.toHaveAttribute("data-airflow-active");
  const background = await section.evaluate(el => getComputedStyle(el, "::before"));
  expect(background.animationName).toBe("none");
  expect(background.backgroundImage).toContain("feTurbulence");
  expect(background.backgroundImage).toContain("radial-gradient");
  expect(background.pointerEvents).toBe("none");
});

test("expertise photo entrance pauses and resumes with the shared motion control", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const photo = page.locator(".equipment-picture");
  await page.locator(".expertise-section").scrollIntoViewIfNeeded();
  const state = () => photo.evaluate(el => {
    const animation = el.getAnimations()[0];
    return animation && { state: animation.playState, time: animation.currentTime as number };
  });
  await expect.poll(state).toMatchObject({ state: "running" });
  await page.getByRole("button", { name: "Pause animations" }).evaluate(button => (button as HTMLButtonElement).click());
  await expect.poll(state).toMatchObject({ state: "paused" });
  const pausedAt = (await state())!.time;
  await page.waitForTimeout(220);
  expect((await state())!.time).toBe(pausedAt);
  await page.getByRole("button", { name: "Resume animations" }).evaluate(button => (button as HTMLButtonElement).click());
  await expect.poll(state).toMatchObject({ state: "running" });
  await expect.poll(async () => (await state())!.time).toBeGreaterThan(pausedAt);
});

test("reduced motion skips GPU module and remains readable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("[data-title-flow][data-flow-ready]")).toHaveCount(0);
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
  await expect(page.locator("[data-title-flow][data-flow-ready]")).toHaveCount(0);
  await page.locator(".expertise-section").scrollIntoViewIfNeeded();
  await expect(page.locator(".equipment-picture img")).toBeVisible();
  expect(await page.locator(".equipment-picture").evaluate(el => el.getAnimations().length)).toBe(0);
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
  await expect(page.locator("[data-title-flow][data-flow-ready]")).toHaveCount(0);
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
  const expertiseBackground = await page.locator(".expertise-section").evaluate(el => getComputedStyle(el, "::before"));
  expect(expertiseBackground.backgroundImage).toContain("feTurbulence");
  expect(expertiseBackground.animationName).toBe("none");
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
