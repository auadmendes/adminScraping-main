/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1180px',
      xl: '1440px'
    },

    extend: {
      maxWidth: {
        shop: 'calc(100vw - (100vw - 1180px) /2 )'
      },
      fontSize: {
        md: '1.125rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem'
      },
      fontFamily: {
        sans: 'Roboto, sans-serif'
      },
      colors: {
        rocketseat: '#8257E6',
        hmidiasColor: '#15BCBC',
        hmidiasColorHover: '#1CFFFF',
        Trutly: '#0EE06E',
        gray: {
          100: '#E1E1E6',
          300: '#C4C4CC',
          800: '#202024',
          900: '#121214'
        },
        green: {
          200: '#0ae06b',
          300: '#00B37E',
          500: '#00875F'
        },
        gradient: {
          first: '#1EA483',
          second: '#7465D4'
        },
        price: 'rgba(0, 0, 0, 0.6)'
      }
    }
  },
  plugins: []
}
