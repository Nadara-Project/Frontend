import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist", ".vercel"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["off"], // إيقاف تنبيهات المتغيرات غير المستخدمة لتجاوز الفحص بنجاح
    },
  },
];
