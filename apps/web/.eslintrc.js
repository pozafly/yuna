/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@yuna/eslint-config/nextjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
