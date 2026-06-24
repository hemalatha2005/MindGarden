/**
 * controllers/entryController.js — CRUD Logic for MindGarden Entries
 *
 * Each function handles one type of API request:
 *  - createEntry  : POST /api/entries
 *  - getAllEntries : GET  /api/entries
 *  - updateEntry  : PATCH /api/entries/:id
 *  - deleteEntry  : DELETE /api/entries/:id
 *
 * The controller calls the AI parser to classify input before saving.
 * If no API key is configured, it falls back to local rules.
 */

const Entry = require("../models/Entry");
const { parseEntryWithAI } = require("../services/aiParser");

// ──────────────────────────────────────────────
// CREATE — POST /api/entries
// ──────────────────────────────────────────────

/**
 * createEntry
 * 1. Receives raw text from the frontend
 * 2. Runs it through the NLP parser
 * 3. Saves the structured entry to MongoDB Atlas
 * 4. Returns the saved entry as JSON
 */
const createEntry = async (req, res) => {
  try {
    const { text } = req.body;

    // Validate that text was actually provided
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Please provide some text to capture." });
    }

    // Ask the LLM to extract structure. If no API key is configured, it falls
    // back to the local rule parser so the app remains usable while learning.
    const { type, tags, dueDate, summary, parsedBy, aiModel } = await parseEntryWithAI(text);

    // Build and save the new entry document
    const entry = await Entry.create({
      text: text.trim(),
      type,
      tags,
      dueDate,
      summary,
      parsedBy,
      aiModel,
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error("Error creating entry:", error.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// ──────────────────────────────────────────────
// READ — GET /api/entries
// ──────────────────────────────────────────────

/**
 * getAllEntries
 * Fetches all entries from the database.
 * Supports optional query filters:
 *  - ?type=task       → filter by type
 *  - ?completed=false → filter by completion status
 *  - ?tag=urgent      → filter by a specific tag
 * Always sorts newest first.
 */
const getAllEntries = async (req, res) => {
  try {
    const filter = {};

    // Apply optional type filter (e.g., ?type=reminder)
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Apply optional completion filter (e.g., ?completed=false)
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === "true";
    }

    // Apply optional tag filter (e.g., ?tag=urgent)
    if (req.query.tag) {
      filter.tags = { $in: [req.query.tag] };
    }

    // Fetch and sort: newest entries appear first
    const entries = await Entry.find(filter).sort({ createdAt: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error.message);
    res.status(500).json({ error: "Failed to fetch entries." });
  }
};

// ──────────────────────────────────────────────
// UPDATE — PATCH /api/entries/:id
// ──────────────────────────────────────────────

/**
 * updateEntry
 * Partially updates an entry (e.g., mark as completed, edit text).
 * Only the fields provided in the request body are changed.
 */
const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If the text is being updated, re-run the parser
    if (updates.text) {
      const { type, tags, dueDate, summary, parsedBy, aiModel } = await parseEntryWithAI(updates.text);
      updates.type = type;
      updates.tags = tags;
      updates.dueDate = dueDate;
      updates.summary = summary;
      updates.parsedBy = parsedBy;
      updates.aiModel = aiModel;
    }

    // new: true returns the updated document instead of the old one
    const updated = await Entry.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updated) {
      return res.status(404).json({ error: "Entry not found." });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating entry:", error.message);
    res.status(500).json({ error: "Failed to update entry." });
  }
};

// ──────────────────────────────────────────────
// DELETE — DELETE /api/entries/:id
// ──────────────────────────────────────────────

/**
 * deleteEntry
 * Permanently removes an entry from the database.
 */
const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Entry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Entry not found." });
    }

    res.status(200).json({ message: "Entry cleared from your garden 🌿" });
  } catch (error) {
    console.error("Error deleting entry:", error.message);
    res.status(500).json({ error: "Failed to delete entry." });
  }
};

module.exports = { createEntry, getAllEntries, updateEntry, deleteEntry };
