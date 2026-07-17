/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background, #0A0A0A)',
        primary: 'var(--color-primary, #FFFFFF)',
        muted: 'var(--color-muted, #B3B3B3)',
        accent: 'var(--color-accent, #F5A623)',
      },
      fontFamily: {
        heading: ['var(--font-heading, "Anton")', 'sans-serif'],
        body: ['var(--font-body, "Inter")', 'sans-serif'],
        script: ['var(--font-script, "Dancing Script")', 'cursive'],
      },
    },
  },
  plugins: [],
}
