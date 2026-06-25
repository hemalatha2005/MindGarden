/**
 * server.js — MindGarden Express Server Entry Point
 *
 * This file:
 *  1. Loads environment variables from .env
 *  2. Creates the Express app
 *  3. Connects to MongoDB Atlas via Mongoose
 *  4. Mounts all API routes
 *  5. Starts listening on the configured port
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const entryRoutes = require("./routes/entries");
const settingsRoutes = require("./routes/settings");

const app = express();

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────

// Allow requests from the React frontend (running on port 5173)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// ──────────────────────────────────────────────
// Database Connection — MongoDB Atlas
// ──────────────────────────────────────────────

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options ensure a secure, stable Atlas connection
      serverSelectionTimeoutMS: 5000, // Fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,         // Close idle sockets after 45 seconds
    });
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // Exit the process so the issue is immediately visible during development
    process.exit(1);
  }
};

// ──────────────────────────────────────────────
// API Routes
// ──────────────────────────────────────────────

// All entry-related routes live under /api/entries
app.use("/api/entries", entryRoutes);

// All settings-related routes live under /api/settings
app.use("/api/settings", settingsRoutes);

// Health check endpoint — useful for verifying the server is up
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "MindGarden API is alive 🌿",
    ai: {
      enabled: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    },
    timestamp: new Date().toISOString(),
  });
});

// ──────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

// Connect to Atlas first, then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 MindGarden server running on http://localhost:${PORT}`);
  });
});
