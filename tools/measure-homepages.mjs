import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";
import fs from "node:fs";
import path from "node:path";
const directory = path.resolve(process.env.LIGHTHOUSE_OUTPUT || "docs/evidence/option-02/lighthouse-final");
fs.mkdirSync(directory, { recursive: true });
const runtime = path.join(process.env.LOCALAPPDATA, "ms-playwright");
const shell = fs
  .readdirSync(runtime)
  .filter((n) => n.startsWith("chromium_headless_shell-"))
  .sort()
  .at(-1);
const chromePath = path.join(
  runtime,
  shell,
  "chrome-headless-shell-win64",
  "chrome-headless-shell.exe",
);
const rows = [];
for (const [version, port] of [
  ["baseline", 4321],
  ["airflow", 4322],
])
  for (const profile of ["mobile", "desktop"])
    for (let run = 1; run <= 3; run++) {
      const filename = path.join(
        directory,
        `${version}-${profile}-${run}.json`,
      );
      let lhr;
      if (fs.existsSync(filename))
        lhr = JSON.parse(fs.readFileSync(filename, "utf8"));
      else {
        const chrome = await launch({
          chromePath,
          chromeFlags: ["--headless", "--disable-extensions", "--no-first-run"],
        });
        try {
          const result = await lighthouse(
            `http://127.0.0.1:${port}/`,
            {
              port: chrome.port,
              output: "json",
              logLevel: "error",
              onlyCategories: [
                "performance",
                "accessibility",
                "best-practices",
              ],
            },
            profile === "desktop" ? desktopConfig : undefined,
          );
          lhr = result.lhr;
          fs.writeFileSync(filename, JSON.stringify(lhr, null, 2));
        } finally {
          await Promise.resolve(chrome.kill());
        }
      }
      const row = {
        version,
        profile,
        run,
        date: lhr.fetchTime,
        lighthouse: lhr.lighthouseVersion,
        performance: lhr.categories.performance.score * 100,
        accessibility: lhr.categories.accessibility.score * 100,
        lcp: lhr.audits["largest-contentful-paint"].numericValue,
        cls: lhr.audits["cumulative-layout-shift"].numericValue,
        tbt: lhr.audits["total-blocking-time"].numericValue,
        bytes: lhr.audits["total-byte-weight"].numericValue,
        warnings: lhr.runWarnings,
      };
      rows.push(row);
      console.log(JSON.stringify(row));
      fs.writeFileSync(
        path.join(directory, "summary.json"),
        JSON.stringify(rows, null, 2),
      );
    }
