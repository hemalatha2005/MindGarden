const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Entry text is required"],
      trim: true,
      maxlength: [2000, "Entry cannot exceed 2000 characters"],
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["task", "note", "reminder", "idea"],
      default: "note",
    },
    tags: {
      type: [String],
      enum: ["study", "work", "personal", "health", "urgent", "shopping", "finance", "career", "home", "general"],
      default: [],
    },
    summary: {
      type: String,
      default: "",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    parsedBy: {
      type: String,
      enum: ["ai", "rules"],
      default: "rules",
    },
    aiModel: {
      type: String,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Entry", EntrySchema);
