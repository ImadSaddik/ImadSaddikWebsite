import { test, expect } from "@playwright/test";
import { ROUTES } from "@/constants";

test.describe("Navigation", () => {
  test.describe("Happy path", () => {
    test("should navigate to all main pages from navbar", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);

      await page.click('a.expanded-nav-bar-item:has-text("Blogs")');
      await expect(page).toHaveURL(ROUTES.BLOGS_HUB.path);
      await expect(page.locator("h1")).toContainText("Blogs hub");
      await expect(page).toHaveTitle("Blogs by Imad Saddik");

      await page.click('a.expanded-nav-bar-item:has-text("Courses")');
      await expect(page).toHaveURL(ROUTES.COURSES_HUB.path);
      await expect(page.locator("h1")).toContainText("Courses hub");
      await expect(page).toHaveTitle("Courses by Imad Saddik");

      await page.click('a.expanded-nav-bar-item:has-text("Astronomy")');
      await expect(page).toHaveURL(ROUTES.ASTRONOMY_HUB.path);
      await expect(page.locator("h1")).toContainText("Astronomy hub");
      await expect(page).toHaveTitle("Astronomy with Imad Saddik");

      await page.click('a.expanded-nav-bar-item:has-text("About me")');
      await expect(page).toHaveURL(ROUTES.ABOUT_ME.path);
      await expect(page).toHaveTitle("About Imad Saddik");

      await page.click('a.expanded-nav-bar-item:has-text("Hire me")');
      await expect(page).toHaveURL(ROUTES.HIRE_ME.path);
      await expect(page).toHaveTitle("Hire Imad Saddik");

      await page.click('a.nav-bar-home:has-text("Imad Saddik")');
      await expect(page).toHaveURL(ROUTES.HOME.path);
      await expect(page).toHaveTitle("Imad Saddik");
    });

    test("should navigate using footer links", async ({ page }) => {
      await page.goto(ROUTES.HOME.path);
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("Home")').click();
      await expect(page).toHaveURL(ROUTES.HOME.path);

      await page.goto(ROUTES.HOME.path);
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("Blogs")').click();
      await expect(page).toHaveURL(ROUTES.BLOGS_HUB.path);

      await page.goto(ROUTES.HOME.path);
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("Courses")').click();
      await expect(page).toHaveURL(ROUTES.COURSES_HUB.path);

      await page.goto(ROUTES.HOME.path);
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("Astronomy")').click();
      await expect(page).toHaveURL(ROUTES.ASTRONOMY_HUB.path);

      await page.goto(ROUTES.HOME.path);
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("About me")').click();
      await expect(page).toHaveURL(ROUTES.ABOUT_ME.path);

      await page.goto(ROUTES.HOME.path);
      await page.locator(".footer-container").scrollIntoViewIfNeeded();
      await page.locator('.footer-column a:has-text("Hire me")').click();
      await expect(page).toHaveURL(ROUTES.HIRE_ME.path);
    });

    test("should highlight current page in navbar for all main pages", async ({ page }) => {
      const navItems = [
        { label: "Blogs", url: ROUTES.BLOGS_HUB.path },
        { label: "Courses", url: ROUTES.COURSES_HUB.path },
        { label: "Astronomy", url: ROUTES.ASTRONOMY_HUB.path },
        { label: "About me", url: ROUTES.ABOUT_ME.path },
        { label: "Hire me", url: ROUTES.HIRE_ME.path },
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
      await expect(page).toHaveURL(ROUTES.HOME.path);
    });

    test("should redirect invalid blog slug to 404 page", async ({ page }) => {
      await page.goto(`${ROUTES.BLOGS_HUB.path}/this-blog-does-not-exist-at-all`);
      await expect(page).toHaveURL(ROUTES.HOME.path);
    });

    test("should redirect invalid course slug to 404 page", async ({ page }) => {
      await page.goto(`${ROUTES.COURSES_HUB.path}/invalid-course-slug-12345`);

      await expect(page).toHaveURL(ROUTES.HOME.path);
    });

    test("should redirect invalid astronomy slug to 404 page", async ({ page }) => {
      await page.goto(`${ROUTES.ASTRONOMY_HUB.path}/non-existent-astronomy-article`);

      await expect(page).toHaveURL(ROUTES.HOME.path);
    });
  });
});
