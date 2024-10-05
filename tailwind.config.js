const Colors = require('./constants/ColorsWrapper');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(262 35% 10%)',
        foreground: 'hsl(0 0% 80%)',
        muted: 'hsl(262 20% 25%)',
        'muted-foreground': 'hsl(262 20% 80%)',
        popover: 'hsl(262 35% 9%)',
        'popover-foreground': 'hsl(0 0% 81%)',
        card: 'hsl(262 35% 11%)',
        'card-foreground': 'hsl(0 0% 79%)',
        border: 'hsl(262 20% 20%)',
        input: 'hsl(262 20% 30%)',
        primary: 'hsl(262 50% 55%)',
        'primary-foreground': 'hsl(262 90% 95%)',
        secondary: 'hsl(242 50% 55%)',
        'secondary-foreground': 'hsl(242 90% 95%)',
        accent: 'hsl(202 60% 55%)',
        'accent-foreground': 'hsl(202 90% 95%)',
        destructive: 'hsl(352 100% 35%)',
        'destructive-foreground': 'hsl(352 100% 95%)',
        ring: 'hsl(262 50% 50%)',
        danger: 'hsl(0 91% 49%)',
      },
    },
  },
  plugins: [require('nativewind/tailwind/native')],
};