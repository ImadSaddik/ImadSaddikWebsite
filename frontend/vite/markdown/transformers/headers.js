export function headerTransformer(markdownItInstance) {
  const originalHeaderOpen =
    markdownItInstance.renderer.rules.heading_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  markdownItInstance.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const headerLevel = token.tag.slice(1);

    if (!env.usedHeaderIds) {
      env.usedHeaderIds = {};
    }

    if (["2", "3", "4"].includes(headerLevel)) {
      const inlineToken = tokens[idx + 1];
      const title = inlineToken.children
        .filter((token) => ["text", "code_inline"].includes(token.type))
        .map((token) => token.content)
        .join("");
      console.log("title:", title);

      let id = title
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (hasProperty(env.usedHeaderIds, id)) {
        env.usedHeaderIds[id]++;
        id = `${id}-${env.usedHeaderIds[id]}`;
      } else {
        env.usedHeaderIds[id] = 0;
      }
      console.log("Generated ID:", id);

      token.attrSet("id", id);
      token.attrSet("class", "article-body-header");
      token.attrSet("data-table-of-contents", "");
    }

    return originalHeaderOpen(tokens, idx, options, env, self);
  };
}

function hasProperty(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}
