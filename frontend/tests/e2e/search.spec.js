import { test, expect } from "@playwright/test";
import { ROUTES } from "@/constants";

test.describe("Search functionality", () => {
  test.describe("Happy path", () => {
    test("should display search bar on blogs hub", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchBar = page.locator(".search-bar");
      await expect(searchBar).toBeVisible();

      const searchInput = page.locator(".search-input");
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute("placeholder", /What blogs are you curious about today?/);
    });

    test("should display search bar on courses hub", async ({ page }) => {
      await page.goto(ROUTES.COURSES_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchBar = page.locator(".search-bar");
      await expect(searchBar).toBeVisible();

      const searchInput = page.locator(".search-input");
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute("placeholder", /What courses are you curious about today?/);
    });

    test("should display search bar on astronomy hub", async ({ page }) => {
      await page.goto(ROUTES.ASTRONOMY_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchBar = page.locator(".search-bar");
      await expect(searchBar).toBeVisible();

      const searchInput = page.locator(".search-input");
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute("placeholder", /What astronomy articles are you curious about today?/);
    });

    test("should allow typing in search bar", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchInput = page.locator(".search-input");
      await searchInput.fill("python");

      await expect(searchInput).toHaveValue("python");
    });

    test("should show clear and search buttons when text is entered", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchInput = page.locator(".search-input");

      await expect(page.locator(".search-clear")).not.toBeVisible();
      await expect(page.locator(".search-send")).not.toBeVisible();

      await searchInput.fill("test query");

      await expect(page.locator(".search-clear")).toBeVisible();
      await expect(page.locator(".search-send")).toBeVisible();
    });

    test("should clear search when clear button is clicked", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchInput = page.locator(".search-input");
      await searchInput.fill("test query");

      const clearButton = page.locator(".search-clear");
      await clearButton.click();

      await expect(searchInput).toHaveValue("");
    });

    test("should trigger search on Enter key", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchInput = page.locator(".search-input");
      await searchInput.fill("Half-life 3");
      await searchInput.press("Enter");

      const noResults = page.locator('text="No results found"');
      await expect(noResults).toBeVisible();
    });

    test("should trigger search on search button click", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchInput = page.locator(".search-input");
      await searchInput.fill("Half-life 3");

      const searchButton = page.locator(".search-send");
      await searchButton.click();

      const noResults = page.locator('text="No results found"');
      await expect(noResults).toBeVisible();
    });
  });

  test.describe("Unhappy path", () => {
    test("should handle empty search gracefully", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchInput = page.locator(".search-input");
      await searchInput.press("Enter");

      await expect(searchInput).toBeFocused();
      await expect(searchInput).toHaveValue("");
    });

    test("should handle search with no results", async ({ page }) => {
      await page.route("**/api/search**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ hits: [], totalHits: 0 }),
        });
      });

      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchInput = page.locator(".search-input");
      await searchInput.fill("Half-life 3");
      await searchInput.press("Enter");

      const noResults = page.locator('text="No results found"');
      await expect(noResults).toBeVisible();
    });

    test("should handle API error during search gracefully", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      await page.route("**/api/search**", (route) => route.abort());

      const searchInput = page.locator(".search-input");
      await searchInput.fill("Half-life 3");
      await searchInput.press("Enter");

      const toasts = page.locator(".toast-message");
      await expect(toasts).toHaveCount(1);
    });

    test("should handle special characters in search", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchInput = page.locator(".search-input");
      await searchInput.fill('<script>alert("xss")</script>');

      await expect(searchInput).toHaveValue('<script>alert("xss")</script>');

      await searchInput.press("Enter");
      await expect(page.locator(".articles-hub-container")).toBeVisible();

      const noResults = page.locator('text="No results found"');
      await expect(noResults).toBeVisible();
    });

    test("should handle very long search queries", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchInput = page.locator(".search-input");
      const longQuery = "a".repeat(500);
      await searchInput.fill(longQuery);

      await searchInput.press("Enter");
      await expect(page.locator(".articles-hub-container")).toBeVisible();

      const noResults = page.locator('text="No results found"');
      await expect(noResults).toBeVisible();
    });
  });
});
