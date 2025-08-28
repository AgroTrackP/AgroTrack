/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",


    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {//emerald
          50: 'oklch(0.979 0.021 166.113)',
          100: 'oklch(0.95 0.052 163.051)',
          200: 'oklch(0.905 0.093 164.15)',
          300: 'oklch(0.845 0.143 164.978)',
          400: 'oklch(0.765 0.177 163.223)',
          500: 'oklch(0.696 0.17 162.48)',
          600: 'oklch(0.596 0.145 163.225)',
          700: 'oklch(0.508 0.118 165.612)',
          800: 'oklch(0.432 0.095 166.913)',
          900: 'oklch(0.378 0.077 168.94)',
          950: 'oklch(0.262 0.051 172.552)',
        },
        secondary: { //blue
          50: 'oklch(0.97 0.014 254.604)',
          100: 'oklch(0.932 0.032 255.585)',
          200: 'oklch(0.882 0.059 254.128)',
          300: 'oklch(0.809 0.105 251.813)',
          400: 'oklch(0.707 0.165 254.624)',
          500: 'oklch(0.623 0.214 259.815)',
          600: 'oklch(0.546 0.245 262.881)',
          700: 'oklch(0.488 0.243 264.376)',
          800: 'oklch(0.424 0.199 265.638)',
          900: 'oklch(0.379 0.146 265.522)',
          950: 'oklch(0.282 0.091 267.935)',
        }
      }
    },
  },
  plugins: [
  ],
  darkMode: 'media'
}

