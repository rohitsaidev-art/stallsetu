/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      colors: {
        rausch: {
          DEFAULT: '#FF385C',
          hover: '#E00B41',
          active: '#D70438',
          disabled: '#FFD1DA',
          light: '#FFF0F2',
          border: '#FFA3B3',
        },
        ink: {
          DEFAULT: '#222222',
          light: '#484848',
          muted: '#717171',
          subtle: '#B0B0B0',
        },
        body: '#3F3F3F',
        muted: '#6A6A6A',
        'muted-soft': '#929292',
        hairline: {
          DEFAULT: '#DDDDDD',
          soft: '#EBEBEB',
          dark: '#B0B0B0',
        },
        'border-strong': '#C1C1C1',
        canvas: '#FFFFFF',
        'surface-soft': '#F7F7F7',
        'surface-card': '#FFFFFF',
        'surface-strong': '#F2F2F2',
        'error-text': '#C13515',
        'legal-link': '#428BFF',
      },
      borderRadius: {
        'airbnb-xs': '4px',
        'airbnb-sm': '8px',
        'airbnb-md': '14px',
        'airbnb-card': '16px',
        'airbnb-lg': '20px',
        'airbnb-sheet': '24px',
        'airbnb-xl': '32px',
      },
      boxShadow: {
        airbnb: '0 0 0 1px rgba(0,0,0,0.02), 0 2px 6px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.1)',
        'airbnb-pill': '0 3px 12px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'airbnb-pill-hover': '0 6px 20px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.06)',
        'airbnb-card': '0 4px 14px 0 rgba(0,0,0,0.06)',
        'airbnb-card-hover': '0 12px 28px 0 rgba(0,0,0,0.12)',
        'airbnb-modal': '0 16px 36px 0 rgba(0,0,0,0.20), 0 4px 12px 0 rgba(0,0,0,0.08)',
      },
      spacing: {
        section: '64px',
      },
    },
  },
  plugins: [],
};
