// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  rules: {
    'import/no-un-used-modules': 'off',
    'no-un-used-exports': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'import/no-unresolved': [2, { ignore: ['^@env'] }]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
