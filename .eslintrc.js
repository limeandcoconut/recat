'use strict'

module.exports = {
    extends: 'brian',
    parser: 'babel-eslint',
    plugins: [
        'html',
        'vue',
    ],
    rules: {
        'indent': [2, 4, {MemberExpression: 0}],
        'operator-linebreak': ['error', 'after', {overrides: {'?': 'ignore', ':': 'ignore'}}],
    },
}
