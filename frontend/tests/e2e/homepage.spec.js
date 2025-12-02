import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.describe("Happy path", () => {
    test("should load and display the homepage correctly", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveTitle("Imad Saddik");
    });

    test("should display the hero section", async ({ page }) => {
      await page.goto("/");

      const heroSection = page.locator(".hero-section, .hero-container").first();
      await expect(heroSection).toBeVisible();
    });

    test("should display the navbar with all navigation items", async ({ page }) => {
      await page.goto("/");

      const navbar = page.locator(".navbar-container");
      await expect(navbar).toBeVisible();

      await expect(page.locator('a.expanded-nav-bar-item:has-text("Blogs")')).toBeVisible();
      await expect(page.locator('a.expanded-nav-bar-item:has-text("Courses")')).toBeVisible();
      await expect(page.locator('a.expanded-nav-bar-item:has-text("Astronomy")')).toBeVisible();
      await expect(page.locator('a.expanded-nav-bar-item:has-text("About me")')).toBeVisible();
      await expect(page.locator('a.expanded-nav-bar-item:has-text("Hire me")')).toBeVisible();
    });

    test("should display the footer section", async ({ page }) => {
      await page.goto("/");

      const footer = page.locator(".footer-container");
      await expect(footer).toBeVisible();

      await expect(page.locator('.footer-column-title:has-text("Explore")')).toBeVisible();
      await expect(page.locator('.footer-column-title:has-text("Connect")')).toBeVisible();
      await expect(page.locator('.footer-column-title:has-text("Built with")')).toBeVisible();
      await expect(page.locator('.footer-column-title:has-text("Contact")')).toBeVisible();
      await expect(page.locator('.footer-column-title:has-text("Preferences")')).toBeVisible();
    });

    test("should display card groups for blogs, courses and astronomy", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const blogsGroup = page.locator('.cards-group-container:has-text("Blogs")').first();
      await expect(blogsGroup).toBeVisible();
      await expect(blogsGroup.locator(".card-container")).toHaveCount(3);

      const coursesGroup = page.locator('.cards-group-container:has-text("Courses")').first();
      await expect(coursesGroup).toBeVisible();
      await expect(coursesGroup.locator(".card-container")).toHaveCount(3);

      const universeGroup = page.locator('.cards-group-container:has-text("Universe")').first();
      await expect(universeGroup).toBeVisible();
      await expect(universeGroup.locator(".card-container")).toHaveCount(3);
    });

    test("should have working call to action buttons", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const buttonsToTest = [
        { text: "Explore articles", url: "/blogs" },
        { text: "View courses", url: "/courses" },
        { text: "Read my full story", url: "/about-me" },
        { text: "View all blogs", url: "/blogs" },
        { text: "View all courses", url: "/courses" },
        { text: "View all images", url: "/astronomy" },
      ];

      for (const { text, url } of buttonsToTest) {
        const button = page.locator(`button:has-text("${text}")`).first();
        await button.scrollIntoViewIfNeeded();
        await expect(button).toBeVisible(); // Wait for button to appear
        await button.click();
        await expect(page).toHaveURL(url);
        await page.goto("/");
        await page.waitForLoadState("networkidle");
      }
    });
  });

  test.describe("Unhappy path", () => {
    test("should handle missing API gracefully", async ({ page }) => {
      await page.route("**/api/**", (route) => route.abort());

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const blogsGroup = page.locator('.cards-group-container:has-text("Blogs")').first();
      const coursesGroup = page.locator('.cards-group-container:has-text("Courses")').first();
      const universeGroup = page.locator('.cards-group-container:has-text("Universe")').first();

      await expect(blogsGroup.locator(".card-container")).toHaveCount(0);
      await expect(coursesGroup.locator(".card-container")).toHaveCount(0);
      await expect(universeGroup.locator(".card-container")).toHaveCount(0);

      const toasts = page.locator(".toast-message");
      await expect(toasts).toHaveCount(3);
    });
  });
});
