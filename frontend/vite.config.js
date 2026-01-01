import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    vue(),
    markdownRawPlugin(),
    visualizer({
      title: "Bundle visualizer",
      filename: "./stats.json",
      template: "raw-data",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("shiki") || id.includes("@shikijs")) {
            return "vendor-shiki";
          }

          if (id.includes("node_modules")) {
            if (id.includes("vue") || id.includes("vue-router") || id.includes("@vue")) {
              return "vendor-vue";
            }
            return "vendor-libs";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8080,
  },
  preview: {
    port: 8080,
    cors: {
      origin: ["http://localhost:8080"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    },
    headers: {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' http://localhost:8000 https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{js,ts,jsx,tsx}"],
  },
});

function markdownRawPlugin() {
  return {
    name: "vite-plugin-md-raw",
    transform(code, id) {
      if (id.endsWith(".md")) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null,
        };
      }
    },
  };
}
