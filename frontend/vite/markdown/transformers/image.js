import MarkdownItContainer from "markdown-it-container";
import { MARKDOWN_IT_OPENING_TAG, REGEX_FIRST_CAPTURE_GROUP, REGEX_SECOND_CAPTURE_GROUP } from "../../../src/constants";

const IMAGE_CONTAINER_REGEX = /image\s+(.*?)(?:\s+"(.*?)")?\s*$/;

export const imageTransformer = (markdownItInstance) => {
  markdownItInstance.use(MarkdownItContainer, "image", {
    validate: (params) => params.trim().match(IMAGE_CONTAINER_REGEX),
    render: (tokens, index) => {
      const match = tokens[index].info.trim().match(IMAGE_CONTAINER_REGEX);

      if (tokens[index].nesting === MARKDOWN_IT_OPENING_TAG) {
        const imageSrc = match ? match[REGEX_FIRST_CAPTURE_GROUP].trim() : "";
        const imageAlt = match && match[REGEX_SECOND_CAPTURE_GROUP] ? match[REGEX_SECOND_CAPTURE_GROUP] : "";
        const escapedImageAlt = markdownItInstance.utils.escapeHtml(imageAlt);

        return `<ImageWithCaption image-src="${imageSrc}" image-alt="${escapedImageAlt}">`;
      } else {
        return "</ImageWithCaption>";
      }
    },
  });
};
