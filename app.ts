import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { connectDB } from "./configs/mongoose.config";
import { swaggerSpec } from "./configs/swagger.config";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./routes";


dotenv.config(); // Load .env first!

// Check for JWT_SECRET
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  console.error(
    "FATAL ERROR: JWT_SECRET is not defined or is too short. Please set a strong secret of at least 32 characters."
  );
  process.exit(1);
}

const app = express();
app.use(helmet()); // Apply helmet middleware
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS;
    let allowedOrigins: string[];

    if (allowedOriginsEnv) {
      allowedOrigins = allowedOriginsEnv.split(',');
    } else {
      // Default/placeholder origins if the environment variable is not set
      allowedOrigins = ['http://localhost:3001', 'https://your-placeholder-frontend.com'];
    }

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

// API Documentation
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: `
      .swagger-ui .topbar { display: none }
    `,
  })
);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to HalloHukum API" });
});

app.use("/", routes);

// Error handling middleware must be registered last
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    errorHandler(err, req, res, next);
  }
);

// Connect to MongoDB and then start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.info(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
