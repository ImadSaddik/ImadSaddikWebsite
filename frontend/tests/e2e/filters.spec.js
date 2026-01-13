import { test, expect } from "@playwright/test";
import { ROUTES } from "@/constants";

test.describe("Filters and sorting", () => {
  test.describe("Happy path", () => {
    test("should display sorting options on articles hub", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const sortHeader = page.locator('h2.collapsible-header:has-text("Sort")');
      await expect(sortHeader).toBeVisible();
    });

    test("should display year filter options", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const yearHeader = page.locator('h2.collapsible-header:has-text("Year")');
      await expect(yearHeader).toBeVisible();
    });

    test("should display tags filter options", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const tagsHeader = page.locator('h2.collapsible-header:has-text("Tags")');
      await expect(tagsHeader).toBeVisible();
    });

    test("should collapse and expand sort section", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      const sortHeader = page.locator('h2.collapsible-header:has-text("Sort")');
      await expect(sortHeader.locator(".fa-chevron-up")).toBeVisible();

      await sortHeader.click();
      await expect(sortHeader.locator(".fa-chevron-down")).toBeVisible();
      await sortHeader.click();

      const sortContent = page.locator(".articles-hub-filters-sorting .collapsible-content");
      await expect(sortContent).toBeVisible();
      await expect(sortHeader.locator(".fa-chevron-up")).toBeVisible();
    });

    test("should collapse and expand year section", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      const yearHeader = page.locator('h2.collapsible-header:has-text("Year")');
      await expect(yearHeader.locator(".fa-chevron-up")).toBeVisible();

      await yearHeader.click();
      await expect(yearHeader.locator(".fa-chevron-down")).toBeVisible();
      await yearHeader.click();

      await expect(yearHeader.locator(".fa-chevron-up")).toBeVisible();
    });

    test("should collapse and expand tags section", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      const tagsHeader = page.locator('h2.collapsible-header:has-text("Tags")');
      await expect(tagsHeader.locator(".fa-chevron-up")).toBeVisible();

      await tagsHeader.click();
      await expect(tagsHeader.locator(".fa-chevron-down")).toBeVisible();

      await tagsHeader.click();
      await expect(tagsHeader.locator(".fa-chevron-up")).toBeVisible();

      const tagsContent = page.locator(".articles-hub-filters-tags .collapsible-content");
      await expect(tagsContent).toBeVisible();
    });

    test("should show order options when sort is selected", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const sortSection = page.locator(".articles-hub-filters-sorting");
      await expect(sortSection).toBeVisible();
      await sortSection.click();

      const dropdown = sortSection.locator(".dropdown").first();
      await expect(dropdown).toBeVisible();

      const dropdownMenus = dropdown.locator("ul.dropdown-menu li");
      const menuCount = await dropdownMenus.count();
      await expect(menuCount).toBeGreaterThanOrEqual(4);

      const correctLabels = ["Date", "Popularity (Views)", "Engagement (Reads)", "Claps"];
      for (let i = 0; i < menuCount; i++) {
        const item = dropdownMenus.nth(i);
        const itemText = await item.textContent();
        expect(correctLabels).toContain(itemText?.trim() || "");
      }
    });

    test("should toggle sort order between ascending and descending", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const sortSection = page.locator(".articles-hub-filters-sorting");
      await expect(sortSection).toBeVisible();
      await sortSection.click();

      const dropdown = sortSection.locator(".dropdown").first();
      await expect(dropdown).toBeVisible();

      const dropdownMenus = dropdown.locator("ul.dropdown-menu li");
      const menuCount = await dropdownMenus.count();
      await expect(menuCount).toBeGreaterThanOrEqual(4);

      const dropdownOption1 = dropdownMenus.filter({ hasText: "Date" }).first();
      await dropdownOption1.click();

      const ascendingButton = page.locator(".order-options .fa-arrow-up");
      const descendingButton = page.locator(".order-options .fa-arrow-down");

      await ascendingButton.click();
      await expect(ascendingButton).toHaveClass(/selected/);
      await expect(descendingButton).not.toHaveClass(/selected/);

      await descendingButton.click();
      await expect(ascendingButton).not.toHaveClass(/selected/);
      await expect(descendingButton).toHaveClass(/selected/);
    });
  });

  test.describe("Unhappy path", () => {
    test("should handle filters with no matching results", async ({ page }) => {
      await page.route("**/api/search**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            hits: [],
            totalHits: 0,
            facets: { year: {}, tags: {} },
          }),
        });
      });

      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const noResults = page.locator('text="No results found"');
      await expect(noResults).toBeVisible();
    });

    test("should reset filters when clear all is clicked", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const yearCheckboxes = page.locator(".articles-hub-filters-year input[type='checkbox']");
      const count = await yearCheckboxes.count();
      await expect(count).toBeGreaterThanOrEqual(0);

      await yearCheckboxes.first().check();

      const clearButton = page.locator('button:has-text("Clear all years")');
      await expect(clearButton).toBeVisible();
      await clearButton.click();

      await expect(yearCheckboxes.first()).not.toBeChecked();
    });
  });
});
