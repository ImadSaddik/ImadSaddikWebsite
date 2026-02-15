import MarkdownItContainer from "markdown-it-container";

const youtubeRegex = /youtube\s+(.*)/;
const linkRegex = /\[.*\]\((.*)\)/;

export const youtubeTransformer = (markdownItInstance) => {
  markdownItInstance.use(MarkdownItContainer, "youtube", {
    validate: (params) => params.trim().match(youtubeRegex),
    render: (tokens, index) => {
      const match = tokens[index].info.trim().match(youtubeRegex);

      if (tokens[index].nesting === 1) {
        let videoUrl = match ? match[1] : "";

        // Handle markdown link syntax: [text](url) -> extract url
        const linkMatch = videoUrl.match(linkRegex);
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
