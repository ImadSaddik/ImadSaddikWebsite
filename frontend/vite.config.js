import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    vue(),
    {
      name: "vite-plugin-md-raw",
      transform(code, id) {
        if (id.endsWith(".md")) {
          return {
            code: `export default ${JSON.stringify(code)}`,
            map: null,
          };
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8080,
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{js,ts,jsx,tsx}"],
    coverage: {
      enabled: true,
      provider: "v8",
    },
  },
});
