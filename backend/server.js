const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const entryRoutes = require("./routes/entries");
const settingsRoutes = require("./routes/settings");
const authRoutes = require("./routes/auth");
const { requireAuth } = require("./middleware/auth");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

app.use("/api/auth", authRoutes);
app.use("/api/entries", requireAuth, entryRoutes);
app.use("/api/settings", requireAuth, settingsRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "MindGarden API is alive",
    ai: {
      enabled: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    },
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`MindGarden server running on http://localhost:${PORT}`);
  });
});
