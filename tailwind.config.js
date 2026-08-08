/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // legacy Vite tree — kept until cutover so nothing breaks mid-migration
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        paper: '#ffffff',
        // The single reserved accent — used ONLY for the agent-network data-flow pulse.
        // Candidate hue (electric cyan); final value confirmed live during Hero review.
        pulse: {
          DEFAULT: '#22d3ee',
          soft: 'rgba(34, 211, 238, 0.6)',
        },
      },
      fontFamily: {
        // wired to next/font CSS variable (set in app/layout.jsx)
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        // the two tracking values used across the whole site
        brand: '0.3em',
        wide2: '0.15em',
        tightest: '-0.04em', // display headline
      },
      transitionTimingFunction: {
        // the cubic-beziers literally repeated across the original components
        'brand-out': 'cubic-bezier(0.6, 0.01, 0.05, 0.95)', // section/letter reveals
        'brand-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',       // logo / soft moves
        'brand-snap': 'cubic-bezier(0.76, 0, 0.24, 1)',     // underlines
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(255,255,255,0.2)',
        'glow': '0 0 20px rgba(255,255,255,0.1)',
        'glow-lg': '0 0 30px rgba(255,255,255,0.3)', // button hover, used ~10x
      },
      dropShadow: {
        'logo': '0px 0px 20px rgba(255,255,255,0.9)',
      },
      zIndex: {
        behind: '-10',
        deep: '-20',
        content: '10',
        nav: '50',
        modal: '50',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
