import { chromium, firefox, webkit } from "@playwright/test";
import fs from "node:fs";
import { gzipSync } from "node:zlib";
const out = "docs/evidence/option-02";
const report = { browsers: [], budgets: {}, motion: {} };
for (const [name, type] of [
  ["chromium", chromium],
  ["firefox", firefox],
  ["webkit", webkit],
]) {
  let browser;
  try {
    browser = await type.launch();
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:4322/");
    await page.waitForTimeout(1500);
    const desktop = await page.evaluate(() => ({
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      scene: document.querySelector("[data-air-scene]").dataset.state,
      h1: document.querySelector("h1").textContent,
    }));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".menu-toggle").click();
    const menu = await page
      .locator(".menu-toggle")
      .getAttribute("aria-expanded");
    await page.keyboard.press("Escape");
    report.browsers.push({ name, desktop, mobileMenu: menu, errors });
  } catch (e) {
    report.browsers.push({ name, unavailable: e.message });
  } finally {
    await browser?.close();
  }
}
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  recordVideo: {
    dir: out + "/recordings",
    size: { width: 1440, height: 1000 },
  },
});
await ctx.tracing.start({ screenshots: true, snapshots: true });
const page = await ctx.newPage();
const requests = [];
page.on("request", (r) => requests.push(r.url()));
await page.goto("http://127.0.0.1:4322/");
await page.waitForTimeout(11000);
report.motion.desktop = await page
  .locator("[data-air-scene]")
  .evaluate((el) => ({ ...el.dataset }));
await page.mouse.move(1000, 420);
await page.waitForTimeout(500);
await page.mouse.move(700, 350);
await page.waitForTimeout(500);
await page.getByRole("button", { name: "Pause animations" }).click();
await page.screenshot({ path: out + "/hero-final.png" });
await page.getByRole("button", { name: "Resume animations" }).click();
for (const target of [
  "#services-title",
  "#process-title",
  "#expertise-title",
  "#coverage-title",
  "#questions-title",
]) {
  await page.locator(target).scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
}
report.motion.offscreen = await page
  .locator("[data-air-scene]")
  .getAttribute("data-running");
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(900);
await ctx.tracing.stop({ path: out + "/motion-trace.zip" });
report.motion.thirdPartyRequests = requests.filter(
  (u) => !u.startsWith("http://127.0.0.1:4322") && !u.startsWith("data:"),
);
await ctx.close();
await page.video().saveAs(out + "/motion-demo.webm");
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://127.0.0.1:4322/");
await mobile.waitForTimeout(10000);
report.motion.mobile = await mobile
  .locator("[data-air-scene]")
  .evaluate((el) => ({ ...el.dataset }));
await mobile.screenshot({ path: out + "/mobile-viewport.png" });
await mobile.close();
await browser.close();
for (const ext of [".js", ".css"]) {
  const files = fs.readdirSync("dist/_astro").filter((n) => n.endsWith(ext));
  report.budgets[ext] = files.map((file) => ({
    file,
    bytes: fs.statSync("dist/_astro/" + file).size,
    gzip: gzipSync(fs.readFileSync("dist/_astro/" + file)).length,
  }));
}
fs.writeFileSync(out + "/runtime-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
