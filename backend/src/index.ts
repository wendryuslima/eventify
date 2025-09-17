import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { eventRoutes } from "./routes/events";
import { inscriptionRoutes } from "./routes/inscriptions";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/events", eventRoutes);
app.use("/api/events", inscriptionRoutes);

app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);

    if (err instanceof Error) {
      if (err.name === "ValidationError") {
        return res.status(400).json({
          error: "Validation Error",
          message: err.message,
        });
      }

      return res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
      });
    }

    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong",
    });
  }
);

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
