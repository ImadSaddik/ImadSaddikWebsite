import axios from "axios";
import { blogCoverImages, courseCoverImages, astronomyCoverImages } from "@/assetRegistry.js";
import fallbackCoverImage from "@/assets/fallbackCoverImage.svg";

const coverImagesByType = {
  "blog-post": blogCoverImages,
  "course-post": courseCoverImages,
  "astronomy-post": astronomyCoverImages,
};

export const directoryMapping = {
  "blog-post": "blogs",
  "course-post": "courses",
  "astronomy-post": "astronomy",
};

export const hubMapping = {
  "blog-post": { path: "/blogs", name: "blogs page" },
  "course-post": { path: "/courses", name: "courses page" },
  "astronomy-post": { path: "/astronomy", name: "astronomy page" },
};

function calculateReadingTime(refs) {
  const WORDS_PER_MINUTE = 200;
  const articleText = refs.articleContent.$el.innerText;
  const wordCount = articleText.trim().split(/\s+/).length;
  const time = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return time;
}

function convertUnixTimestampToReadableFormat(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getCardsDataFromDocumentHits({ hits, articleType }) {
  const coverImages = coverImagesByType[articleType];
  const directory = directoryMapping[articleType];

  return hits.map((hit) => {
    const imagePath = `/src/${directory}/${hit.name}/coverImage.svg`;
    return {
      imageSrc: coverImages[imagePath] || fallbackCoverImage,
      altText: `Cover image for the ${articleType} titled ${hit.title}`,
      title: hit.title,
      creationDate: convertUnixTimestampToReadableFormat(hit.creation_date),
      articleType: articleType,
      articleId: hit.name,
      viewCount: hit.view_count,
      readCount: hit.read_count,
      clapsCount: hit.claps_count,
    };
  });
}

async function trackVisitorData(visitedPageKey) {
  try {
    await axios.post("/api/visitors/track", {
      visited_page: visitedPageKey,
    });
  } catch {
    // I don't want to log this error, nor show it in a toast.
  }
}

export { calculateReadingTime, convertUnixTimestampToReadableFormat, getCardsDataFromDocumentHits, trackVisitorData };
