import { test, expect } from "@playwright/test";
import { ROUTES } from "@/constants";

test.describe("Responsive Design", () => {
  test.describe("Mobile view", () => {
    test.use({ viewport: { width: 375, height: 1080 } });

    test("should display hamburger menu on mobile", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);

      const hamburgerMenu = page.locator(".nav-menu");
      await expect(hamburgerMenu).toBeVisible();
    });

    test("should open mobile navigation menu when hamburger is clicked", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);

      const hamburgerMenu = page.locator(".nav-menu");
      await hamburgerMenu.click();

      const collapsedNav = page.locator(".collapsed-nav-bar");
      await expect(collapsedNav).toBeVisible();
    });

    test("should close mobile menu when navigation item is clicked", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);

      const hamburgerMenu = page.locator(".nav-menu");
      await hamburgerMenu.click();

      const blogsLink = page.locator('.collapsed-nav-bar-item:has-text("Blogs")');
      await blogsLink.click();

      const collapsedNav = page.locator(".collapsed-nav-bar");
      await expect(collapsedNav).not.toBeVisible();

      await expect(page).toHaveURL(ROUTES.BLOGS_HUB.path);
    });

    test("should toggle hamburger icon between bars and X", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);

      const hamburgerMenu = page.locator(".nav-menu");

      await expect(page.locator(".nav-menu .fa-bars")).toBeVisible();
      await expect(page.locator(".nav-menu .fa-xmark")).not.toBeVisible();

      await hamburgerMenu.click();

      await expect(page.locator(".nav-menu .fa-bars")).not.toBeVisible();
      await expect(page.locator(".nav-menu .fa-xmark")).toBeVisible();

      await hamburgerMenu.click();

      await expect(page.locator(".nav-menu .fa-bars")).toBeVisible();
    });

    test("should display footer correctly on mobile", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);

      const footer = page.locator(".footer-container");
      await footer.scrollIntoViewIfNeeded();

      await expect(footer).toBeVisible();
    });

    test("should display search bar correctly on mobile", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      const searchBar = page.locator(".search-bar");
      await expect(searchBar).toBeVisible();

      const searchInput = page.locator(".search-input");
      await searchInput.fill("test");
      await expect(searchInput).toHaveValue("test");
    });

    test("should hide moon and landscape images on mobile", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);
      await expect(page.locator(".moon-image")).toBeHidden();
      await expect(page.locator(".landscape-image")).toBeHidden();
    });
  });

  test.describe("Tablet view", () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test("should display page correctly on tablet", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);

      await expect(page.locator(".navbar-container")).toBeVisible();
      await expect(page.locator(".footer-container")).toBeVisible();
    });

    test("should display articles hub correctly on tablet", async ({ page }) => {
      await page.goto(ROUTES.BLOGS_HUB.path);
      await page.waitForLoadState("networkidle");

      await expect(page.locator(".articles-hub-container")).toBeVisible();
      await expect(page.locator(".search-bar")).toBeVisible();
    });
  });

  test.describe("Desktop view", () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test("should hide hamburger menu on desktop", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);

      const hamburgerMenu = page.locator(".nav-menu");
      await expect(hamburgerMenu).toBeHidden();
    });

    test("should display expanded navbar on desktop", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);

      const navItems = ["Blogs", "Courses", "Astronomy", "About me", "Hire me"];
      for (const item of navItems) {
        await expect(page.locator(`a.expanded-nav-bar-item:has-text("${item}")`)).toBeVisible();
      }
    });

    test("should show moon and landscape images on desktop", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);
      await expect(page.locator(".moon-image")).toBeVisible();
      await expect(page.locator(".landscape-image")).toBeVisible();
    });

    test("should display moon illumination tooltip on hover", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);

      const moonWrapper = page.locator(".moon-wrapper");
      const tooltip = page.locator(".moon-tooltip");

      await moonWrapper.scrollIntoViewIfNeeded();
      await expect(tooltip).not.toBeVisible();

      await moonWrapper.hover();

      await expect(tooltip).toBeVisible();
      await expect(tooltip).toHaveText(/Illumination: \d+%/);
    });
  });

  test.describe("Unhappy path", () => {
    test("should handle very small viewport", async ({ page }) => {
      await page.setViewportSize({ width: 280, height: 480 });
      await page.goto(ROUTES.HOME.path);

      await expect(page.locator(".navbar-container")).toBeVisible();
    });

    test("should handle very large viewport", async ({ page }) => {
      await page.setViewportSize({ width: 3840, height: 2160 });

      await page.goto(ROUTES.HOME.path);

      await expect(page.locator(".navbar-container")).toBeVisible();
      await expect(page.locator(".footer-container")).toBeVisible();
    });

    test("should handle viewport resize", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(ROUTES.HOME.path);

      await expect(page.locator(".nav-menu")).toBeHidden();

      await page.setViewportSize({ width: 375, height: 667 });

      await expect(page.locator(".nav-menu")).toBeVisible();

      await page.setViewportSize({ width: 1920, height: 1080 });

      await expect(page.locator(".nav-menu")).toBeHidden();
    });
  });
});
