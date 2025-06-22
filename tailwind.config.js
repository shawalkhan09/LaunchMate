/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './static/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-light': '#3b82f6',
        'primary-dark': '#1d4ed8',
        secondary: '#3f37c9',
        accent: '#4cc9f0',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        'text-primary': '#2b2d42',
        'text-secondary': '#8d99ae',
        'bg-primary': '#ffffff',
        'bg-secondary': '#f8f9fa',
        'bg-accent': '#e9ecef',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        toastIn: 'toastIn 0.3s ease-out',
        toastOut: 'toastOut 0.3s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        toastIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        toastOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' }
        }
      },  
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [function({ addUtilities }) {
    addUtilities({
      '.gradient-text': {
        'background': 'linear-gradient(to right, #2563eb, #4f46e5)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        'background-clip': 'text'
      },
      '.card-hover': {
        '@apply hover:shadow-xl hover:-translate-y-2 transition-all duration-300': {}
      },
      '.loader-spin': {
        'animation': 'spin-slow 1.5s linear infinite'
      },
      '.loader-pulse': {
        'animation': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    })
  }],
}