import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const results = [];
for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("http://127.0.0.1:4322/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  results.push(
    await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      scene: document.querySelector("[data-air-scene]").dataset,
      overflow: [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.right > innerWidth + 1 &&
            getComputedStyle(el).position !== "absolute"
          );
        })
        .slice(0, 12)
        .map((el) => ({
          tag: el.tagName,
          cls: el.className,
          right: el.getBoundingClientRect().right,
        })),
    })),
  );
  if (width === 390) {
    await page.evaluate(async () => {
      for (const img of document.images) {
        img.loading = "eager";
        await img.decode();
      }
    });
    await page.screenshot({
      path: "docs/evidence/option-02/mobile-first-pass.png",
      fullPage: true,
    });
  }
}
console.log(JSON.stringify({ results, errors }, null, 2));
await browser.close();
