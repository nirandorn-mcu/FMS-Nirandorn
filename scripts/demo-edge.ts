import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await context.clearCookies();
  await page.goto("http://localhost:3010/login");
  await page.fill("#email", "admin@app.local");
  await page.fill("#password", "Passw0rd!vibe");
  await page.click("button[type=\"submit\"]");
  await page.waitForURL("**/dashboard**", { timeout: 10000 }).catch(() => {});
  
  const urls = ["/document-flow", "/advance-payment", "/project-budget", "/student-petition", "/users", "/"];
  for (const url of urls) {
    await page.goto("http://localhost:3010" + url).catch(() => {});
    await page.waitForTimeout(2000);
  }
  await browser.close();
})();
