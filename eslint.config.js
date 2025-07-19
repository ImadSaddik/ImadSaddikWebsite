import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  ...pluginVue.configs["flat/recommended"],
  ...pluginVue.configs["flat/strongly-recommended"],
  eslintConfigPrettier,
  {
    rules: {
      "vue/no-unused-vars": "error",
    },
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
];
