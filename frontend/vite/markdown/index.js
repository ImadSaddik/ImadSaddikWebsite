import { youtubeTransformer } from "./transformers/youtube.js";
import { headerTransformer } from "./transformers/headers.js";
import { linkTransformer } from "./transformers/links.js";
import { inlineCodeTransformer } from "./transformers/inlineCode.js";
import { listTransformer } from "./transformers/lists.js";
import { codeTransformer } from "./transformers/code.js";
import { admonitionTransformer } from "./transformers/admonitions.js";
import { imageTransformer } from "./transformers/images.js";
import { inlineIconTransformer } from "./transformers/inlineIcons.js";

export function getMarkdownTransformers() {
  return [
    youtubeTransformer,
    headerTransformer,
    linkTransformer,
    inlineCodeTransformer,
    listTransformer,
    codeTransformer,
    admonitionTransformer,
    imageTransformer,
    inlineIconTransformer,
  ];
}
