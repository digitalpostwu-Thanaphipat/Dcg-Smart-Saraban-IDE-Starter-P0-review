/**
 * Playwright skeleton for DCS-P1-001 (Phase 1 mock).
 * Do NOT set Staging/Production Web App URLs here.
 * Install `@playwright/test` and run e2e only after Gate S when approved.
 */
const config = {
  testDir: "apps-script/tests/e2e",
  fullyParallel: true,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:9",
    trace: "off" as const,
  },
};

export default config;
