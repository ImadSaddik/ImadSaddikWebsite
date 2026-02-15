export function headerTransformer(md) {
  const originalHeaderOpen =
    md.renderer.rules.heading_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const headerLevel = token.tag.slice(1);

    if (["2", "3", "4"].includes(headerLevel)) {
      const inlineToken = tokens[idx + 1];
      const title = inlineToken.children
        .filter((token) => ["text", "code_inline"].includes(token.type))
        .map((token) => token.content)
        .join("");

      const id = title.toLowerCase().replace(/[^\w]+/g, "-");

      token.attrSet("id", id);
      token.attrSet("class", "article-body-header");
      token.attrSet("data-table-of-contents", "");
    }

    return originalHeaderOpen(tokens, idx, options, env, self);
  };
}
