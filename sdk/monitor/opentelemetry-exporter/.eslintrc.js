module.exports = {
  settings: {
    node: {
      resolvePaths: [__dirname],
      tryExtensions: [".ts"],
    },
  },
  extends: [
    "plugin:node/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "no-underscore-dangle": ["error", { allowAfterThis: true }],
    "node/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
    "import/prefer-default-export": "off",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
    createDefaultProgram: true,
  },
};
