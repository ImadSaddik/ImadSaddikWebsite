import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: undefined,
  reporter: process.env.CI ? [["list"], ["github"]] : "html",
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],

  webServer: {
    command: "pnpm run dev",
    url: process.env.BASE_URL || "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
