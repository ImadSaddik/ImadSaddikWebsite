import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.describe("Happy path", () => {
    test("should navigate to all main pages from navbar", async ({ page }) => {
      await page.goto("/");

      await page.click('a.expanded-nav-bar-item:has-text("Blogs")');
      await expect(page).toHaveURL("/blogs");
      await expect(page.locator("h1")).toContainText("Blogs hub");
      await expect(page).toHaveTitle("Blogs by Imad Saddik");

      await page.click('a.expanded-nav-bar-item:has-text("Courses")');
      await expect(page).toHaveURL("/courses");
      await expect(page.locator("h1")).toContainText("Courses hub");
      await expect(page).toHaveTitle("Courses by Imad Saddik");

      await page.click('a.expanded-nav-bar-item:has-text("Astronomy")');
      await expect(page).toHaveURL("/astronomy");
      await expect(page.locator("h1")).toContainText("Astronomy hub");
      await expect(page).toHaveTitle("Astronomy with Imad Saddik");

      await page.click('a.expanded-nav-bar-item:has-text("About me")');
      await expect(page).toHaveURL("/about-me");
      await expect(page).toHaveTitle("About Imad Saddik");

      await page.click('a.expanded-nav-bar-item:has-text("Hire me")');
      await expect(page).toHaveURL("/hire-me");
      await expect(page).toHaveTitle("Hire Imad Saddik");

      await page.click('a.nav-bar-home:has-text("Imad Saddik")');
      await expect(page).toHaveURL("/");
      await expect(page).toHaveTitle("Imad Saddik");
    });

    test("should navigate using footer links", async ({ page }) => {
      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("Home")').click();
      await expect(page).toHaveURL("/");

      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("Blogs")').click();
      await expect(page).toHaveURL("/blogs");

      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("Courses")').click();
      await expect(page).toHaveURL("/courses");

      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("Astronomy")').click();
      await expect(page).toHaveURL("/astronomy");

      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("About me")').click();
      await expect(page).toHaveURL("/about-me");

      await page.goto("/");
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("Hire me")').click();
      await expect(page).toHaveURL("/hire-me");
    });

    test("should highlight current page in navbar for all main pages", async ({ page }) => {
      const navItems = [
        { label: "Blogs", url: "/blogs" },
        { label: "Courses", url: "/courses" },
        { label: "Astronomy", url: "/astronomy" },
        { label: "About me", url: "/about-me" },
        { label: "Hire me", url: "/hire-me" },
      ];

      for (const { label, url } of navItems) {
        await page.goto(url);
        await page.waitForLoadState("networkidle");

        for (const { label: checkLabel } of navItems) {
          const link = page.locator(`a.expanded-nav-bar-item:has-text("${checkLabel}")`);
          if (checkLabel === label) {
            await expect(link).toHaveClass(/selected/);
          } else {
            await expect(link).not.toHaveClass(/selected/);
          }
        }
      }
    });
  });

  test.describe("Unhappy path", () => {
    test("should display 404 page for non-existent routes", async ({ page }) => {
      await page.goto("/this-page-does-not-exist");

      await expect(page).toHaveTitle("Page not found");
      await expect(page.locator(".not-found-page-container p")).toContainText(
        "The page you are looking for does not exist"
      );
    });

    test("should provide a link back to home from 404 page", async ({ page }) => {
      await page.goto("/random-invalid-page-12345");

      const homeLink = page.locator('a:has-text("Go back to home")');
      await expect(homeLink).toBeVisible();
      await homeLink.click();
      await expect(page).toHaveURL("/");
    });

    test("should redirect invalid blog slug to blogs hub", async ({ page }) => {
      await page.goto("/blogs/this-blog-does-not-exist-at-all");
      await expect(page).toHaveURL("/blogs");
    });

    test("should redirect invalid course slug to courses hub", async ({ page }) => {
      await page.goto("/courses/invalid-course-slug-12345");

      await expect(page).toHaveURL("/courses");
    });

    test("should redirect invalid astronomy slug to astronomy hub", async ({ page }) => {
      await page.goto("/astronomy/non-existent-astronomy-article");

      await expect(page).toHaveURL("/astronomy");
    });
  });
});
