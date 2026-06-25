import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // ❌ কঠোর নিয়ম শিথিল করা হয়েছে (টেম্পোরারি)
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "no-console": "warn", // ⚠️ সতর্কতা হিসেবে রাখা
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;