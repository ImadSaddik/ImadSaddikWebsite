import { youtubeTransformer } from "./transformers/youtube.js";
import { headerTransformer } from "./transformers/header.js";
import { linkTransformer } from "./transformers/link.js";
import { inlineCodeTransformer } from "./transformers/inlineCode.js";
import { listTransformer } from "./transformers/list.js";
import { codeTransformer } from "./transformers/code.js";
import { admonitionTransformer } from "./transformers/admonition.js";
import { imageTransformer } from "./transformers/image.js";
import { videoTransformer } from "./transformers/video.js";
import { tableTransformer } from "./transformers/table.js";
import { inlineIconTransformer } from "./transformers/inlineIcon.js";
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
