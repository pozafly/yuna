module.exports = {
  'apps/**/*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
  'packages/**/*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,css,scss,md,html}': ['prettier --write'],
};
