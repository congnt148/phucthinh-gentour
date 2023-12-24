module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ['plugin:react/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
      'sourceType': 'module',
    'allowImportExportEverywhere': true
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
     'react/prop-types': 'off'
  },
};
