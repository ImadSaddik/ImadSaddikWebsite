export function superscriptTransformer(markdownItInstance) {
  const defaultRender =
    markdownItInstance.renderer.rules.text ||
    function (tokens, index, options, env, self) {
      return self.renderToken(tokens, index, options);
    };

  markdownItInstance.renderer.rules.text = function (tokens, index, options, env, self) {
    let content = tokens[index].content;

    if (content.includes("^")) {
      // Regex to match ^text^ and replace with <SuperscriptText text="text" />
      content = content.replace(/\^([^^]+)\^/g, (_match, superscriptText) => {
        return `<SuperscriptText text="${superscriptText}" />`;
      });
      return content;
    }

    return defaultRender(tokens, index, options, env, self);
  };
}
