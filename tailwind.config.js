/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0A0A0F',
        'bg-surface': '#111118',
        'bg-surface-2': '#1A1A24',
        'bg-surface-3': '#22223A',
        primary: '#6C63FF',
        'primary-dark': '#5A52E0',
        'primary-light': '#8B84FF',
        accent: '#00D4FF',
        'accent-glow': '#00D4FF33',
        success: '#00E5A0',
        warning: '#FFB347',
        danger: '#FF5C74',
        'text-primary': '#F0EFFF',
        'text-secondary': '#8B8BA7',
        'text-muted': '#4A4A65',
        border: '#2A2A3D',
        'border-light': '#3A3A55',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #00D4FF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0F 0%, #111118 100%)',
        'gradient-card': 'linear-gradient(135deg, #1A1A24 0%, #111118 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, #6C63FF22 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(108, 99, 255, 0.3)',
        'glow-accent': '0 0 20px rgba(0, 212, 255, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(108, 99, 255, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(108, 99, 255, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
