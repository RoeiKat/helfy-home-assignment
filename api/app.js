const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/auth.routes");
const { checkDatabaseConnection } = require("./src/config/db");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      service: "api",
    });
  });

  app.get("/db-health", async (req, res) => {
    try {
      await checkDatabaseConnection();
      res.json({
        database: "connected",
      });
    } catch (error) {
      res.status(500).json({
        database: "disconnected",
        error: error.message,
      });
    }
  });

  app.use("/auth", authRoutes);

  app.use((req, res) => {
    res.status(404).json({
      message: "Route not found",
    });
  });

  return app;
}

module.exports = createApp;
