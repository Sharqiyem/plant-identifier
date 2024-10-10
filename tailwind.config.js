/** @type {import('tailwindcss').Config} */
const RADIUS = {
  base: 8, // This is equivalent to 0.5rem (8px)
  lg: 8,
  md: 6,
  sm: 4,
};

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {

      colors: {
        background: 'hsl(221.2 50% 10%)',
        foreground: 'hsl(221.2 5% 90%)',
        card: 'hsl(221.2 50% 10%)',
        'card-foreground': 'hsl(221.2 5% 90%)',
        popover: 'hsl(221.2 50% 5%)',
        'popover-foreground': 'hsl(221.2 5% 90%)',
        primary: 'hsl(221.2 83.2% 53.3%)',
        'primary-foreground': 'hsl(0 0% 100%)',
        secondary: 'hsl(11.2 83.2% 53.3%)',
        'secondary-foreground': 'hsl(0 0% 100%)',
        muted: 'hsl(183.2 30% 25%)',
        'muted-foreground': 'hsl(221.2 5% 60%)',
        accent: 'hsl(41.2 80% 60%)',
        'accent-foreground': 'hsl(221.2 5% 90%)',
        destructive: 'hsl(0 100% 30%)',
        danger: 'hsl(0 100% 30%)',
        'destructive-foreground': 'hsl(221.2 5% 90%)',
        border: 'hsl(221.2 30% 26%)',
        input: 'hsl(221.2 30% 26%)',
        ring: 'hsl(221.2 83.2% 53.3%)',
      },
      borderRadius: {
        lg: RADIUS.lg + 'px',
        md: RADIUS.md + 'px',
        sm: RADIUS.sm + 'px',
        DEFAULT: RADIUS.base + 'px',
      }
    }
  },
  plugins: [
    require('nativewind/tailwind/native'),
    // Add a custom plugin for elevation
    function ({ addUtilities }) {
      const newUtilities = {
        '.elevation-1': {
          elevation: 1
        },
        '.elevation-2': {
          elevation: 2
        },
        '.elevation-3': {
          elevation: 3
        },
        '.elevation-4': {
          elevation: 4
        },
        '.elevation-5': {
          elevation: 5
        }
      };
      addUtilities(newUtilities);
    }
  ]
};
