import pluginAstro from "eslint-plugin-astro"
import tseslint from "typescript-eslint"
import { config as baseConfig } from "@workspace/eslint-config/base"

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: [".astro/**", ".next/**", "dist/**", "public/**", "scripts/**"],
  },
  ...baseConfig,
  ...pluginAstro.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".astro"],
      },
    },
  },
]
