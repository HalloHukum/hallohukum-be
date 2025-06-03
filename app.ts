import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// import swaggerUi from "swagger-ui-express";
import { connectDB } from "./configs/mongoose.config";
// import { swaggerSpec } from "./configs/swagger.config";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./routes";


dotenv.config(); // Load .env first!

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API Documentation
// app.use(
//   "/docs",
//   [swaggerUi.serve],
//   swaggerUi.setup(swaggerSpec, {
//     customCss: `
//       .swagger-ui .topbar { display: none }
//     `,
//   })
// );

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
