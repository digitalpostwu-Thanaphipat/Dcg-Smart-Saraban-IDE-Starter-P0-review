import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@server": path.resolve(__dirname, "apps-script/server"),
    },
  },
  test: {
    environment: "node",
    include: ["apps-script/tests/unit/**/*.test.ts"],
    globals: true,
  },
});
