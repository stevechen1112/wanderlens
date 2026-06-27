import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F37A69',
          dark: '#D85A49',
          light: '#FFF0EE',
        },
        secondary: {
          DEFAULT: '#52B6CC',
          dark: '#3A9BB0',
          light: '#E8F7FA',
        },
        success: '#13CE66',
        warning: '#FF9F40',
        danger: '#FF4D4F',
        info: '#909399',
        text: {
          primary: '#333333',
          regular: '#666666',
          secondary: '#999999',
          placeholder: '#C0C4CC',
        },
        border: {
          DEFAULT: '#DDDDDD',
          light: '#E8E8E8',
        },
        bg: {
          DEFAULT: '#F5F5F5',
          light: '#FAFAFA',
        },
        sidebar: {
          DEFAULT: '#333333',
          active: '#F37A69',
          activeBg: '#484E5C',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR',
               '微軟正黑體', 'Microsoft JhengHei', '蘋果儷中黑', 'Apple LiGothic Medium',
               'sans-serif'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      maxWidth: {
        '8xl': '1720px',
      },
      screens: {
        xs: '420px',
        '2xl': '1600px',
      },
    },
  },
  plugins: [],
}
