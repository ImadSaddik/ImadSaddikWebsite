import { test, expect } from "@playwright/test";
import { ROUTES, DEFAULT_BATCH_SIZE } from "@/constants";

test.describe("Pagination and load more", () => {
  test("should display the first batch of articles with a load more button", async ({ page }) => {
    await page.goto(ROUTES.BLOGS_HUB.path);
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".cards-group .card-container")).toHaveCount(DEFAULT_BATCH_SIZE);
    await expect(page.locator(".load-more-button")).toBeVisible();
  });

  test("should append articles on load more and hide button when all are loaded", async ({ page }) => {
    await page.goto(ROUTES.BLOGS_HUB.path);
    await page.waitForLoadState("networkidle");

    const cards = page.locator(".cards-group .card-container");
    const loadMoreButton = page.locator(".load-more-button");

    while (await loadMoreButton.isVisible()) {
      const countBeforeClick = await cards.count();
      await loadMoreButton.click();
      await expect(cards).not.toHaveCount(countBeforeClick);
    }

    await expect(loadMoreButton).not.toBeVisible();
  });

  test("should reset offset when a filter is applied after loading more", async ({ page }) => {
    await page.goto(ROUTES.BLOGS_HUB.path);
    await page.waitForLoadState("networkidle");

    const cards = page.locator(".cards-group .card-container");
    const loadMoreButton = page.locator(".load-more-button");

    await expect(loadMoreButton).toBeVisible();
    await loadMoreButton.click();
    await expect(cards).not.toHaveCount(DEFAULT_BATCH_SIZE);

    const countAfterLoadMore = await cards.count();
    expect(countAfterLoadMore).toBeGreaterThan(DEFAULT_BATCH_SIZE);

    const yearCheckbox = page.locator(".articles-hub-filters-year input[type='checkbox']").first();
    await yearCheckbox.check();
    await expect(cards).not.toHaveCount(countAfterLoadMore);

    expect(await cards.count()).toBeLessThan(countAfterLoadMore);
  });
});
