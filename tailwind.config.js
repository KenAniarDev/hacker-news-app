/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'source-code-pro': ['Source Code Pro', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
      },
    }
  },
  plugins: [],
}