import { createHighlighter } from "shiki";

let highlighter;

export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["night-owl"],
      langs: ["python", "bash", "asm"],
    });
  }
  return highlighter;
}
