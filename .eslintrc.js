module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true
    },
    'extends': 'airbnb',
    'parserOptions': {
        'ecmaVersion': 6,
        'sourceType': 'module'
    },
    'rules': {
        'indent': [
            'error',
            'tab'
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-underscore-dangle': [
            'off'
        ],
    }
};
