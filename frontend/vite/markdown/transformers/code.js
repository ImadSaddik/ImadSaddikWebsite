export function codeTransformer(markdownItInstance) {
  markdownItInstance.renderer.rules.fence = function (tokens, index, options, env, self) {
    const token = tokens[index];
    const info = token.info ? token.info.trim() : "";
    const language = info.split(/\s+/g)[0] || "text";
    const code = token.content.trim();

    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    if (language === "output") {
      return `<CodeOutput code-output="${escapedCode}" />`;
    }

    return `<CodeBlock code="${escapedCode}" language="${language}" />`;
  };
}
