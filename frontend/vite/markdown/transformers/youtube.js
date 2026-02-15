import MarkdownItContainer from "markdown-it-container";

const YOUTUBE_REGEX = /youtube\s+(.*)/;
const LINK_REGEX = /\[.*\]\((.*)\)/;

export const youtubeTransformer = (markdownItInstance) => {
  markdownItInstance.use(MarkdownItContainer, "youtube", {
    validate: (params) => params.trim().match(YOUTUBE_REGEX),
    render: (tokens, index) => {
      const match = tokens[index].info.trim().match(YOUTUBE_REGEX);

      if (tokens[index].nesting === 1) {
        let videoUrl = match ? match[1] : "";

        // Handle markdown link syntax: [text](url) -> extract url
        const linkMatch = videoUrl.match(LINK_REGEX);
        if (linkMatch) {
          videoUrl = linkMatch[1];
        }

        return `<YouTubePlayer video-url="${videoUrl}">`;
      } else {
        return "</YouTubePlayer>";
      }
    },
  });
};
