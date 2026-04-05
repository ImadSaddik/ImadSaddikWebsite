import { test, expect } from "@playwright/test";
import { ROUTES, CLAP_DEBOUNCE_MILLISECONDS } from "@/constants";

test.describe("Article metric tracking", () => {
  test.describe.configure({ mode: "serial" });

  test.describe("view count", () => {
    test("should update view count after visiting an article", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);

      const cardsGroup = page.locator(".cards-group").first();
      const viewsCountSpan = cardsGroup.locator(".card-stats").first().locator(".fa-eye + .stat-num");
      const initialViewCount = parseInt(await viewsCountSpan.textContent());

      await cardsGroup.locator("a").first().click();
      await page.waitForLoadState("networkidle");
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const updatedViewCount = parseInt(await viewsCountSpan.textContent());
      expect(updatedViewCount).toBeGreaterThanOrEqual(initialViewCount + 1);
    });
  });

  test.describe("claps count", () => {
    test("should update claps count after clapping an article", async ({ page }) => {
      const CLAP_COUNT = 3;

      await page.goto(ROUTES.BLOGS_HUB.path);

      const cardsGroup = page.locator(".cards-group").first();
      const clapsCountSpan = cardsGroup.locator(".card-stats").first().locator(".fa-hands-clapping + .stat-num");
      const initialClapsCount = parseInt(await clapsCountSpan.textContent());

      await cardsGroup.locator("a").first().click();
      await page.waitForLoadState("networkidle");

      const clapButton = page.locator(".clap-button").first();
      await clapButton.scrollIntoViewIfNeeded();

      for (let i = 0; i < CLAP_COUNT; i++) {
        await clapButton.click();
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(CLAP_DEBOUNCE_MILLISECONDS);

      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const updatedClapsCount = parseInt(await clapsCountSpan.textContent());
      expect(updatedClapsCount).toBe(initialClapsCount + CLAP_COUNT);
    });
  });

  test.describe("read count", () => {
    test("should update read count after reading an article", async ({ page }) => {
      await page.clock.install();
      await page.goto(ROUTES.BLOGS_HUB.path);

      const cardsGroup = page.locator(".cards-group").first();
      const readCountSpan = cardsGroup.locator(".card-stats").first().locator(".fa-book-open + .stat-num");
      const initialReadCount = (await readCountSpan.count()) > 0 ? parseInt(await readCountSpan.textContent()) : 0;

      await cardsGroup.locator("a").first().click();
      await page.waitForLoadState("networkidle");

      await page.clock.fastForward("10:00");

      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const updatedReadCount = (await readCountSpan.count()) > 0 ? parseInt(await readCountSpan.textContent()) : 0;
      expect(updatedReadCount).toBeGreaterThanOrEqual(initialReadCount + 1);
    });
  });
});
