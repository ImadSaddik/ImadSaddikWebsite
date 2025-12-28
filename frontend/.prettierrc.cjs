module.exports = {
  semi: true,
  trailingComma: "es5",
  singleQuote: false,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  plugins: ["@prettier/plugin-xml"],
  overrides: [
    {
      files: ["*.xml"],
      options: {
        parser: "xml",
        tabWidth: 4,
        printWidth: 120,
        xmlWhitespaceSensitivity: "ignore",
      },
    },
  ],
};
