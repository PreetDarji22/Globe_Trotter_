/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#EDE9E0', // Darkened background as requested
        sand: '#E0DBD0',
        terracotta: '#C85A32',
        sage: '#3A8B6F',
        slate: '#1E232A',
        mustard: '#E8B923',
        genz: {
          green: '#3A8B6F',
          blue: '#7993F0',
          orange: '#FA7246',
          maroon: '#A33B58',
          pink: '#E9AAFA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      boxShadow: {
        'sticker': '2px 4px 12px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
