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
        sans: ['var(--font-sora)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-eb-garamond)', 'ui-serif', 'Georgia', 'serif'],
        headline: ['var(--font-eb-garamond)', 'ui-serif', 'Georgia', 'serif'],
        label: ['var(--font-sora)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Background & surfaces (from example)
        background: '#fbf9f4',
        surface: '#fbf9f4',
        'surface-container': '#f0eee9',
        'surface-container-low': '#f5f3ee',
        'surface-container-high': '#eae8e3',
        'surface-container-highest': '#e4e2dd',
        'surface-variant': '#e4e2dd',
        // Primary: deep blue
        primary: '#001e40',
        'primary-container': '#003366',
        'on-primary': '#ffffff',
        'on-primary-container': '#799dd6',
        'on-primary-fixed': '#001b3c',
        'on-primary-fixed-variant': '#1f477b',
        'primary-fixed': '#d5e3ff',
        'primary-fixed-dim': '#a7c8ff',
        // Secondary: teal
        secondary: '#006a6a',
        'secondary-container': '#79f6f5',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#007070',
        'on-secondary-fixed': '#002020',
        'on-secondary-fixed-variant': '#004f4f',
        'secondary-fixed': '#79f6f5',
        'secondary-fixed-dim': '#59d9d9',
        // Tertiary: coral/red
        tertiary: '#460002',
        'tertiary-container': '#6e0105',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#fe6e60',
        'on-tertiary-fixed': '#410001',
        'on-tertiary-fixed-variant': '#8b1a16',
        'tertiary-fixed': '#ffdad5',
        'tertiary-fixed-dim': '#ffb4aa',
        // Text
        'on-surface': '#1b1c19',
        'on-surface-variant': '#43474f',
        'inverse-surface': '#30312e',
        'inverse-on-surface': '#f2f1ec',
        'surface-bright': '#fbf9f4',
        'surface-dim': '#dbdad5',
        'surface-tint': '#3a5f94',
        // Outline
        outline: '#737780',
        'outline-variant': '#c3c6d1',
        // Error
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        'inverse-primary': '#a7c8ff',
        // Legacy aliases (for backward compatibility)
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
        sand: {
          50:  '#FBF9F4',
          100: '#F0EEE9',
          200: '#E4E2DD',
          300: '#C3C6D1',
          400: '#AEB4C2',
          500: '#8F97A8',
        },
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
