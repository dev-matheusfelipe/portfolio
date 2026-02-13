/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        ops: {
          bg: '#1d2430',
          panel: '#2a3449',
          line: '#4ebff5',
          glow: '#61cef7',
          soft: '#b1caf3'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(78,191,245,0.35), 0 14px 36px rgba(22,110,210,0.18)',
        card: '0 8px 24px rgba(8,14,24,0.28)'
      },
      backgroundImage: {
        'ops-grid': 'radial-gradient(circle at 1px 1px, rgba(177,202,243,0.18) 1px, transparent 0)'
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        radar: 'radar 14s linear infinite'
      }
    }
  },
  plugins: []
}
