module.exports = {
  extends: ['standard'],
  globals: {
    self: false,
    history: false
  },
  plugins: ['prettier', 'css-modules'],
  rules: {
    'key-spacing': ['error', { mode: 'minimum' }],
    'no-eval': 'off',
    'no-multi-spaces': [
      'error',
      {
        exceptions: {
          VariableDeclarator: true,
          ImportDeclaration: true
        }
      }
    ],
    'no-new': 'off',
    'no-return-assign': 'off',
    'prettier/prettier': 'error',
    'space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }]
  }
}
