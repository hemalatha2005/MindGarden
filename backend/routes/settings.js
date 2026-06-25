/**
 * routes/settings.js — User Settings Routes
 *
 * GET  /api/settings  - Get current user settings
 * PATCH /api/settings - Update user settings
 */

const express = require("express");
const router = express.Router();
const UserSettings = require("../models/UserSettings");

const DEFAULT_SETTINGS = {
  userId: "default",
  theme: "light",
  parserMode: "rules-based",
  enableNotifications: true,
};

/**
 * GET /api/settings
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId || "default";
    let settings = await UserSettings.findOne({ userId });

    if (!settings) {
      settings = new UserSettings(DEFAULT_SETTINGS);
      await settings.save();
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PATCH /api/settings
 */
router.patch("/", async (req, res) => {
  try {
    const userId = req.body.userId || "default";
    const updates = req.body;
    delete updates.userId;

    let settings = await UserSettings.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
