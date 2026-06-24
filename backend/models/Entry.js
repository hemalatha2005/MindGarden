/**
 * models/Entry.js — Mongoose Schema for a MindGarden Entry
 *
 * Every captured thought (task, note, reminder, idea) is stored
 * as an "Entry" document in MongoDB Atlas.
 *
 * Fields:
 *  - text       : The original raw text the user typed or spoke
 *  - type       : Auto-detected category (task | note | reminder | idea)
 *  - tags       : Array of semantic labels (study | work | personal | health | urgent)
 *  - summary    : Short 1-line summary generated for longer entries
 *  - dueDate    : Parsed date/time if the user mentioned one
 *  - completed  : Whether the entry has been marked done
 *  - createdAt  : Automatically set when the document is saved
 */

const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema(
  {
    // The raw, unmodified input from the user
    text: {
      type: String,
      required: [true, "Entry text is required"],
      trim: true,
      maxlength: [2000, "Entry cannot exceed 2000 characters"],
    },

    // Auto-classified intent category
    type: {
      type: String,
      enum: ["task", "note", "reminder", "idea"],
      default: "note",
    },

    // Semantic tags auto-assigned by the parser
    tags: {
      type: [String],
      enum: ["study", "work", "personal", "health", "urgent", "shopping", "finance", "career", "home", "general"],
      default: [],
    },

    // Short auto-generated summary (for long entries)
    summary: {
      type: String,
      default: "",
    },

    // Parsed due date/time (optional — only for reminders and dated tasks)
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

    // Tracks whether the user has resolved this entry
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the model so controllers can use it
module.exports = mongoose.model("Entry", EntrySchema);
