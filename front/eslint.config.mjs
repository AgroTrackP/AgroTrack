import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;

// import globals from "globals";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// export default [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
//   {
//     files: ["**/*.ts", "**/*.tsx"],
//     languageOptions: {
//       globals: {
//         ...globals.node,
//       },
//     },
//     rules: {
//       // ✅ permite usar any sin que ESLint se queje
//       "@typescript-eslint/no-explicit-unknown": "off",
//     },
//   },
// ];

