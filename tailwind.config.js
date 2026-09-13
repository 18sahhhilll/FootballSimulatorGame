/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          dark: '#0a1d12',
          DEFAULT: '#11381f',
          light: '#1b4d2e',
          accent: '#267344',
          lines: 'rgba(255, 255, 255, 0.25)',
        },
        gold: {
          light: '#ffe066',
          DEFAULT: '#ffd700',
          dark: '#b8960c',
          accent: '#f59e0b',
        },
        stadium: {
          bg: '#090d16',
          card: '#131b2e',
          cardHover: '#1c2843',
          border: '#243456',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'card-reveal': 'cardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)' },
        },
        cardReveal: {
          '0%': { transform: 'scale(0.8) translateY(30px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
