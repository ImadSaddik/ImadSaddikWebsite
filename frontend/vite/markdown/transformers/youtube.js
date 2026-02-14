import MarkdownItContainer from "markdown-it-container";

const regex = /youtube\s+(.*)/;

export const youtubeTransformer = [
  MarkdownItContainer,
  "youtube",
  {
    validate: (params) => params.trim().match(regex),
    render: (tokens, idx) => {
      const match = tokens[idx].info.trim().match(regex);

      if (tokens[idx].nesting === 1) {
        const videoUrl = match ? match[1] : "";
        return `<YouTubePlayer video-url="${videoUrl}">`;
      } else {
        return "</YouTubePlayer>";
      }
    },
  },
];
