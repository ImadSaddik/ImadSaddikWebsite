const ORDERED_LIST_MARKERS = [".", ")"];

function isOrderedListItem(token) {
  return ORDERED_LIST_MARKERS.includes(token.markup);
}

export function listTransformer(markdownItInstance) {
  markdownItInstance.renderer.rules.bullet_list_open = function () {
    return "<UnorderedList>";
  };

  markdownItInstance.renderer.rules.bullet_list_close = function () {
    return "</UnorderedList>";
  };

  markdownItInstance.renderer.rules.ordered_list_open = function () {
    return "<OrderedList>";
  };

  markdownItInstance.renderer.rules.ordered_list_close = function () {
    return "</OrderedList>";
  };

  markdownItInstance.renderer.rules.list_item_open = function (tokens, index, options, env, self) {
    const token = tokens[index];

    if (isOrderedListItem(token)) {
      return "<OrderedItem>";
    }

    return "<UnorderedItem>";
  };

  markdownItInstance.renderer.rules.list_item_close = function (tokens, index, options, env, self) {
    // Look back for the nearest list_item_open to know what we are closing
    let i = index - 1;
    while (i >= 0 && tokens[i].type !== "list_item_open") {
      i--;
    }

    const openToken = tokens[i];
    if (openToken && isOrderedListItem(openToken)) {
      return "</OrderedItem>";
    }

    return "</UnorderedItem>";
  };
}
