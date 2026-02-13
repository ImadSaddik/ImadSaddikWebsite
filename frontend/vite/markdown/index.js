import { youtubeTransformer } from "./transformers/youtube.js";

export function getMarkdownTransformers() {
  return [youtubeTransformer];
}
