module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  // prefix:"tw-",
  theme: {
    extend: {
      lineHeight: {
        '12': '4rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
