/**
 * models/UserSettings.js — Mongoose Schema for User Preferences
 *
 * Simple settings for MindGarden - just the essentials
 */

const mongoose = require("mongoose");

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "default",
      unique: true,
    },

    // UI
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },

    // Parser
    parserMode: {
      type: String,
      enum: ["rules-based", "ai"],
      default: "rules-based",
    },

    // Notifications
    enableNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserSettings", UserSettingsSchema);
