import antfu from "@antfu/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default antfu(
  {
    react: true,
    typescript: true,
    stylistic: false,
    markdown: false,
    toml: false,
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      "no-console": "off",
      "ts/no-use-before-define": "off",
      "ts/strict-boolean-expressions": "off",
      "ts/no-unsafe-member-access": "off",
      "ts/no-unsafe-call": "off",
      "ts/no-unsafe-assignment": "off",
      "ts/no-unsafe-return": "off",
      "ts/no-unsafe-argument": "off",
      "ts/no-misused-promises": "off",
      "ts/no-floating-promises": "off",
      "node/prefer-global/process": "off",
      "node/prefer-global/buffer": "off",
      "import/no-named-default": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-refresh/only-export-components": "off",
      "react/no-leaked-conditional-rendering": "off",
      "react/no-forward-ref": "off",
      "react-dom/no-unsafe-target-blank": "off",
    },
  },
  {
    name: "perfectionist",
    rules: {
      "import/order": "off",
      "sort-imports": "off",
      "perfectionist/sort-imports":
        perfectionist.configs["recommended-natural"].rules[
          "perfectionist/sort-imports"
        ],
      "perfectionist/sort-exports":
        perfectionist.configs["recommended-natural"].rules[
          "perfectionist/sort-exports"
        ],
      "perfectionist/sort-named-imports":
        perfectionist.configs["recommended-natural"].rules[
          "perfectionist/sort-named-imports"
        ],
      "perfectionist/sort-named-exports":
        perfectionist.configs["recommended-natural"].rules[
          "perfectionist/sort-named-exports"
        ],
    },
  },
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    name: "tailwind",
    rules: {
      "tailwindcss/no-custom-classname": "off",
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
);
