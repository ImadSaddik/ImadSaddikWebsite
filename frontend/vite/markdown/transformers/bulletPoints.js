export function bulletPointTransformer(markdownItInstance) {
  markdownItInstance.renderer.rules.list_item_open = function (tokens, index, options, env, self) {
    return "<BulletPoint>";
  };

  markdownItInstance.renderer.rules.list_item_close = function () {
    return "</BulletPoint>";
  };

  // Replace <ul> with a simple div container to avoid invalid HTML
  // (since BulletPoint renders a <div>, not an <li>)
  markdownItInstance.renderer.rules.bullet_list_open = function () {
    return '<div class="bullet-list-container">';
  };

  markdownItInstance.renderer.rules.bullet_list_close = function () {
    return "</div>";
  };
}
