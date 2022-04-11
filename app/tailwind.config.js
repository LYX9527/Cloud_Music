module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
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
