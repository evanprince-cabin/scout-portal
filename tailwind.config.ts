import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cabin-linen':    '#F5F3F1',
        'cabin-maroon':   '#4B0214',
        'cabin-mauve':    '#E9DBDE',
        'cabin-gold':     '#FFBC1F',
        'cabin-flame':    '#F55B0D',
        'cabin-sky':      '#BFCBFF',
        'cabin-indigo':   '#4460D8',
        'cabin-white':    '#FFFFFF',
        'cabin-stone':    '#6E6D6C',
        'cabin-charcoal': '#221C1C',
        'cabin-lime':     '#DBFA85',
        'cabin-grass':    '#5CA783',
        'cabin-lilac':    '#D8B5DB',
        'cabin-mulberry': '#8F6593',
      },
      fontFamily: {
        geist: ['var(--font-geist-sans)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
