import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import parser from "vue-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/dist"],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended",
  ),
  {
    plugins: {
      prettier,
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      parser: parser,
      ecmaVersion: 2020,
      sourceType: "module",

      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },

    rules: {
      "prettier/prettier": "error",
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "no-console": "off",
      "no-debugger": "off",
    },
  },
];
