import vue from "@vitejs/plugin-vue";
import Markdown from "unplugin-vue-markdown/vite";

import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import { getMarkdownTransformers } from "./vite/markdown/index.js";

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      headEnabled: false,
      markdownItSetup(markdownItInstance) {
        getMarkdownTransformers().forEach((plugin) => {
          markdownItInstance.use(plugin);
        });
      },
    }),
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
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{js,ts,jsx,tsx}"],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
