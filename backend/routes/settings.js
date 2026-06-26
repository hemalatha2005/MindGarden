const express = require("express");
const router = express.Router();
const UserSettings = require("../models/UserSettings");

const DEFAULT_SETTINGS = {
  theme: "light",
  parserMode: "rules-based",
  enableNotifications: true,
};

router.get("/", async (req, res) => {
  try {
    const userId = req.user.email;
    let settings = await UserSettings.findOne({ userId });

    if (!settings) {
      settings = new UserSettings({ ...DEFAULT_SETTINGS, userId });
      await settings.save();
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/", async (req, res) => {
  try {
    const userId = req.user.email;
    const updates = req.body;
    delete updates.userId;

    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
