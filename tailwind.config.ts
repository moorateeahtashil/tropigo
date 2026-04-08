import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-manrope)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-manrope)', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        // Primary (from reference): deep blue #001e40
        brand: {
          50:  '#e6ebf1',
          100: '#cfd7e3',
          200: '#a7b5cc',
          300: '#7a91b3',
          400: '#4b6a96',
          500: '#264a7b',
          600: '#1b3b62',
          700: '#132c49',
          800: '#0d2137',
          900: '#001e40',
          950: '#00152e',
        },
        // Secondary (from reference): teal #006a6a
        lagoon: {
          50:  '#e6f6f6',
          100: '#c0ebeb',
          200: '#8fdede',
          300: '#5bd0d0',
          400: '#2cc2c2',
          500: '#0baaaa',
          600: '#008f8f',
          700: '#007a7a',
          800: '#006a6a',
          900: '#005454',
        },
        // Gold: premium accent
        gold: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        // Sand: warm off-whites for backgrounds
        sand: {
          50:  '#FBF9F4',
          100: '#F0EEE9',
          200: '#E4E2DD',
          300: '#C3C6D1',
          400: '#AEB4C2',
          500: '#8F97A8',
        },
        // Ink: text colors
        ink: {
          DEFAULT: '#0D0F1A',
          secondary: '#4B5468',
          muted: '#8892A4',
          faint: '#CBD2E0',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 20px -2px rgb(0 0 0 / 0.10), 0 2px 8px -2px rgb(0 0 0 / 0.06)',
        'elevated': '0 8px 32px -4px rgb(0 0 0 / 0.12), 0 4px 12px -4px rgb(0 0 0 / 0.08)',
        'modal': '0 24px 64px -12px rgb(0 0 0 / 0.24)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#0D0F1A',
            a: { color: '#001e40' },
            h1: { fontFamily: 'var(--font-manrope)' },
            h2: { fontFamily: 'var(--font-manrope)' },
          },
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/typography'),
  ],
}

export default config
