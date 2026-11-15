import { test, expect } from "@playwright/test";
import { ROUTES } from "@/constants";

const ARTICLE_WITH_WIDE_BLOCKS = `${ROUTES.BLOGS_HUB.path}/how-to-manually-deploy-a-vuejs-and-fastapi-application`;

async function findOverflowingIndices(locator) {
  return locator.evaluateAll((elements) =>
    elements
      .map((el, index) => ({ index, overflows: el.scrollWidth > el.clientWidth }))
      .filter((item) => item.overflows)
      .map((item) => item.index)
  );
}

test.describe("Code wrapping", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(ARTICLE_WITH_WIDE_BLOCKS);
    await page.locator("pre.shiki").first().waitFor({ state: "visible" });
  });

  test("global Wrap code toggle wraps and unwraps wide code blocks and code outputs", async ({ page }) => {
    const shikiPres = page.locator("pre.shiki");
    const outputPres = page.locator("pre.code-output-container");

    const wideCodeIndices = await findOverflowingIndices(shikiPres);
    const wideOutputIndices = await findOverflowingIndices(outputPres);

    expect(wideCodeIndices.length).toBeGreaterThan(0);
    expect(wideOutputIndices.length).toBeGreaterThan(0);

    const wideCodePre = shikiPres.nth(wideCodeIndices[0]);
    const wideOutputPre = outputPres.nth(wideOutputIndices[0]);

    const wrapToggle = page.locator('label[for="wrap-code"]');
    await wrapToggle.scrollIntoViewIfNeeded();
    await wrapToggle.click();

    await expect(async () => {
      const codeOverflows = await wideCodePre.evaluate((el) => el.scrollWidth > el.clientWidth);
      const outputOverflows = await wideOutputPre.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(codeOverflows).toBe(false);
      expect(outputOverflows).toBe(false);
    }).toPass();

    await wrapToggle.click();

    await expect(async () => {
      const codeOverflows = await wideCodePre.evaluate((el) => el.scrollWidth > el.clientWidth);
      const outputOverflows = await wideOutputPre.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(codeOverflows).toBe(true);
      expect(outputOverflows).toBe(true);
    }).toPass();
  });

  test("per-block wrap button wraps only its block and hides controls after mouse leaves", async ({ page }) => {
    const shikiPres = page.locator("pre.shiki");
    const wideCodeIndices = await findOverflowingIndices(shikiPres);
    expect(wideCodeIndices.length).toBeGreaterThanOrEqual(2);

    const shikiContainers = page.locator(".code-container:has(pre.shiki)");
    const firstContainer = shikiContainers.nth(wideCodeIndices[0]);
    const secondContainer = shikiContainers.nth(wideCodeIndices[1]);

    const firstPre = firstContainer.locator("pre.shiki");
    const secondPre = secondContainer.locator("pre.shiki");
    const wrapButton = firstContainer.locator(".code-wrap-button");
    const copyButton = firstContainer.locator(".code-copy-button");

    await firstContainer.scrollIntoViewIfNeeded();
    await firstContainer.hover();
    await expect(wrapButton).toBeVisible();
    await expect(copyButton).toBeVisible();

    await wrapButton.click();
    await expect(firstContainer).toHaveClass(/wrapped/);
    await expect(secondContainer).not.toHaveClass(/wrapped/);

    const firstOverflows = await firstPre.evaluate((el) => el.scrollWidth > el.clientWidth);
    const secondOverflows = await secondPre.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(firstOverflows).toBe(false);
    expect(secondOverflows).toBe(true);

    // Moving the cursor off the block after clicking must hide the action buttons again.
    await page.mouse.move(0, 0);
    await expect(wrapButton).not.toHaveClass(/visible/);
    await expect(copyButton).not.toHaveClass(/visible/);

    // Flipping the global preference resets local per-block overrides.
    const wrapToggle = page.locator('label[for="wrap-code"]');
    await wrapToggle.scrollIntoViewIfNeeded();
    await wrapToggle.click();
    await expect(firstContainer).toHaveClass(/wrapped/);
    await expect(secondContainer).toHaveClass(/wrapped/);

    await wrapToggle.click();
    await expect(firstContainer).not.toHaveClass(/wrapped/);
    await expect(secondContainer).not.toHaveClass(/wrapped/);
  });
});
