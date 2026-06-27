const mongoose = require("mongoose");

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "default",
      unique: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    parserMode: {
      type: String,
      enum: ["rules-based", "ai"],
      default: "rules-based",
    },
    enableNotifications: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSettings", UserSettingsSchema);
