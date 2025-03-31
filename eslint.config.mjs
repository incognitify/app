import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginPrettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier" // Add prettier config
  ),
  {
    // Add prettier plugin
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Enable prettier rules
      "prettier/prettier": "error",
      // Avoid conflicts between prettier and eslint
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
    },
  },
];

export default eslintConfig;
