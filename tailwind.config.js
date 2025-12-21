import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Map primary to the pink palette
        primary: colors.pink,
        secondary: colors.purple,
        accent: colors.teal,
        neutral: colors.gray,
        success: colors.green,
        info: colors.blue,
        warning: colors.amber,
        danger: colors.red,
      },
    },
  },
  plugins: [],
};
