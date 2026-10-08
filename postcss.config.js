module.exports = {
  plugins: {
    // Tailwind v4 handles vendor prefixing itself via Lightning CSS — autoprefixer
    // is not needed and only slows the build down.
    "@tailwindcss/postcss": {},
  },
}