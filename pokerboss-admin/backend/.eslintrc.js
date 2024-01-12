module.exports = {
    "env": { "es6": true, "node": true },
    "root": true,
    "parser": "@typescript-eslint/parser",
    "extends": [
      "plugin:@typescript-eslint/recommended",
      "standard",
      "prettier",
      "google"
    ],
    "ignorePatterns": [
      "/lib/**/*" // Ignore built files.
    ],
    "plugins": ["@typescript-eslint", "unused-imports"],
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
      "tsconfigRootDir":__dirname,
      "project": "./tsconfig.json"
    },
    "globals": {
      "__DEV__": false,
      "jasmine": false,
      "beforeAll": false,
      "afterAll": false,
      "beforeEach": false,
      "afterEach": false,
      "test": false,
      "expect": false,
      "describe": false,
      "jest": false,
      "it": false
    },
    "rules": {
      "@typescript-eslint/ban-ts-ignore": 0,
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/explicit-member-accessibility": 0,
      "@typescript-eslint/explicit-module-boundary-types": 0,
      "@typescript-eslint/indent": 0,
      "@typescript-eslint/member-delimiter-style": 0,
      "@typescript-eslint/no-empty-interface": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-object-literal-type-assertion": 0,
      "@typescript-eslint/no-var-requires": 0,
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_"
        }
      ],
      "comma-dangle": 0,
      "multiline-ternary": 0,
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "block-like", "next": "*" }
      ],
      "no-console": ["error", { "allow": ["error"] }],
      "no-undef": 0,
      "no-unused-vars": "off",
      "no-use-before-define": 0,
      "no-global-assign": 0,
      "quotes": 0,
      "react-native/no-raw-text": 0,
      "react/no-unescaped-entities": 0,
      "react/prop-types": 0,
      "space-before-function-paren": 0,
      "spaced-comment": "error",
      "@typescript-eslint/no-empty-function": 0,
      "max-len": ["error", { "code": 180 }]
    }
  }
  