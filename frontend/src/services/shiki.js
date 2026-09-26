import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import defaultTheme from "shiki/themes/github-dark-default.mjs";

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
