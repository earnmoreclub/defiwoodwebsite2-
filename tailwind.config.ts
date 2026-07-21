import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from spec
        cream: {
          50: '#FAF8F5', // Main background
          100: '#F5F0E6',
          200: '#EFE8D8',
        },
        forest: {
          50: '#F0F4F1',
          100: '#DCE6DF',
          200: '#B8CCBE',
          300: '#8FAE99',
          400: '#5F8470',
          500: '#3F6453',
          600: '#2F4D40',
          700: '#263E33',
          800: '#1C2B26', // Deep forest green - primary brand
          900: '#192923',
        },
        amber: {
          50: '#FAF8F5',
          100: '#F2E6DA',
          200: '#E5C9B3',
          300: '#D4A373', // Muted warm amber - accent
          400: '#BC8256',
          500: '#A6673C',
          600: '#8C5230',
          700: '#724229',
          800: '#5C3623',
          900: '#4B2D1F',
        },
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.18em',
      },
      maxWidth: {
        prose: '42rem',
        'prose-lg': '48rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '42rem',
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;