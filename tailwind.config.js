/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        mist: '#f4f7fb',
        line: '#dbe4f0',
        brand: '#0f766e',
        accent: '#0f172a',
        danger: '#dc2626',
        dangerSoft: '#fff1f2',
      },
      boxShadow: {
        card: '0 20px 40px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['SUIT Variable', 'Pretendard Variable', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
