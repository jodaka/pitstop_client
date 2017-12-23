module.exports = {
    "globals": {
        "angular": true,
        "widgets": true,
        "triptop": true
    },
    "env": {
        "browser": true
    },
    "extends": "airbnb-base",
    "rules": {
        "no-console": 0,
        "indent": [ 2, 4, {"VariableDeclarator": 1} ],
        "vars-on-top": 0,
        "func-names": 0,
        "consistent-return": 2,
        "no-param-reassign": 0,
        "no-prototype-builtins": 0,
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "max-len": [2, 520],
        "space-before-function-paren": ["error", { "anonymous" : "never" }],
        "comma-dangle": ["error", "never"],
        "global-require": 0,
        "arrow-body-style": ["error", "as-needed", { requireReturnForObjectLiteral: true }],
        "import/no-extraneous-dependencies": 0,
        "import/imports-first": 0,
        "import/no-unresolved": 0,
        "import/extensions": 0,
        "no-mixed-operators": [
            "error",
            {
                "groups": [
                    ["+", "-", "*", "/", "%", "**"],
                    ["&", "|", "^", "~", "<<", ">>", ">>>"],
                    ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                    ["&&", "||"],
                    ["in", "instanceof"]
                ],
                "allowSamePrecedence": true
            }
        ],
        "prefer-destructuring": 0
    }
};
