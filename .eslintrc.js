module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname
  },
  plugins: ['node', 'react', 'prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@next/next/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    // We need to enable this and fix all the errors
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  env: {
    node: true
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
    'no-duplicate-imports': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'warn',
    curly: 1,
    eqeqeq: 1,
    'require-await': 1,
    'no-return-await': 1,
    // '@typescript-eslint/no-floating-promises': 1,

    // https://nextjs.org/docs/messages/next-image-unconfigured-host
    // Image is bullshit, turn off this lint error in NextJS
    '@next/next/no-img-element': 0
  },
  settings: {
    node: {
      tryExtensions: ['.js', '.json', '.node', '.ts', '.d.ts']
    }
  },
  ignorePatterns: [
    '/.build',
    '/.cache',
    '/.git',
    '/.husky',
    '/.yarn',
    '/**/__snapshots__',
    'build/**',
    'node_modules/**',
    '*.config.js',
    '**/theme/elements/*.js',
    '.eslintrc.js'
  ]
};
