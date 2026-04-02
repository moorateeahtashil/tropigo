import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        headline: ['EB Garamond', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        body: ['Sora', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Helvetica', 'Arial', 'Noto Sans', 'sans-serif'],
        label: ['Sora', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Helvetica', 'Arial', 'Noto Sans', 'sans-serif']
      },
      colors: {
        'on-primary-fixed': '#001b3c',
        'on-error-container': '#93000a',
        background: '#fbf9f4',
        surface: '#fbf9f4',
        'surface-container': '#f0eee9',
        'primary-fixed-dim': '#a7c8ff',
        'primary-container': '#003366',
        'on-tertiary-container': '#fe6e60',
        'on-background': '#1b1c19',
        'surface-tint': '#3a5f94',
        'outline-variant': '#c3c6d1',
        'surface-container-lowest': '#ffffff',
        'inverse-surface': '#30312e',
        'inverse-primary': '#a7c8ff',
        'surface-bright': '#fbf9f4',
        'on-primary-container': '#799dd6',
        'error-container': '#ffdad6',
        'surface-dim': '#dbdad5',
        'primary-fixed': '#d5e3ff',
        'tertiary-fixed-dim': '#ffb4aa',
        'surface-variant': '#e4e2dd',
        'on-primary': '#ffffff',
        'tertiary-fixed': '#ffdad5',
        'on-tertiary-fixed': '#410001',
        'on-secondary-fixed-variant': '#004f4f',
        'on-secondary': '#ffffff',
        'tertiary-container': '#6e0105',
        'surface-container-low': '#f5f3ee',
        tertiary: '#460002',
        'secondary-fixed': '#79f6f5',
        'on-tertiary-fixed-variant': '#8b1a16',
        'inverse-on-surface': '#f2f1ec',
        'on-secondary-fixed': '#002020',
        'on-error': '#ffffff',
        primary: '#001e40',
        'on-surface-variant': '#43474f',
        'secondary-container': '#79f6f5',
        'secondary-fixed-dim': '#59d9d9',
        error: '#ba1a1a',
        outline: '#737780',
        secondary: '#006a6a',
        'on-primary-fixed-variant': '#1f477b',
        'surface-container-high': '#eae8e3',
        'on-surface': '#1b1c19',
        'on-secondary-container': '#007070',
        'on-tertiary': '#ffffff',
        'surface-container-highest': '#e4e2dd'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

export default config
