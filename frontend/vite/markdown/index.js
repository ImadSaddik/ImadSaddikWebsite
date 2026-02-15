import { youtubeTransformer } from "./transformers/youtube.js";
import { headerTransformer } from "./transformers/headers.js";
import { linkTransformer } from "./transformers/links.js";

export function getMarkdownTransformers() {
  return [youtubeTransformer, headerTransformer, linkTransformer];
}
