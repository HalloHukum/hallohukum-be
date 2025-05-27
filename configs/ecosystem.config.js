module.exports = {
  apps: [
    {
      name: "hallohukum",
      script: "./dist/app.js",
      env: {
        NODE_ENV: "production",
        JWT_SECRET: process.env.JWT_SECRET,
        PORT: process.env.PORT,
        MONGODB_URI: process.env.MONGODB_URI,
        GETSTREAM_API_KEY: process.env.GETSTREAM_API_KEY,
        GETSTREAM_API_SECRET: process.env.GETSTREAM_API_SECRET,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        REDIS_PORT: process.env.REDIS_PORT,
        REDIS_HOST: process.env.REDIS_HOST,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
      },
    },
  ],
};
