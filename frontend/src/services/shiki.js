import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { transformerNotationHighlight } from "@shikijs/transformers";
import defaultTheme from "shiki/themes/github-dark-default.mjs";

export const DEFAULT_THEME_NAME = defaultTheme.name;

const BUNDLED_LANGUAGES = [
  import("shiki/langs/python.mjs"),
  import("shiki/langs/bash.mjs"),
  import("shiki/langs/asm.mjs"),
  import("shiki/langs/yaml.mjs"),
  import("shiki/langs/ini.mjs"),
  import("shiki/langs/javascript.mjs"),
  import("shiki/langs/nginx.mjs"),
  import("shiki/langs/json.mjs"),
  import("shiki/langs/css.mjs"),
  import("shiki/langs/vue.mjs"),
];

const BACKGROUND_COLOR_REGEX = /background-color:\s*[^;]+;?/i;

export const removeInlineBackgroundTransformer = {
  name: "remove-inline-background",
  pre(node) {
    if (!node.properties?.style) return;

    const cleanedStyle = node.properties.style.replace(BACKGROUND_COLOR_REGEX, "").trim();
    if (cleanedStyle) {
      node.properties.style = cleanedStyle;
    } else {
      delete node.properties.style;
    }
  },
};

const DEFAULT_TRANSFORMERS = [
  transformerNotationHighlight({ matchAlgorithm: "v3" }),
  removeInlineBackgroundTransformer,
];

let highlighterPromise;

/**
 * Returns a cached singleton Shiki highlighter instance.
 */
export async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [defaultTheme],
      langs: BUNDLED_LANGUAGES,
      engine: createJavaScriptRegexEngine(),
    }).catch((error) => {
      highlighterPromise = null;
      throw error;
    });
  }
  return highlighterPromise;
}

/**
 * Highlights a code snippet into HTML using Shiki.
 *
 * @param {string} code - The source code to highlight.
 * @param {string} lang - The language identifier.
 * @param {string} [theme=DEFAULT_THEME_NAME] - The theme name.
 * @returns {Promise<string>} The highlighted HTML output.
 */
export async function highlightCode(code, lang, theme = DEFAULT_THEME_NAME) {
  const instance = await getHighlighter();
  return instance.codeToHtml(code, {
    lang,
    theme,
    transformers: DEFAULT_TRANSFORMERS,
  });
}
