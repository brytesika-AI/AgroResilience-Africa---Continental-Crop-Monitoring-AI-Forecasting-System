/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F17',
        card: '#151D2A',
        border: '#1F2E43',
        text: {
          primary: '#F3F4F6',
          secondary: '#9CA3AF',
          muted: '#6B7280'
        },
        brand: {
          primary: '#10B981', // emerald-500
          secondary: '#3B82F6', // blue-500
          accent: '#8B5CF6' // violet-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
