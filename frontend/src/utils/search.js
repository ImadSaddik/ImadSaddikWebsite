import fallbackCoverImage from "@/assets/fallbackCoverImage.svg";
import { DIRECTORY_MAPPING } from "@/constants";
import { convertUnixTimestampToReadableFormat } from "./formatting";
import { ARTICLE_COVER_IMAGE_REGISTRY } from "@/registries/images.js";

export function getCardsDataFromDocumentHits({ hits, articleType }) {
  const directory = DIRECTORY_MAPPING[articleType];

  return hits.map((hit) => {
    const imagePath = `/src/${directory}/${hit.name}/coverImage.svg`;
    return {
      imageSrc: ARTICLE_COVER_IMAGE_REGISTRY[directory]?.[imagePath] || fallbackCoverImage,
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
