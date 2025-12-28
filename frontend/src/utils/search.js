import { blogCoverImages, courseCoverImages, astronomyCoverImages } from "@/registries/images.js";
import fallbackCoverImage from "@/assets/fallbackCoverImage.svg";
import { convertUnixTimestampToReadableFormat } from "./formatting";
import { ARTICLE_TYPES, DIRECTORY_MAPPING } from "@/constants";

const coverImagesByType = {
  [ARTICLE_TYPES.BLOG]: blogCoverImages,
  [ARTICLE_TYPES.COURSE]: courseCoverImages,
  [ARTICLE_TYPES.ASTRONOMY]: astronomyCoverImages,
};

export function getCardsDataFromDocumentHits({ hits, articleType }) {
  const coverImages = coverImagesByType[articleType];
  const directory = DIRECTORY_MAPPING[articleType];

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
