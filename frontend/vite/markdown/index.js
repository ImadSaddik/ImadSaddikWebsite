import { youtubeTransformer } from "./transformers/youtube.js";
import { headerTransformer } from "./transformers/headers.js";
import { linkTransformer } from "./transformers/links.js";
import { inlineCodeTransformer } from "./transformers/inlineCode.js";
import { bulletPointTransformer } from "./transformers/bulletPoints.js";
import { codeTransformer } from "./transformers/code.js";
import { admonitionTransformer } from "./transformers/admonitions.js";

export function getMarkdownTransformers() {
  return [
    youtubeTransformer,
    headerTransformer,
    linkTransformer,
    inlineCodeTransformer,
    bulletPointTransformer,
    codeTransformer,
    admonitionTransformer,
  ];
}
