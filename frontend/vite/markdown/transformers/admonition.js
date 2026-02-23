import MarkdownItContainer from "markdown-it-container";
import { ADMONITION_TYPES } from "../../../src/constants";
import { MARKDOWN_IT_OPENING_TAG, REGEX_FIRST_CAPTURE_GROUP } from "../../../src/constants";

export function admonitionTransformer(markdownItInstance) {
  ADMONITION_TYPES.forEach((type) => {
    markdownItInstance.use(MarkdownItContainer, type, {
      validate: (params) => {
        const pattern = new RegExp(`^${type}\\s*(.*)$`);
        return params.trim().match(pattern);
      },
      render: (tokens, index) => {
        const pattern = new RegExp(`^${type}\\s*(.*)$`);
        const match = tokens[index].info.trim().match(pattern);

        if (tokens[index].nesting === MARKDOWN_IT_OPENING_TAG) {
          const title = match && match[REGEX_FIRST_CAPTURE_GROUP] ? match[REGEX_FIRST_CAPTURE_GROUP] : type;
          return `<AdmonitionBlock type="${type}" title="${title}">`;
        } else {
          return "</AdmonitionBlock>";
        }
      },
    });
  });
}
