/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // 这里的 'nf' 就是你之后要用的 class 名字：font-nf
        'nf': ['JetBrainsMonoNF', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [
      require('@tailwindcss/typography'),
  ],
}
