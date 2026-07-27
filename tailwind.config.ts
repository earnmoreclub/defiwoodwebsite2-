import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#08070d',
          900: '#0f0d17',
          800: '#151222',
          700: '#1c1929',
          600: '#252136',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F7F2EA',
          200: '#E7E1D8',
        },
        clay: '#E7E1D8',
        sage: {
          DEFAULT: '#78866B',
          50: '#F2F4EE',
          100: '#E2E6D9',
          200: '#C5CCB5',
          500: '#78866B',
          600: '#5F6C54',
          700: '#475140',
        },
        charcoal: '#1C1917',
        purple: {
          500: '#a855f7',
          400: '#c084fc',
          300: '#d8b4fe',
          600: '#9333ea',
        },
        emerald: {
          500: '#10b981',
          400: '#34d399',
          300: '#6ee7b7',
          600: '#059669',
        },
        cyan: {
          500: '#06b6d4',
          400: '#22d3ee',
          300: '#67e8f9',
          600: '#0891b2',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.08)',
          dark: 'rgba(0, 0, 0, 0.3)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.18em',
      },
      maxWidth: {
        prose: '42rem',
        'prose-lg': '48rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 16s ease-in-out infinite',
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
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(6, 182, 212, 0.3)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(0.6)', opacity: '0.55' },
          '25%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1)', opacity: '1' },
          '75%': { transform: 'scale(0.6)', opacity: '0.55' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
