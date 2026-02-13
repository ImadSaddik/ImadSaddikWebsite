import MarkdownItContainer from "markdown-it-container";

export const youtubeTransformer = [
  MarkdownItContainer,
  "youtube",
  {
    validate: (params) => params.trim().match(/^youtube\s+(.*)$/),
    render: (tokens, idx) => {
      const match = tokens[idx].info.trim().match(/^youtube\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        const videoUrl = match ? match[1] : "";
        return `<YouTubePlayer video-url="${videoUrl}">`;
      } else {
        return "</YouTubePlayer>";
      }
    },
  },
];
