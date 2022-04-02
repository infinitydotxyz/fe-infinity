module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['node', 'react', 'prettier', '@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: {
    node: true
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }]
  },
  settings: {
    node: {
      tryExtensions: ['.js', '.json', '.node', '.ts']
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
    '*.config.js',
    'src/settings/theme/**/*.js'
  ]
};
