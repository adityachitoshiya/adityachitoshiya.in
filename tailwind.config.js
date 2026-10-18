/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#050816',
        'space-indigo': '#1a1a2e',
        'neon-cyan': '#00cea8',
        'neon-violet': '#915eff',
        'holo-pink': '#ff0080',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'], // For headers
        space: ['Space Grotesk', 'sans-serif'], // For mono-like text
      },
      backgroundImage: {
        'hero-pattern': "url('/bg-grid.svg')", // We'll need to generate or simulate this
        'hologram-gradient': 'linear-gradient(135deg, rgba(0, 206, 168, 0.1) 0%, rgba(145, 94, 255, 0.1) 100%)',
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'pulse-glow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
