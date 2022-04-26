module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  overrides: [
    // overrides is needed for switch-exhaustiveness-check
    // seems hacky, but it seems to work
    // https://stackoverflow.com/questions/58510287/parseroptions-project-has-been-set-for-typescript-eslint-parser
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json']
      },
      rules: {
        '@typescript-eslint/switch-exhaustiveness-check': 'warn'
      }
    }
  ],
  plugins: ['node', 'react', 'prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@next/next/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  env: {
    node: true
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
    'no-duplicate-imports': 'error',

    // https://nextjs.org/docs/messages/next-image-unconfigured-host
    // Image is bullshit, turn off this lint error in NextJS
    '@next/next/no-img-element': 0
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
    'src/settings/theme/**/*.js',
    'node_modules/**'
  ]
};
