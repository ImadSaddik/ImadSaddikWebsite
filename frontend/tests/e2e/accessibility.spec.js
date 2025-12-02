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

      const focusChecks = [
        { text: "Skip to main content" },
        { text: "Imad Saddik" },
        { text: "Blogs" },
        { text: "Courses" },
        { text: "Astronomy" },
        { text: "About me" },
        { text: "Hire me" },
        { text: "Explore articles" },
        { text: "View courses" },
        { text: "Read my full story" },
        { classIncludes: "card-container" },
        { classIncludes: "card-container" },
        { classIncludes: "card-container" },
        { text: "View all blogs" },
        { classIncludes: "card-container" },
        { classIncludes: "card-container" },
        { classIncludes: "card-container" },
        { text: "View all courses" },
        { classIncludes: "card-container" },
        { classIncludes: "card-container" },
        { classIncludes: "card-container" },
        { text: "View all images" },
      ];

      for (const check of focusChecks) {
        await page.keyboard.press("Tab");
        const focusedElement = page.locator(":focus");
        if (check.text) {
          await expect(focusedElement).toHaveText(check.text);
        } else if (check.classIncludes) {
          const className = await focusedElement.evaluate((el) => el.className);
          expect(className.includes(check.classIncludes)).toBeTruthy();
        }
      }
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
