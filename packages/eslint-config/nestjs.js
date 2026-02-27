// @yuna/eslint-config — NestJS 전용 ESLint 설정

/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ['./base.js'],
    rules: {
        // NestJS에서 빈 생성자(의존성 주입용)는 허용
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'off',
    },
};
