import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Resvg } from "@resvg/resvg-js";
import matter from "gray-matter";
import { DIRECTORY_MAPPING } from "./src/constants/content.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOSTNAME = "https://imadsaddik.com";
const SITE_AUTHOR = "Imad Saddik";
const DEFAULT_OG_IMAGE = `${HOSTNAME}/og-image.png`;
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 675;

const CONTENT_FILE = "content.md";
const COVER_SVG_FILE = "coverImage.svg";
const OUTPUT_PNG_FILE = "og-image.png";
const INDEX_HTML_FILE = "index.html";

function main() {
  const distDir = join(__dirname, "dist");
  const distIndexHtml = join(distDir, INDEX_HTML_FILE);

  if (!existsSync(distIndexHtml)) {
    console.error(`✗ Error: ${INDEX_HTML_FILE} does not exist in dist/. Run 'vite build' first.`);
    process.exit(1);
  }

  const startTime = performance.now();
  const templateHtml = readFileSync(distIndexHtml, "utf-8");

  let totalArticles = 0;
  for (const section of Object.values(DIRECTORY_MAPPING)) {
    totalArticles += processArticleSection(section, templateHtml, distDir);
  }

  const elapsed = (performance.now() - startTime).toFixed(1);
  console.log(`✓ Generated ${totalArticles} article OG images and HTML shells in ${elapsed}ms`);
}

function processArticleSection(sectionName, templateHtml, distDir) {
  const sourceDir = join(__dirname, "src", sectionName);
  if (!existsSync(sourceDir)) return 0;

  const slugs = getSubdirectories(sourceDir);
  let processedCount = 0;

  for (const slug of slugs) {
    const isProcessed = processSingleArticle({ sectionName, slug, templateHtml, distDir });
    if (isProcessed) {
      processedCount++;
    }
  }

  return processedCount;
}

function processSingleArticle({ sectionName, slug, templateHtml, distDir }) {
  const articleSourceDir = join(__dirname, "src", sectionName, slug);
  const contentMdPath = join(articleSourceDir, CONTENT_FILE);
  if (!existsSync(contentMdPath)) return false;

  const { title, description } = readArticleMetadata(contentMdPath);
  const articleUrl = `${HOSTNAME}/${sectionName}/${slug}`;
  const targetDir = join(distDir, sectionName, slug);
  mkdirSync(targetDir, { recursive: true });

  const coverSvgPath = join(articleSourceDir, COVER_SVG_FILE);
  const targetPngPath = join(targetDir, OUTPUT_PNG_FILE);
  const imageInfo = renderCoverSvgToPng(coverSvgPath, targetPngPath, `${articleUrl}/${OUTPUT_PNG_FILE}`);

  const htmlContent = generateHtmlWithMeta({
    templateHtml,
    title,
    description,
    articleUrl,
    imageUrl: imageInfo.url,
    imageWidth: imageInfo.width,
    imageHeight: imageInfo.height,
  });

  writeFileSync(join(targetDir, INDEX_HTML_FILE), htmlContent, "utf-8");
  return true;
}

function readArticleMetadata(contentMdPath) {
  const fileContent = readFileSync(contentMdPath, "utf-8");
  const { data } = matter(fileContent);

  const title = data.title ? `${data.title} - ${SITE_AUTHOR}` : `${SITE_AUTHOR} - Articles`;
  const description = data.subtitle || "";

  return { title, description };
}

function renderCoverSvgToPng(sourceSvgPath, destinationPngPath, targetImageUrl) {
  const fallback = {
    url: DEFAULT_OG_IMAGE,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
  };

  if (!existsSync(sourceSvgPath)) {
    return fallback;
  }

  try {
    const svgContent = readFileSync(sourceSvgPath, "utf-8");
    const resvg = new Resvg(svgContent, {
      fitTo: { mode: "width", value: OG_IMAGE_WIDTH },
    });
    const pngData = resvg.render();
    writeFileSync(destinationPngPath, pngData.asPng());

    return {
      url: targetImageUrl,
      width: pngData.width,
      height: pngData.height,
    };
  } catch (error) {
    console.warn(`⚠ Failed to render SVG to PNG (${sourceSvgPath}):`, error.message);
    return fallback;
  }
}

function generateHtmlWithMeta({ templateHtml, title, description, articleUrl, imageUrl, imageWidth, imageHeight }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeUrl = escapeHtml(articleUrl);
  const safeImageUrl = escapeHtml(imageUrl);

  const metaTagDefinitions = [
    { attribute: "name", key: "description", content: safeDescription },
    { attribute: "name", key: "twitter:title", content: safeTitle },
    { attribute: "name", key: "twitter:description", content: safeDescription },
    { attribute: "name", key: "twitter:image", content: safeImageUrl },
    { attribute: "property", key: "og:type", content: "article" },
    { attribute: "property", key: "og:url", content: safeUrl },
    { attribute: "property", key: "og:title", content: safeTitle },
    { attribute: "property", key: "og:description", content: safeDescription },
    { attribute: "property", key: "og:image", content: safeImageUrl },
    { attribute: "property", key: "og:image:width", content: String(imageWidth) },
    { attribute: "property", key: "og:image:height", content: String(imageHeight) },
  ];

  let html = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<link\s+rel="canonical"[\s\S]*?>/i, `<link rel="canonical" href="${safeUrl}" />`);

  for (const { attribute, key, content } of metaTagDefinitions) {
    html = replaceOrInsertMetaTag(html, attribute, key, content);
  }

  return html;
}

function getSubdirectories(parentDir) {
  return readdirSync(parentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function replaceOrInsertMetaTag(html, attribute, key, content) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"[\\s\\S]*?>`, "i");
  const formattedTag = `<meta ${attribute}="${key}" content="${content}" />`;

  if (pattern.test(html)) {
    return html.replace(pattern, formattedTag);
  }

  return html.replace(/<\/title>/i, `</title>\n    ${formattedTag}`);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

main();
