module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  extends: [
    'airbnb-typescript/base',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
  ],
  rules: {
    /*TODO: THESE RULES SHOULD BE TURN BACK ON OR DISABLED AFTER INITIAL PR */
    'import/prefer-default-export': 'warn',
    '@typescript-eslint/await-thenable': 'warn',
    'no-underscore-dangle': 'warn',
    'no-return-await': 'warn',
    'class-methods-use-this': 'warn',
    'arrow-parens': 'warn',
    'implicit-arrow-linebreak': 'warn',
    'comma-dangle': 'warn',
    '@typescript-eslint/require-await': 'warn',
  },
};
