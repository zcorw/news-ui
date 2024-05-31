module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended", // 如果你使用 TypeScript
    "plugin:prettier/recommended", // 确保这条放在最后
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        trailingComma: "all",
        arrowParens: "always",
      },
    ],
    "comma-dangle": ["off", "always-multiline"],
    "react/prop-types": "off",
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: ".*",
        args: "none",
      },
    ],
  },
  settings: {
    react: {
      version: "detect", // 自动检测 React 版本
    },
  },
};
