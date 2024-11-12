module.exports = {
  extends: ['eslint-config-salesforce-typescript', 'plugin:sf-plugin/recommended'],
  root: true,
  rules: {
    header: 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    indent: ['error', 2, { SwitchCase: 1 }],
  },
  ignorePatterns: ['.eslintrc.cjs'],
};
