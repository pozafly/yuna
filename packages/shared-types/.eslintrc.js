/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@yuna/eslint-config/base'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['**/*.d.ts'],
};
