module.exports = {
  root: true,
  ignorePatterns: ["node_modules/", "dist/", ".astro/", ".turbo/"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  env: {
    node: true,
    es2022: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  overrides: [
    {
      files: ["**/*.cjs"],
      env: { node: true }
    }
  ]
};
