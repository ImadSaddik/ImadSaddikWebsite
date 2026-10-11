import { MARKDOWN_IT_SELF_CONTAINED_TAG, REGEX_FULL_MATCH, REGEX_FIRST_CAPTURE_GROUP } from "../../../src/constants";

const KEYBOARD_REGEX = /^\[\[([^\]\n]+)\]\]/;

export function keyboardTransformer(markdownItInstance) {
  markdownItInstance.inline.ruler.before("link", "keyboard_key", (state, silent) => {
    const substring = state.src.slice(state.pos);
    const match = substring.match(KEYBOARD_REGEX);

    if (!match || match.index !== 0) {
      return false;
    }

    const text = match[REGEX_FIRST_CAPTURE_GROUP].trim();
    if (text.length === 0) {
      return false;
    }

    // Create the token only when not in 'silent' mode (validation).
    if (!silent) {
      const token = state.push("keyboard_key", "KeyboardKey", MARKDOWN_IT_SELF_CONTAINED_TAG);
      token.attrSet("text", text);
    }

    // Push the cursor forward by the length of the matched string.
    state.pos += match[REGEX_FULL_MATCH].length;
    return true;
  });

  markdownItInstance.renderer.rules.keyboard_key = (tokens, index) => {
    const token = tokens[index];
    const text = token.attrGet("text");
    const escapedText = text.replace(/"/g, "&quot;");
    return `<KeyboardKey text="${escapedText}" />`;
  };
}
