module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
}