import { youtubeTransformer } from "./transformers/youtube.js";
import { headerTransformer } from "./transformers/headers.js";
import { linkTransformer } from "./transformers/links.js";
import { inlineCodeTransformer } from "./transformers/inlineCode.js";
import { listTransformer } from "./transformers/lists.js";
import { codeTransformer } from "./transformers/code.js";
import { admonitionTransformer } from "./transformers/admonitions.js";
import { imageTransformer } from "./transformers/images.js";
import { videoTransformer } from "./transformers/videos.js";
import { tableTransformer } from "./transformers/tables.js";
import { inlineIconTransformer } from "./transformers/inlineIcons.js";
import { fontAwesomeTransformer } from "./transformers/fontAwesome.js";
import { superscriptTransformer } from "./transformers/superscript.js";

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
    videoTransformer,
    tableTransformer,
    inlineIconTransformer,
    fontAwesomeTransformer,
    superscriptTransformer,
  ];
}
