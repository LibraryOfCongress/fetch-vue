module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
  },

  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'eslint:recommended',
    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    // 'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)
  ],

  plugins: ['vue',],

  globals: {
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  // custom rules here
  rules: {
    'indent': [
      'error',
      2,
      { 'offsetTernaryExpressions': true }
    ],
    'prefer-promise-reject-errors': 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-unused-vars': 'error',
    'vue/no-mutating-props': 'off',
    'vue/first-attribute-linebreak': [
      'error',
      {
        'singleline': 'ignore',
        'multiline': 'below'
      }
    ],
    'vue/multiline-html-element-content-newline': [
      'error',
      {
        'ignoreWhenEmpty': true,
        'allowEmptyLines': true
      }
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        'singleline': {
          'max': 1
        },
        'multiline': {
          'max': 1
        }
      }
    ],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        'singleline': 'never',
        'multiline': 'always'
      }
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        'attribute': 1,
        'baseIndent': 1,
        'closeBracket': 0,
        'alignAttributesVertically': true,
        'ignores': []
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'vue/mustache-interpolation-spacing': [
      'error',
      'always'
    ],
    'vue/v-bind-style': [
      'error',
      'shorthand'
    ],
    'vue/v-on-style': [
      'error',
      'shorthand'
    ],
    'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
    'comma-spacing': 'error',
    'curly': 'error',
    'handle-callback-err': 'off',
    'array-callback-return': 'off',
    'array-bracket-newline': [
      'error',
      {
        'multiline': true
      }
    ],
    'array-element-newline': [
      'error',
      {
        'ArrayExpression': 'always',
        'ArrayPattern': { 'minItems': 1 },
      }
    ],
    'quotes': [
      'error',
      'single',
      'avoid-escape'
    ]
  }
}
