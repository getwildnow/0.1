/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'cream': '#FFFAF4',
          'gray': '#989795',
          'charcoal': '#333333',
          'dark': '#1B1D1A',
          'black': '#11120D',
          'yellow': '#F8D794',
          'green': '#809076',
          'teal': '#243132'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
