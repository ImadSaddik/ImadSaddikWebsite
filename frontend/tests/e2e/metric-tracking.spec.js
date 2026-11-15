import { test, expect } from "@playwright/test";
import { ROUTES, CLAP_DEBOUNCE_MILLISECONDS } from "@/constants";

async function getArticleStatCount(page, cardIndex, iconSelector) {
  const cardsGroup = page.locator(".cards-group").first();
  await cardsGroup.locator("a").nth(cardIndex).waitFor({ state: "visible" });
  const statSpan = cardsGroup.locator(".card-stats").nth(cardIndex).locator(`${iconSelector} + .stat-num`);
  return (await statSpan.count()) > 0 ? parseInt(await statSpan.textContent(), 10) : 0;
}

function getCardIndexForBrowser(browserName) {
  // Isolate Chromium and Firefox workers onto separate articles so parallel runs do not contend on counters.
  return browserName === "firefox" ? 1 : 0;
}

test.describe("Article metric tracking", () => {
  test.describe.configure({ mode: "serial" });

  test.describe("view count", () => {
    test("should update view count after visiting an article", async ({ page, browserName }) => {
      const cardIndex = getCardIndexForBrowser(browserName);
      await page.goto(ROUTES.BLOGS_HUB.path);

      const initialViewCount = await getArticleStatCount(page, cardIndex, ".fa-eye");

      await Promise.all([
        page.waitForResponse((res) => res.url().includes("/increment-view-count") && res.status() === 200),
        page.locator(".cards-group").first().locator("a").nth(cardIndex).click(),
      ]);
      await page.waitForLoadState("networkidle");

      await expect(async () => {
        await page.goto(ROUTES.BLOGS_HUB.path);
        const updatedViewCount = await getArticleStatCount(page, cardIndex, ".fa-eye");
        expect(updatedViewCount).toBeGreaterThanOrEqual(initialViewCount + 1);
      }).toPass();
    });
  });

  test.describe("claps count", () => {
    test("should update claps count after clapping an article", async ({ page, browserName }) => {
      const CLAP_COUNT = 3;
      const cardIndex = getCardIndexForBrowser(browserName);

      await page.goto(ROUTES.BLOGS_HUB.path);

      const initialClapsCount = await getArticleStatCount(page, cardIndex, ".fa-hands-clapping");

      await page.locator(".cards-group").first().locator("a").nth(cardIndex).click();
      await page.waitForLoadState("networkidle");

      const clapButton = page.locator(".clap-button").first();
      await clapButton.scrollIntoViewIfNeeded();

      const clapPatchPromise = page.waitForResponse(
        (res) => res.url().includes("/increment-claps-count") && res.status() === 200
      );

      for (let i = 0; i < CLAP_COUNT; i++) {
        await clapButton.click();
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(CLAP_DEBOUNCE_MILLISECONDS);
      await clapPatchPromise;

      await expect(async () => {
        await page.goto(ROUTES.BLOGS_HUB.path);
        const updatedClapsCount = await getArticleStatCount(page, cardIndex, ".fa-hands-clapping");
        expect(updatedClapsCount).toBe(initialClapsCount + CLAP_COUNT);
      }).toPass();
    });
  });

  test.describe("read count", () => {
    test("should update read count after reading an article", async ({ page, browserName }) => {
      const cardIndex = getCardIndexForBrowser(browserName);
      await page.clock.install();
      await page.goto(ROUTES.BLOGS_HUB.path);

      const initialReadCount = await getArticleStatCount(page, cardIndex, ".fa-book-open");

      await page.locator(".cards-group").first().locator("a").nth(cardIndex).click();
      await page.waitForLoadState("networkidle");

      const readPatchPromise = page.waitForResponse(
        (res) => res.url().includes("/increment-read-count") && res.status() === 200
      );
      await page.clock.fastForward("10:00");
      await readPatchPromise;

      await expect(async () => {
        await page.goto(ROUTES.BLOGS_HUB.path);
        const updatedReadCount = await getArticleStatCount(page, cardIndex, ".fa-book-open");
        expect(updatedReadCount).toBeGreaterThanOrEqual(initialReadCount + 1);
      }).toPass();
    });
  });
});
