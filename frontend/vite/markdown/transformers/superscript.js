export function superscriptTransformer(markdownItInstance) {
  const defaultRender =
    markdownItInstance.renderer.rules.text ||
    function (tokens, index, options, env, self) {
      return self.renderToken(tokens, index, options);
    };

  markdownItInstance.renderer.rules.text = function (tokens, index, options, env, self) {
    let content = tokens[index].content;

    if (content.includes("^")) {
      console.log("Superscript content found:", content);
      // Regex to match ^text^ and replace with <SuperscriptText text="text" />
      content = content.replace(/\^([^^]+)\^/g, (_match, superscriptText) => {
        return `<SuperscriptText text="${superscriptText}" />`;
      });
      console.log("Transformed content:", content);
      return content;
    }

    return defaultRender(tokens, index, options, env, self);
  };
}
