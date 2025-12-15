import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sitemap = new SitemapStream({ hostname: "https://imadsaddik.com" });

sitemap.write({ url: "/", changefreq: "daily", priority: 1.0 });
sitemap.write({ url: "/about-me", changefreq: "monthly", priority: 0.8 });
sitemap.write({ url: "/hire-me", changefreq: "monthly", priority: 0.8 });
sitemap.write({ url: "/resume", changefreq: "yearly", priority: 0.5 });

sitemap.write({ url: "/blogs", changefreq: "weekly", priority: 0.9 });
sitemap.write({ url: "/courses", changefreq: "weekly", priority: 0.9 });
sitemap.write({ url: "/astronomy", changefreq: "weekly", priority: 0.9 });

const getSlugsFromDirectory = (directoryPath) => {
  try {
    return readdirSync(directoryPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error);
    return [];
  }
};

const blogSlugs = getSlugsFromDirectory(join(__dirname, "src", "blogs"));
blogSlugs.forEach((slug) => {
  sitemap.write({
    url: `/blogs/${slug}`,
    changefreq: "monthly",
    priority: 0.7,
  });
});

const courseSlugs = getSlugsFromDirectory(join(__dirname, "src", "courses"));
courseSlugs.forEach((slug) => {
  sitemap.write({
    url: `/courses/${slug}`,
    changefreq: "monthly",
    priority: 0.7,
  });
});

const astronomySlugs = getSlugsFromDirectory(join(__dirname, "src", "astronomy"));
astronomySlugs.forEach((slug) => {
  sitemap.write({
    url: `/astronomy/${slug}`,
    changefreq: "monthly",
    priority: 0.7,
  });
});

sitemap.end();

streamToPromise(sitemap).then((data) => {
  createWriteStream(join(__dirname, "public", "sitemap.xml")).end(data);
  console.log("✓ Sitemap generated successfully!");
  console.log(`  - ${blogSlugs.length} blog articles`);
  console.log(`  - ${courseSlugs.length} course articles`);
  console.log(`  - ${astronomySlugs.length} astronomy articles`);
});
