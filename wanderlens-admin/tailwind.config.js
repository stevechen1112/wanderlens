/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F37A69',
          light: '#FFF0EE',
        },
        success: '#13CE66',
        danger: '#FF4D4F',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}
