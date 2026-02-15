const SUPPORTED_HEADER_LEVELS = ["2", "3", "4"];
const HEADER_TAG_LEVEL_START_INDEX = 1;
const INLINE_CONTENT_TOKEN_OFFSET = 1;

export function headerTransformer(markdownItInstance) {
  const originalHeaderOpen =
    markdownItInstance.renderer.rules.heading_open ||
    function (tokens, index, options, env, self) {
      return self.renderToken(tokens, index, options);
    };

  markdownItInstance.renderer.rules.heading_open = function (tokens, index, options, env, self) {
    const token = tokens[index];
    const headerLevel = token.tag.slice(HEADER_TAG_LEVEL_START_INDEX);

    if (!env.usedHeaderIds) {
      env.usedHeaderIds = {};
    }

    if (SUPPORTED_HEADER_LEVELS.includes(headerLevel)) {
      const inlineToken = tokens[index + INLINE_CONTENT_TOKEN_OFFSET];
      const title = inlineToken.children
        .filter((token) => ["text", "code_inline"].includes(token.type))
        .map((token) => token.content)
        .join("");

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

      token.attrSet("id", id);
      token.attrSet("class", "article-body-header");
      token.attrSet("data-table-of-contents", "");

      const headerOpeningTag = originalHeaderOpen(tokens, index, options, env, self);
      const headerLink = `<a class="clickable-header-link" href="#${id}">`;

      return `${headerOpeningTag}${headerLink}`;
    }

    return originalHeaderOpen(tokens, index, options, env, self);
  };

  const originalHeaderClose =
    markdownItInstance.renderer.rules.heading_close ||
    function (tokens, index, options, env, self) {
      return self.renderToken(tokens, index, options);
    };

  markdownItInstance.renderer.rules.heading_close = function (tokens, index, options, env, self) {
    const token = tokens[index];
    const headerLevel = token.tag.slice(HEADER_TAG_LEVEL_START_INDEX);

    if (SUPPORTED_HEADER_LEVELS.includes(headerLevel)) {
      const headerClosingTag = originalHeaderClose(tokens, index, options, env, self);
      const headerLinkClose = "</a>";

      return `${headerLinkClose}${headerClosingTag}`;
    }

    return originalHeaderClose(tokens, index, options, env, self);
  };
}

function hasProperty(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}
