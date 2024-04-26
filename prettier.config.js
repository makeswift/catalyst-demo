// @ts-check

/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],
  tailwindFunctions: ['cs'],
};

module.exports = config;
