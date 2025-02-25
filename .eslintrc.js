module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn', // Change to 'warn' or 'error' as needed
    '@typescript-eslint/explicit-module-boundary-types': 'warn', // Change to 'warn' or 'error' as needed
    '@typescript-eslint/no-explicit-any': 'warn', // Change to 'warn' or 'error' as needed
    'import/order': [
      'warn',
      {
        'groups': ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index'],
        'pathGroups': [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        'pathGroupsExcludedImportTypes': [],
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true,
        },
        'newlines-between': 'always',
        'warnOnUnassignedImports': true,
      },
    ],
  },
};
