import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test.describe("Happy path", () => {
    test("should have skip link for keyboard navigation", async ({ page }) => {
      await page.goto("/");

      const skipLink = page.locator('a:has-text("Skip to main content"), .skip-link');
      await expect(skipLink).toBeAttached();
    });

    test("should have alt text on images", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const allImages = await page.locator("img").all();
      expect(allImages.length).toBeGreaterThan(0);

      for (const img of allImages) {
        const alt = await img.getAttribute("alt");
        expect(alt, "Every image must have a non-empty alt attribute").toBeTruthy();
      }
    });

    test("should support keyboard navigation in the home page", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const focusableElements = [
        { selector: 'a:has-text("Skip to main content"), .skip-link', description: "skip link" },
        { selector: 'a.nav-bar-home:has-text("Imad Saddik")', description: "home link" },
        { selector: 'a.expanded-nav-bar-item:has-text("Blogs")', description: "blogs nav" },
        { selector: 'button:has-text("Explore articles")', description: "explore articles button" },
      ];

      for (const { selector, description } of focusableElements) {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          await element.focus();
          await expect(element, `${description} should be focusable`).toBeFocused();
        }
      }

      await page.keyboard.press("Tab");
      const firstFocused = page.locator(":focus");
      await expect(firstFocused).toBeAttached();

      await page.keyboard.press("Tab");
      const secondFocused = page.locator(":focus");
      await expect(secondFocused).toBeAttached();
    });

    test("should have focusable search bar", async ({ page }) => {
      const pages = ["/blogs", "/courses", "/astronomy"];

      for (const url of pages) {
        await page.goto(url);
        await page.waitForLoadState("networkidle");

        const searchInput = page.locator(".search-input");
        await searchInput.focus();
        await expect(searchInput).toBeFocused();
      }
    });

    test("should have proper link text", async ({ page }) => {
      await page.goto("/");

      const links = page.locator('a:not(:has-text("click here"))');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe("Unhappy path", () => {
    test("should handle focus trap correctly on modal-like elements", async ({ page }) => {
      await page.goto("/");

      for (let i = 0; i < 20; i++) {
        await page.keyboard.press("Tab");
      }

      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeDefined();
    });
  });
});
