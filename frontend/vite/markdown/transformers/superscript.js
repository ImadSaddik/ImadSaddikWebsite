import { MARKDOWN_IT_SELF_CONTAINED_TAG, REGEX_FULL_MATCH, REGEX_FIRST_CAPTURE_GROUP } from "../../../src/constants";

const SUPERSCRIPT_REGEX = /^\^([^^]+)\^/;

export function superscriptTransformer(markdownItInstance) {
  markdownItInstance.inline.ruler.before("emphasis", "superscript", (state, silent) => {
    const substring = state.src.slice(state.pos);
    const match = substring.match(SUPERSCRIPT_REGEX);

    if (!match || match.index !== 0) {
      return false;
    }

    // Create the token only when not in 'silent' mode (validation).
    if (!silent) {
      const token = state.push("superscript", "SuperscriptText", MARKDOWN_IT_SELF_CONTAINED_TAG);
      token.attrSet("text", match[REGEX_FIRST_CAPTURE_GROUP]);
    }

    // Push the cursor forward by the length of the matched string.
    state.pos += match[REGEX_FULL_MATCH].length;
    return true;
  });

  markdownItInstance.renderer.rules.superscript = (tokens, index) => {
    const token = tokens[index];
    const text = token.attrGet("text");
    return `<SuperscriptText text="${text}" />`;
  };
}
