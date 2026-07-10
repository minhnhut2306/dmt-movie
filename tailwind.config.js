/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DMT Movie signature palette — "Aurora Ink": deep indigo depth + iris/ember duotone accent
        ink: {
          950: '#07070d',
          900: '#0b0b15',
          800: '#11111e',
          700: '#171728',
          600: '#1e1e35',
          500: '#282845',
        },
        iris: {
          50: '#f2efff',
          100: '#e5e0ff',
          200: '#cabfff',
          300: '#a794ff',
          400: '#8b6dff',
          500: '#7048f0',
          600: '#5b35cf',
          700: '#4728a8',
          800: '#361f80',
          900: '#271a5c',
        },
        ember: {
          300: '#ffd699',
          400: '#ffb84d',
          500: '#f59e0b',
          600: '#d9820a',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
        card: '1rem',
        sheet: '1.75rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(7, 7, 13, 0.45)',
        'glass-lg': '0 20px 60px rgba(7, 7, 13, 0.55)',
        glow: '0 0 0 1px rgba(139, 109, 255, 0.25), 0 8px 24px rgba(112, 72, 240, 0.25)',
        'inner-line': 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 3.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

