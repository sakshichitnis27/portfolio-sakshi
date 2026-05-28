/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#050005',
        surface: '#0d000d',
        card: '#130013',
        violet: {
          DEFAULT: '#9d4edd',
          light: '#c77dff',
          dim: 'rgba(157,78,221,0.18)',
        },
        pink: { accent: '#ff006e' },
        cyan: { accent: '#00d2ff' },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
