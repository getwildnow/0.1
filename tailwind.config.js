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
        'brand-cream': '#FFFAF4',
        'brand-gray-light': '#989795',
        'brand-gray': '#7b7b7b',
        'brand-dark': '#333333',
        'brand-black': '#1B1D1A',
        'brand-darkest': '#11120D',
        'brand-yellow': '#F8D794',
        'brand-green-light': '#809076',
        'brand-green': '#243132',
      }
    },
  },
  plugins: [],
}
