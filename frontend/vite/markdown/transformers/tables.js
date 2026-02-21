export function tableTransformer(markdownItInstance) {
  markdownItInstance.renderer.rules.table_open = function (tokens, index, options, env, self) {
    const tableTokens = [];

    // Collect all tokens from the current `table_open` to the corresponding `table_close`
    let i = index;
    while (i < tokens.length && tokens[i].type !== "table_close") {
      tableTokens.push(tokens[i]);
      i++;
    }

    // Add the `table_close` token
    if (i < tokens.length) {
      tableTokens.push(tokens[i]);
    }

    const headers = [];
    const rows = [];

    let inThead = false;
    let inTbody = false;
    let currentRow = [];

    tableTokens.forEach((token) => {
      if (token.type === "thead_open") inThead = true;
      if (token.type === "thead_close") inThead = false;
      if (token.type === "tbody_open") inTbody = true;
      if (token.type === "tbody_close") inTbody = false;

      if (token.type === "tr_open") {
        currentRow = [];
      }

      if (token.type === "tr_close") {
        if (!inThead && inTbody) {
          rows.push([...currentRow]);
        }
      }

      if (token.type === "inline") {
        if (inThead) {
          headers.push(markdownItInstance.renderInline(token.content));
        } else if (inTbody) {
          currentRow.push(markdownItInstance.renderInline(token.content));
        }
      }
    });

    const headersJson = JSON.stringify(headers).replace(/"/g, "&quot;");
    const rowsJson = JSON.stringify(rows).replace(/"/g, "&quot;");

    // "Consume" all tokens from the current one to the table_close
    // by changing their type to something that renders nothing.
    for (let j = index + 1; j <= i; j++) {
      tokens[j].type = "table_consumed";
    }

    return `<DataTable :headers="${headersJson}" :rows="${rowsJson}" />`;
  };

  // Rule to render nothing for consumed table tokens
  markdownItInstance.renderer.rules.table_consumed = () => "";
}
