import { MARKDOWN_IT_SELF_CONTAINED_TAG, REGEX_FULL_MATCH, REGEX_FIRST_CAPTURE_GROUP } from "../../../src/constants";

const FONT_AWESOME_REGEX = /^::fa\{(.*?)}::/;

export function fontAwesomeTransformer(markdownItInstance) {
  markdownItInstance.inline.ruler.before("emphasis", "font_awesome", (state, silent) => {
    const src = state.src.slice(state.pos);
    const match = src.match(FONT_AWESOME_REGEX);

    if (!match || match.index !== 0) {
      return false;
    }

    // Create the token only when not in 'silent' mode (validation).
    if (!silent) {
      const token = state.push("font_awesome", "i", MARKDOWN_IT_SELF_CONTAINED_TAG);
      token.attrSet("class", match[REGEX_FIRST_CAPTURE_GROUP]);
    }

    // Push the cursor forward by the length of the matched string.
    state.pos += match[REGEX_FULL_MATCH].length;
    return true;
  });

  markdownItInstance.renderer.rules.font_awesome = (tokens, index) => {
    const token = tokens[index];
    const iconClass = token.attrGet("class");
    return `<i class="${iconClass}"></i>`;
  };
}
