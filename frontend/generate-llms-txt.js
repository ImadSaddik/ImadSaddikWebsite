import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { DIRECTORY_MAPPING } from "./src/constants/content.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOSTNAME = "https://imadsaddik.com";
const CONTENT_FILE = "content.md";

const SECTION_HEADERS = {
  blogs: "Blog posts",
  courses: "Courses and tutorials",
  astronomy: "Astronomy guides",
};

function main() {
  const startTime = performance.now();
  const publicDir = join(__dirname, "public");
  const distDir = join(__dirname, "dist");
  const hasDist = existsSync(distDir);

  const articlesBySection = {};
  let totalProcessed = 0;

  for (const section of Object.values(DIRECTORY_MAPPING)) {
    const sectionArticles = collectSectionArticles(section);
    articlesBySection[section] = sectionArticles;
    totalProcessed += sectionArticles.length;

    for (const article of sectionArticles) {
      exportIndividualMarkdown(article, { publicDir, distDir, hasDist });
    }
  }

  const llmsTxtContent = buildLlmsTxt(articlesBySection);
  const llmsFullTxtContent = buildLlmsFullTxt(articlesBySection);

  writeFileSync(join(publicDir, "llms.txt"), llmsTxtContent, "utf-8");
  writeFileSync(join(publicDir, "llms-full.txt"), llmsFullTxtContent, "utf-8");

  if (hasDist) {
    writeFileSync(join(distDir, "llms.txt"), llmsTxtContent, "utf-8");
    writeFileSync(join(distDir, "llms-full.txt"), llmsFullTxtContent, "utf-8");
  }

  const elapsed = (performance.now() - startTime).toFixed(1);
  console.log(`✓ Generated llms.txt, llms-full.txt, and exported ${totalProcessed} articles in ${elapsed}ms`);
}

function collectSectionArticles(sectionName) {
  const sourceDir = join(__dirname, "src", sectionName);
  if (!existsSync(sourceDir)) return [];

  const slugs = readdirSync(sourceDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const articles = [];

  for (const slug of slugs) {
    const contentPath = join(sourceDir, slug, CONTENT_FILE);
    if (!existsSync(contentPath)) continue;

    const rawContent = readFileSync(contentPath, "utf-8");
    const { data } = matter(rawContent);

    articles.push({
      sectionName,
      slug,
      title: data.title || slug,
      subtitle: data.subtitle || "",
      date: data.date || "",
      rawContent,
      articleUrl: `${HOSTNAME}/${sectionName}/${slug}`,
      markdownUrl: `${HOSTNAME}/${sectionName}/${slug}.md`,
    });
  }

  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles;
}

function exportIndividualMarkdown(article, { publicDir, distDir, hasDist }) {
  const publicSectionDir = join(publicDir, article.sectionName);
  mkdirSync(publicSectionDir, { recursive: true });
  writeFileSync(join(publicSectionDir, `${article.slug}.md`), article.rawContent, "utf-8");

  if (hasDist) {
    const distSectionDir = join(distDir, article.sectionName);
    mkdirSync(distSectionDir, { recursive: true });
    writeFileSync(join(distSectionDir, `${article.slug}.md`), article.rawContent, "utf-8");

    // Also write index.md inside dist/${section}/${slug}/ for maximum URL flexibility
    const distArticleDir = join(distSectionDir, article.slug);
    mkdirSync(distArticleDir, { recursive: true });
    writeFileSync(join(distArticleDir, "index.md"), article.rawContent, "utf-8");
  }
}

function buildLlmsTxt(articlesBySection) {
  const sectionsMarkdown = [];

  for (const [sectionName, articles] of Object.entries(articlesBySection)) {
    const headerTitle = SECTION_HEADERS[sectionName] || sectionName;
    const items = articles
      .map((article) => {
        const desc = article.subtitle ? `: ${article.subtitle}` : "";
        return `- [${article.title}](${article.markdownUrl})${desc}`;
      })
      .join("\n");

    sectionsMarkdown.push(`## ${headerTitle}\n\n${items}`);
  }

  return [
    "# Imad Saddik",
    "",
    "> Personal website and technical blog by Imad Saddik covering Linux system administration, self-hosted AI stacks, search engines, web performance, and astronomy.",
    "",
    "Welcome! This document provides an LLM-friendly index of tutorials, technical articles, and courses hosted on [imadsaddik.com](https://imadsaddik.com). Raw Markdown versions of all articles are provided via the links below, or bundled together in [/llms-full.txt](https://imadsaddik.com/llms-full.txt).",
    "",
    sectionsMarkdown.join("\n\n"),
    "",
    "## Additional resources",
    "",
    "- [About Imad Saddik](https://imadsaddik.com/about-me): Background, experience, open-source projects, and skills.",
    "- [Hire me](https://imadsaddik.com/hire-me): Contact and freelance consulting information.",
    "- [Full documentation bundle](https://imadsaddik.com/llms-full.txt): Complete aggregated text of all tutorials and guides.",
    "",
  ].join("\n");
}

function buildLlmsFullTxt(articlesBySection) {
  const articlesAggregated = [];

  for (const [sectionName, articles] of Object.entries(articlesBySection)) {
    const headerTitle = SECTION_HEADERS[sectionName] || sectionName;
    articlesAggregated.push(`\n# Section: ${headerTitle}\n`);

    for (const article of articles) {
      articlesAggregated.push(
        [`# ${article.title}`, `Canonical URL: ${article.articleUrl}`, "", article.rawContent].join("\n")
      );
    }
  }

  return [
    "# Imad Saddik - Full technical articles and documentation",
    "",
    "> Complete collection of tutorials, articles, and courses from imadsaddik.com by Imad Saddik.",
    "",
    "Welcome! This file aggregates the complete text of all technical articles, courses, and guides on [imadsaddik.com](https://imadsaddik.com).",
    "",
    "---",
    "",
    articlesAggregated.join("\n---\n\n"),
    "",
  ].join("\n");
}

main();
