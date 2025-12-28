import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream, readdirSync, statSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { format, resolveConfig } from "prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const HOSTNAME = "https://imadsaddik.com";

const sitemap = new SitemapStream({ hostname: HOSTNAME });

const getLatestFileModification = (directoryPath) => {
  let latestTime = 0;
  try {
    const files = readdirSync(directoryPath);
    for (const fileName of files) {
      const filePath = join(directoryPath, fileName);
      const stats = statSync(filePath);
      if (stats.isFile() && stats.mtimeMs > latestTime) {
        latestTime = stats.mtimeMs;
      }
    }
    return latestTime > 0 ? new Date(latestTime).toISOString() : new Date().toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
};

const addSectionToSitemap = (sectionName) => {
  const sourceDir = join(__dirname, "src", sectionName);
  if (!existsSync(sourceDir)) return;

  const slugs = readdirSync(sourceDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  slugs.forEach((slug) => {
    const fullPath = join(sourceDir, slug);
    const lastModificationTime = getLatestFileModification(fullPath);

    sitemap.write({
      url: `/${sectionName}/${slug}`,
      lastmod: lastModificationTime,
      changefreq: "monthly",
      priority: 0.7,
    });
  });
};

const now = new Date().toISOString();
sitemap.write({ url: "/", lastmod: now, changefreq: "daily", priority: 1.0 });
sitemap.write({ url: "/about-me", lastmod: now, changefreq: "monthly", priority: 0.8 });
sitemap.write({ url: "/hire-me", lastmod: now, changefreq: "monthly", priority: 0.8 });
sitemap.write({ url: "/resume", lastmod: now, changefreq: "yearly", priority: 0.5 });

addSectionToSitemap("blogs");
addSectionToSitemap("courses");
addSectionToSitemap("astronomy");

sitemap.end();

streamToPromise(sitemap)
  .then(async (data) => {
    const sitemapString = data.toString();
    const sitemapPath = join(__dirname, "public", "sitemap.xml");

    const options = await resolveConfig(sitemapPath);
    const formattedSitemap = await format(sitemapString, {
      ...options,
      filepath: sitemapPath,
    });

    createWriteStream(sitemapPath).end(formattedSitemap);
    console.log("✓ Sitemap generated and formatted!");
  })
  .catch((error) => {
    console.error("✗ Failed to generate sitemap:", error);
    process.exit(1);
  });
