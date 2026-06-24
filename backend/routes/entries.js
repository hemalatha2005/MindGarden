/**
 * routes/entries.js — API Route Definitions for MindGarden Entries
 *
 * Maps HTTP methods + URL paths to controller functions.
 *
 * Routes:
 *  POST   /api/entries        → Create a new entry
 *  GET    /api/entries        → Get all entries (with optional filters)
 *  PATCH  /api/entries/:id    → Update a specific entry
 *  DELETE /api/entries/:id    → Delete a specific entry
 */

const express = require("express");
const router = express.Router();

const {
  createEntry,
  getAllEntries,
  updateEntry,
  deleteEntry,
} = require("../controllers/entryController");

// Create a new captured entry
router.post("/", createEntry);

// Fetch all entries (supports ?type=, ?completed=, ?tag= query params)
router.get("/", getAllEntries);

// Update a specific entry by its MongoDB _id
router.patch("/:id", updateEntry);

// Permanently delete a specific entry by its MongoDB _id
router.delete("/:id", deleteEntry);

module.exports = router;
