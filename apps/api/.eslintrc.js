/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@yuna/eslint-config/nestjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
