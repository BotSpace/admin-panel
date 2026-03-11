import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Maxsus qoidalarni shu yerda belgilaymiz
    rules: {
      // 1. "any" ishlatishga ruxsat berish (yoki ogohlantirish qilish)
      "@typescript-eslint/no-explicit-any": "off",

      // 2. JSX ichida ' " > kabi belgilarni tekshirmaslik
      "react/no-unescaped-entities": "off",

      // 3. _ bilan boshlanuvchi o'zgaruvchilar ishlatilmasa ham xato bermaslik
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
