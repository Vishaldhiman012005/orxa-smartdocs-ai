/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020817',
          900: '#040d21',
          800: '#071029',
          700: '#0a1535',
          600: '#0d1a3f',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          glow: '#00fff5',
        }
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Exo 2', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 255, 245, 0.3)',
        'cyan-glow-lg': '0 0 40px rgba(0, 255, 245, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'circuit': "url('/circuit-bg.svg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 245, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 245, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
