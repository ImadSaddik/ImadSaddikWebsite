import { test, expect } from "@playwright/test";

test.describe("User Preferences", () => {
  test.describe("Happy path", () => {
    test("should display preferences section in footer", async ({ page }) => {
      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();

      const preferencesTitle = page.locator('.footer-column-title:has-text("Preferences")');
      await expect(preferencesTitle).toBeVisible();
    });

    test("should have toggle for star effect", async ({ page }) => {
      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();

      const starEffectToggle = page.locator('label:has-text("Star effect"), #star-effect');
      await expect(starEffectToggle.first()).toBeVisible();
    });

    test("should persist star effect preference", async ({ page }) => {
      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();

      const starEffectCheckbox = page.locator("#star-effect");
      const starEffectLabel = page.locator('label[for="star-effect"]');
      if (await starEffectLabel.isVisible()) {
        const wasChecked = await starEffectCheckbox.isChecked();
        await starEffectLabel.click();

        await page.reload();
        await page.locator(".footer-container").scrollIntoViewIfNeeded();

        const newState = await starEffectCheckbox.isChecked();
        expect(newState).toBe(!wasChecked);

        await starEffectLabel.click();
      }
    });

    test("should have toggle for meteorite effect", async ({ page }) => {
      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();

      const meteoriteToggle = page.locator('label:has-text("Meteorite effect"), #meteorite-effect');
      await expect(meteoriteToggle.first()).toBeVisible();
    });

    test("should persist meteorite effect preference", async ({ page }) => {
      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();

      const meteoriteEffectCheckbox = page.locator("#meteorite-effect");
      const meteoriteEffectLabel = page.locator('label[for="meteorite-effect"]');
      if (await meteoriteEffectLabel.isVisible()) {
        const wasChecked = await meteoriteEffectCheckbox.isChecked();
        await meteoriteEffectLabel.click();

        await page.reload();
        await page.locator(".footer-container").scrollIntoViewIfNeeded();

        const newState = await meteoriteEffectCheckbox.isChecked();
        expect(newState).toBe(!wasChecked);

        await meteoriteEffectLabel.click();
      }
    });

    test("should have toggle for custom cursor", async ({ page }) => {
      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();

      const cursorToggle = page.locator('label:has-text("Custom cursor"), #custom-cursor');
      await expect(cursorToggle.first()).toBeVisible();
    });

    test("should persist custom cursor preference", async ({ page }) => {
      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();

      const customCursorCheckbox = page.locator("#custom-cursor");
      const customCursorLabel = page.locator('label[for="custom-cursor"]');
      if (await customCursorLabel.isVisible()) {
        const wasChecked = await customCursorCheckbox.isChecked();
        await customCursorLabel.click();

        await page.reload();
        await page.locator(".footer-container").scrollIntoViewIfNeeded();

        const newState = await customCursorCheckbox.isChecked();
        expect(newState).toBe(!wasChecked);

        await customCursorLabel.click();
      }
    });

    test("should update body class when custom cursor is toggled", async ({ page }) => {
      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();

      const cursorCheckbox = page.locator("#custom-cursor");
      const cursorLabel = page.locator('label[for="custom-cursor"]');
      if (await cursorLabel.isVisible()) {
        const wasChecked = await cursorCheckbox.isChecked();
        await cursorLabel.click();

        const body = page.locator("body");
        if (wasChecked) {
          await expect(body).not.toHaveClass(/custom-cursor/);
        } else {
          await expect(body).toHaveClass(/custom-cursor/);
        }

        await cursorLabel.click();
      }
    });
  });

  test.describe("Unhappy path", () => {
    test("should load website even if localStorage is unavailable", async ({ page, context }) => {
      await context.addInitScript(() => {
        Object.defineProperty(window, "localStorage", {
          value: {
            getItem: () => null,
            setItem: () => {
              throw new Error("localStorage is not available");
            },
            removeItem: () => {},
            clear: () => {},
          },
          writable: true,
        });
      });

      await page.goto("/");
    });

    test("should use default preferences when localStorage is empty", async ({ page, context }) => {
      await context.addInitScript(() => {
        localStorage.clear();
      });

      await page.goto("/");
      const starEffectCheckbox = page.locator("#star-effect");
      const meteoriteEffectCheckbox = page.locator("#meteorite-effect");
      const customCursorCheckbox = page.locator("#custom-cursor");

      await expect(starEffectCheckbox).toBeChecked();
      await expect(meteoriteEffectCheckbox).toBeChecked();
      await expect(customCursorCheckbox).toBeChecked();
    });
  });
});
