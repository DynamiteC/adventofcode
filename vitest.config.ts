import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@utils": fileURLToPath(new URL("./src/utils/index.ts", import.meta.url)),
      "@utils/": fileURLToPath(new URL("./src/utils/", import.meta.url)),
    },
  },
  test: {
    include: ["days/**/*.test.ts", "src/**/*.test.ts"],
    environment: "node",
  },
});
