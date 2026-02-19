import MarkdownItContainer from "markdown-it-container";
import { MARKDOWN_IT_OPENING_TAG, REGEX_FIRST_CAPTURE_GROUP, REGEX_SECOND_CAPTURE_GROUP } from "../../../src/constants";

const VIDEO_CONTAINER_REGEX = /video\s+(.*?)(?:\s+"(.*?)")?\s*$/;

export function videoTransformer(markdownItInstance) {
  markdownItInstance.use(MarkdownItContainer, "video", {
    validate: (params) => params.trim().match(VIDEO_CONTAINER_REGEX),
    render: (tokens, index) => {
      const match = tokens[index].info.trim().match(VIDEO_CONTAINER_REGEX);

      if (tokens[index].nesting === MARKDOWN_IT_OPENING_TAG) {
        const videoSrc = match ? match[REGEX_FIRST_CAPTURE_GROUP].trim() : "";
        const videoCaption = match && match[REGEX_SECOND_CAPTURE_GROUP] ? match[REGEX_SECOND_CAPTURE_GROUP] : "";

        return `<VideoWithCaption video-src="${videoSrc}" video-caption="${videoCaption}">`;
      } else {
        return "</VideoWithCaption>";
      }
    },
  });
}
