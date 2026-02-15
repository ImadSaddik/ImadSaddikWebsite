import MarkdownItContainer from "markdown-it-container";

const YOUTUBE_CONTAINER_REGEX = /youtube\s+(.*)/;
const MARKDOWN_LINK_REGEX = /\[.*\]\((.*)\)/;
const MARKDOWN_IT_OPENING_TAG = 1;
const REGEX_FIRST_CAPTURE_GROUP = 1;

export const youtubeTransformer = (markdownItInstance) => {
  markdownItInstance.use(MarkdownItContainer, "youtube", {
    validate: (params) => params.trim().match(YOUTUBE_CONTAINER_REGEX),
    render: (tokens, index) => {
      const match = tokens[index].info.trim().match(YOUTUBE_CONTAINER_REGEX);

      if (tokens[index].nesting === MARKDOWN_IT_OPENING_TAG) {
        let videoUrl = match ? match[REGEX_FIRST_CAPTURE_GROUP] : "";

        // Handle markdown link syntax: [text](url) -> extract url
        const linkMatch = videoUrl.match(MARKDOWN_LINK_REGEX);
        if (linkMatch) {
          videoUrl = linkMatch[REGEX_FIRST_CAPTURE_GROUP];
        }

        return `<YouTubePlayer video-url="${videoUrl}">`;
      } else {
        return "</YouTubePlayer>";
      }
    },
  });
};
