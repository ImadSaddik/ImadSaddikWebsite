import { youtubeTransformer } from "./transformers/youtube.js";
import { headerTransformer } from "./transformers/headers.js";

export function getMarkdownTransformers() {
  return [youtubeTransformer, headerTransformer];
}
