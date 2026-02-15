/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dell-inspired color palette
        primary: {
          50: '#E6F3FB',
          100: '#CCE7F7',
          200: '#99CFEF',
          300: '#66B7E7',
          400: '#339FDF',
          500: '#0076CE', // Dell Blue
          600: '#0C5AA6',
          700: '#09447D',
          800: '#062D54',
          900: '#03172B',
        },
        accent: {
          50: '#E6F9FD',
          100: '#CCF3FB',
          200: '#99E7F7',
          300: '#66DBF3',
          400: '#33CFEF',
          500: '#00A9E0', // Bright Blue
          600: '#0087B3',
          700: '#006586',
          800: '#00445A',
          900: '#00222D',
        },
        success: {
          50: '#F0F9EC',
          100: '#E1F3D9',
          200: '#C3E7B3',
          300: '#A5DB8D',
          400: '#87CF67',
          500: '#6CC04A',
          600: '#569938',
          700: '#41732A',
          800: '#2B4D1C',
          900: '#16260E',
        },
        warning: {
          50: '#FEF6E7',
          100: '#FDEDCF',
          200: '#FBDB9F',
          300: '#F9C96F',
          400: '#F7B73F',
          500: '#F5A623',
          600: '#C4841C',
          700: '#936315',
          800: '#62420E',
          900: '#312107',
        },
        error: {
          50: '#FCE8EC',
          100: '#F9D1D9',
          200: '#F3A3B3',
          300: '#ED758D',
          400: '#E74767',
          500: '#E31C3D',
          600: '#B61631',
          700: '#881125',
          800: '#5B0B18',
          900: '#2D060C',
        },
        neutral: {
          50: '#F8F9FA',
          100: '#F5F7FA',
          200: '#E5E7E9',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#2C2C2C',
          900: '#212529',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}
