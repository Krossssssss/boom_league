/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Noto Sans SC"', 'sans-serif'],
        'bangers': ['Bangers', 'cursive'],
      }
    },
  },
  plugins: [],
}

