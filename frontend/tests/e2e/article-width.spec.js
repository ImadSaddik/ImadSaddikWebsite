import { test, expect } from "@playwright/test";

async function getWidthPercentage(page, childSelector, parentSelector) {
  const child = page.locator(childSelector);
  const parent = page.locator(parentSelector);

  const childWidth = await child.evaluate((el) => el.getBoundingClientRect().width);
  const parentAvailableWidth = await parent.evaluate((el) => {
    const style = window.getComputedStyle(el);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    return el.offsetWidth - padding - border;
  });

  return (childWidth / parentAvailableWidth) * 100;
}

test.describe("Article width", () => {
  const safetyMargin = 5;
  const tableOfContentsSelector = ".table-of-contents-container";
  const pagesToTest = [
    {
      name: "Hire me page",
      url: "/hire-me",
      contentSelector: ".hire-me-content",
      parentSelector: ".hire-me-container",
    },
    {
      name: "About me page",
      url: "/about-me",
      contentSelector: ".about-me-full-story-content",
      parentSelector: ".about-me-full-story-container",
    },
    {
      name: "Article page",
      url: "/blogs/ElasticsearchPreFilteringWithKnnSearch",
      contentSelector: ".article-body",
      parentSelector: ".article-body-wrapper",
    },
  ];

  test.describe("Wide screen", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    for (const { name, url, contentSelector, parentSelector } of pagesToTest) {
      test(`${name} - Layout toggles between 50/50 and 75/25 correctly`, async ({ page }) => {
        await page.goto(url);
        await page.waitForLoadState("networkidle");

        // Default state: Expect approximately 50% / 50%
        let contentPercentage = await getWidthPercentage(page, contentSelector, parentSelector);
        let tocPercentage = await getWidthPercentage(page, tableOfContentsSelector, parentSelector);

        expect(contentPercentage).toBeGreaterThan(50 - safetyMargin);
        expect(contentPercentage).toBeLessThan(50 + safetyMargin);
        expect(tocPercentage).toBeGreaterThan(50 - safetyMargin);
        expect(tocPercentage).toBeLessThan(50 + safetyMargin);

        const wideToggle = page.locator('label[for="wide-articles"]');
        await wideToggle.click();
        await page.waitForTimeout(500);

        // Wide state: Expect approximately 75% / 25%
        contentPercentage = await getWidthPercentage(page, contentSelector, parentSelector);
        tocPercentage = await getWidthPercentage(page, tableOfContentsSelector, parentSelector);

        expect(contentPercentage).toBeGreaterThan(75 - safetyMargin);
        expect(contentPercentage).toBeLessThan(75 + safetyMargin);

        expect(tocPercentage).toBeGreaterThan(25 - safetyMargin);
        expect(tocPercentage).toBeLessThan(25 + safetyMargin);
      });
    }
  });

  test.describe("Medium screen", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
    });

    for (const { name, url, contentSelector, parentSelector } of pagesToTest) {
      test(`${name} - Layout is fixed at ~65/35 regardless of toggle`, async ({ page }) => {
        await page.goto(url);
        await page.waitForLoadState("networkidle");

        // Expect approximately 65% / 35%
        const contentPercentage = await getWidthPercentage(page, contentSelector, parentSelector);
        const tocPercentage = await getWidthPercentage(page, tableOfContentsSelector, parentSelector);

        expect(contentPercentage).toBeGreaterThan(65 - safetyMargin);
        expect(contentPercentage).toBeLessThan(65 + safetyMargin);
        expect(tocPercentage).toBeGreaterThan(35 - safetyMargin);
        expect(tocPercentage).toBeLessThan(35 + safetyMargin);
      });
    }
  });

  test.describe("Small screen", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    for (const { name, url, contentSelector } of pagesToTest) {
      test(`${name} - TOC is hidden and content is full width`, async ({ page }) => {
        await page.goto(url);

        const toc = page.locator(tableOfContentsSelector);
        await expect(toc).toBeHidden();

        const contentWidth = await page.locator(contentSelector).evaluate((el) => el.getBoundingClientRect().width);
        const viewportWidth = 375;

        // Ensure content takes up at least 80% of the viewport (accounting for padding)
        expect(contentWidth).toBeGreaterThan(viewportWidth * 0.8);
      });
    }
  });
});
