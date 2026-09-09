/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './templates/**/*.html',
    './static/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6',
        'primary-light': '#a78bfa',
        'primary-dark': '#7c3aed',
        paper: '#FAFAF7',
        'paper-dark': '#111411',
        ink: '#171A1E',
        'ink-dark': '#EDEFEC',
        'ink-soft': '#5B6169',
        'ink-soft-dark': '#9AA0A6',
        hairline: '#E4E3DE',
        'hairline-dark': '#242923',
        accent: '#2FA84F',
        'accent-dark': '#3FCB63',
        'accent-soft': '#E6F4EA',
        'accent-soft-dark': '#16261C',
        card: '#FFFFFF',
        'card-dark': '#171B18',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        plex: ['"IBM Plex Sans"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        toastIn: 'toastIn 0.3s ease-out',
        toastOut: 'toastOut 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        toastIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        toastOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [function ({ addUtilities }) {
    addUtilities({
      '.loader-spin': {
        animation: 'spin 1.5s linear infinite',
      },
      '.loader-pulse': {
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    })
  }],
}
