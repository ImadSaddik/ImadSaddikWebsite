import markdownItKatex from "@vscode/markdown-it-katex";

export const mathTransformer = (markdownItInstance) => {
  const plugin = markdownItKatex.default || markdownItKatex;
  markdownItInstance.use(plugin);
};
