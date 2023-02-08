/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    colors: {
      honeydew: '#f1faee',
      red: '#ff4772',
      darkred: '#b52828',
      blue: '#2e5cb2',
      hoverblue: '#bfd0ee',
      blue2: '#2e5cb2e6',
      blue3: '#1a5d9c',
      black: '#0e1c36',
      black2: '#0e1c36cc',
      black3: '#00000066',
      dullwhite: '#dee2e6',
      white: '#ffffff',
      gray: '#c3cdd9',
      gray2: '#838688',
      darkgray: '#545556',
      empty: '#c4c4c4',
      empty2: '#e5e5e5',
      empty3: '#e9ecef',
      inherit: 'inherit',
      tealDark: '#0d9488',
      teal: '#14b8a6',
      blueTag: '#3b82f6',
      blueDarkTag: '#2563eb',
      green: '#1cc500',
      lightblue: '#4299e1',
      lightblue2: '#3182ce',
      lightgray: '#e9ecef',
      red2: '#E63746',
      danger: '#e63746',
      success: '#198754',
      info: '#1e92f4',
      warning: '#ff6700',
      darkgreen: '#006400',
      darkred2: '#8b0000',
      darkblue: '#00008b',
      darkorange: '#b76500'
    },
    extend: {
      backgroundImage: {
        arrowOne: "url('/icons/arrow-1-grey.svg')",
        arrowOneActive: "url('/icons/arrow-1-blue.svg')",
        arrow: "url('/icons/arrow-2-grey.svg')",
        arrowActive: "url('/icons/arrow-2-blue.svg')"
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
};
