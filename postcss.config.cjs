module.exports = {
  plugins: {
    tailwindcss: {},
    "tailwindcss/nesting": {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
}
