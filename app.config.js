// app.config.js
export default {
  expo: {
    name: "tu-app",
    slug: "tu-app",
    extra: {
      GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
    },
  },
};
