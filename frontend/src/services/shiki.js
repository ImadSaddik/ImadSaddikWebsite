import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

let highlighter;

export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighterCore({
      themes: [import("shiki/themes/night-owl.mjs")],
      langs: [
        import("shiki/langs/python.mjs"),
        import("shiki/langs/bash.mjs"),
        import("shiki/langs/asm.mjs"),
        import("shiki/langs/yaml.mjs"),
        import("shiki/langs/ini.mjs"),
      ],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighter;
}
