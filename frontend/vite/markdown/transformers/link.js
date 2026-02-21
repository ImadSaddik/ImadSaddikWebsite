export function linkTransformer(markdownItInstance) {
  const defaultRender =
    markdownItInstance.renderer.rules.link_open ||
    function (tokens, index, options, env, self) {
      return self.renderToken(tokens, index, options);
    };

  markdownItInstance.renderer.rules.link_open = function (tokens, index, options, env, self) {
    const token = tokens[index];
    const href = token.attrGet("href");

    if (href && /^https?:\/\//.test(href)) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener noreferrer");
    }

    return defaultRender(tokens, index, options, env, self);
  };
}
