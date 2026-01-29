import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // 다크 모드 활성화
  theme: {
    extend: {
      colors: {
        // 다크 테마 색상 팔레트
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          750: '#2d3748', // 커스텀 다크 그레이
          800: '#1f2937',
          850: '#1a202c', // 커스텀 더 어두운 그레이
          900: '#111827',
          950: '#0f172a', // 커스텀 가장 어두운 그레이
        },
        primary: {
          50: '#1e1b4b',
          100: '#312e81',
          200: '#3730a3',
          300: '#4338ca',
          400: '#5b21b6', // 다크 테마용 보라색 계열
          500: '#7c3aed', // 메인 보라색
          600: '#8b5cf6', // 밝은 보라색
          700: '#a78bfa', // 더 밝은 보라색
          800: '#c4b5fd',
          900: '#ddd6fe',
        },
        // 다크 테마 전용 색상
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
      }
    },
  },
  plugins: [],
}
export default config