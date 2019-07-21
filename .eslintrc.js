module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "no-console": 0,
    "no-plusplus": 0,
    "consistent-return": 0,
    "array-callback-return": 0,
    "comma-dangle": 0,
    "func-names": 0,
    "no-unused-expressions": 0
  },
};
