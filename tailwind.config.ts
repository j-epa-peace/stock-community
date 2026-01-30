import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          750: '#2d3748',
          800: '#1f2937',
          850: '#1a202c',
          900: '#111827',
          950: '#0f172a',
        },
        primary: {
          50: '#1e1b4b',
          100: '#312e81',
          200: '#3730a3',
          300: '#4338ca',
          400: '#5b21b6',
          500: '#7c3aed',
          600: '#8b5cf6',
          700: '#a78bfa',
          800: '#c4b5fd',
          900: '#ddd6fe',
        },
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          card: '#334155',
          border: '#475569',
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
            muted: '#94a3b8',
          }
        }
      },
      backgroundColor: {
        'dark-primary': '#0f172a',
        'dark-secondary': '#1e293b',
        'dark-card': '#334155',
      },
      borderColor: {
        'dark-border': '#475569',
      },
      textColor: {
        'dark-primary': '#f8fafc',
        'dark-secondary': '#cbd5e1',
        'dark-muted': '#94a3b8',
      },
      boxShadow: {
        'glow-white': '0 0 15px rgba(255, 255, 255, 0.3)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.5)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      dropShadow: {
        'glow-white': '0 0 8px rgba(255, 255, 255, 0.5)',
        'glow-primary': '0 0 8px rgba(124, 58, 237, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
export default config