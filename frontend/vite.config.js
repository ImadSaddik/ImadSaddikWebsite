import vue from "@vitejs/plugin-vue";
import Markdown from "unplugin-vue-markdown/vite";
import Components from "unplugin-vue-components/vite";

import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import { getMarkdownTransformers } from "./vite/markdown/index.js";

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
          tags: {
            video: ["src", "poster"],
            source: ["src"],
            img: ["src"],
            image: ["xlink:href", "href"],
            use: ["xlink:href", "href"],
            // By adding 'ImageWithCaption' here, Vite knows to resolve the 'image-src' attribute
            // as a file path. This addition ensures images in Markdown articles load correctly.
            ImageWithCaption: ["image-src"],
            InlineIcon: ["icon"],
          },
        },
      },
    }),
    Markdown({
      headEnabled: false,
      markdownItSetup(markdownItInstance) {
        getMarkdownTransformers().forEach((plugin) => markdownItInstance.use(plugin));
      },
    }),
    Components({
      dts: true,
      dirs: ["src/components"],
      extensions: ["vue", "md"],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
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
