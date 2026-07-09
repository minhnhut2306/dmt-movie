/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#000000',
          surface: '#0b0b12',
          elevated: '#14141f',
          'elevated-2': '#1c1c2a',
        },
        brand: {
          DEFAULT: '#E11D48',
          hover: '#F43F5E',
          muted: '#9F1239',
        },
        gold: {
          DEFAULT: '#CA8A04',
          light: '#EAB308',
        },
        ink: {
          primary: '#F8FAFC',
          secondary: '#B4B8C5',
          muted: '#7C8091',
        },
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.08)',
        DEFAULT: 'rgba(255,255,255,0.14)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cinema: '0 8px 30px rgb(0,0,0,0.4)',
        'cinema-lg': '0 20px 60px rgb(0,0,0,0.55)',
        glow: '0 0 0 1px rgba(225,29,72,0.4), 0 0 24px rgba(225,29,72,0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'skeleton-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.5s infinite',
        'fade-in': 'fade-in 0.25s ease-out',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'skeleton-pulse': 'skeleton-pulse 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
