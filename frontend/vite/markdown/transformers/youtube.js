import MarkdownItContainer from "markdown-it-container";

const regex = /youtube\s+(.*)/;

export const youtubeTransformer = (markdownItInstance) => {
  markdownItInstance.use(MarkdownItContainer, "youtube", {
    validate: (params) => params.trim().match(regex),
    render: (tokens, idx) => {
      const match = tokens[idx].info.trim().match(regex);

      if (tokens[idx].nesting === 1) {
        const videoUrl = match ? match[1].replace(/:::$/, "").trim() : "";
        return `<YouTubePlayer video-url="${videoUrl}">`;
      } else {
        return "</YouTubePlayer>";
      }
    },
  });
};
