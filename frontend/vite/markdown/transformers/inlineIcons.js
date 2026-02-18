import { MARKDOWN_IT_SELF_CONTAINED_TAG, REGEX_FULL_MATCH, REGEX_FIRST_CAPTURE_GROUP } from "../../../src/constants";

const ICON_REGEX = /^::icon\{(.*?)}::/;

export function inlineIconTransformer(markdownItInstance) {
  markdownItInstance.inline.ruler.before("emphasis", "inline_icon", (state, silent) => {
    const substring = state.src.slice(state.pos);
    const match = substring.match(ICON_REGEX);

    if (!match || match.index !== 0) {
      return false;
    }

    // Create the token only when not in 'silent' mode (validation).
    if (!silent) {
      const token = state.push("inline_icon", "InlineIcon", MARKDOWN_IT_SELF_CONTAINED_TAG);
      token.attrSet("icon", match[REGEX_FIRST_CAPTURE_GROUP]);
    }

    // Push the cursor forward by the length of the matched string.
    state.pos += match[REGEX_FULL_MATCH].length;
    return true;
  });

  markdownItInstance.renderer.rules.inline_icon = (tokens, index) => {
    const token = tokens[index];
    const iconPath = token.attrGet("icon");
    return `<InlineIcon icon="${iconPath}" />`;
  };
}
