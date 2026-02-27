// @yuna/eslint-config — Next.js 전용 ESLint 설정

/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        './base.js',
        'next/core-web-vitals',
    ],
    rules: {
        // Next.js Image 컴포넌트 강제 해제 (presigned URL 사용으로 인해)
        '@next/next/no-img-element': 'off',
    },
};
