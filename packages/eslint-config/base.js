// @yuna/eslint-config — 공통 ESLint 설정 (base)
// 모든 워크스페이스 패키지가 공유하는 기본 린트 룰셋

/** @type {import('eslint').Linter.Config} */
module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        // 사용하지 않는 변수 경고 (언더스코어 prefix 허용)
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        // any 타입 사용 경고 (점진적 마이그레이션 허용)
        '@typescript-eslint/no-explicit-any': 'warn',
    },
    ignorePatterns: ['node_modules/', 'dist/', '.next/', 'coverage/'],
};
