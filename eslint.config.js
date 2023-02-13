import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";

const tsOverrideConfig = ts.configs["eslint-recommended"].overrides[0].rules;
const tsRecommendedConfig = ts.configs.recommended.rules;

export default [
  "eslint:recommended",
  // TODO: (p)react recommended?
  {
    linterOptions: {
      noInlineConfig: true,
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Typescript
  {
    files: ["**/*.tsx", "**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootdir: __dirname,
        project: ["tsconfig.eslint.json", "packages/*/tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      ts,
    },
    rules: {
      ...tsOverrideConfig,
      ...tsRecommendedConfig,
      "@typescript-eslint/no-unused-vars": "error"
    },
  },

  // other filepath overrides
];
