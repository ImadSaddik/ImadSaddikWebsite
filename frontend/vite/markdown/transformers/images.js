export function imageTransformer(markdownItInstance) {
  const defaultRender =
    markdownItInstance.renderer.rules.image ||
    function (tokens, index, options, env, self) {
      return self.renderToken(tokens, index, options);
    };

  markdownItInstance.renderer.rules.image = function (tokens, index, options, env, self) {
    const token = tokens[index];
    const src = token.attrGet("src");
    const alt = token.content;
    const title = token.attrGet("title") || "";

    if (src) {
      return `<ImageWithCaption image-src="${src}" image-alt="${alt}" image-caption="${title}" />`;
    }

    return defaultRender(tokens, index, options, env, self);
  };
}
