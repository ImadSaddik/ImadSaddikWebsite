export function inlineCodeTransformer(markdownItInstance) {
  markdownItInstance.renderer.rules.code_inline = function (tokens, index) {
    const token = tokens[index];
    const code = token.content;
    const escapedCode = code.replace(/"/g, "&quot;");

    return `<InlineCode text="${escapedCode}" />`;
  };
}
