/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0B1220',
          800: '#121a2b',
          700: '#1a2440',
          600: '#223055',
          500: '#2b3d6d',
          400: '#3b4f8a',
          300: '#6477b6',
          200: '#95a4d6',
          100: '#c4cff1'
        }
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Inter', 'Segoe UI', 'Roboto', 'Arial', 'Noto Sans', 'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji']
      }
    }
  },
  plugins: []
}
