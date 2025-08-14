/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'testio': {
          blue: '#1E40AF',
          teal: '#0891B2',
          gray: '#6B7280',
          white: '#FFFFFF'
        }
      }
    }
  },
  plugins: []
}