const Entry = require("../models/Entry");
const { parseEntryWithAI } = require("../services/aiParser");

const splitEntries = (text) => {
  const normalized = text
    .replace(/\s+/g, " ")
    .replace(/\s+(and|then|also)\s+(?=(remind me|remember to|don't forget|dont forget|need to|have to|submit|email|call|finish|complete|buy|send|idea:|note:))/gi, "|||")
    .replace(/[.;]\s+(?=(remind me|remember to|don't forget|dont forget|need to|have to|submit|email|call|finish|complete|buy|send|idea:|note:))/gi, "|||");

  return normalized
    .split("|||")
    .map((part) => part.trim())
    .filter(Boolean);
};

const extractActionObject = (text) => {
  const match = text.match(/\b(?:finish|complete|submit|send|email|write|prepare|review|update|fix|do)\s+(?:my\s+|the\s+|a\s+|an\s+)?(.+?)\s*$/i);
  if (!match) return null;

  return match[1]
    .replace(/\b(by|before|for|tomorrow|today|tonight|eod|end of day)\b.*$/i, "")
    .trim();
};

const resolveSplitReferences = (chunks) => {
  let lastObject = null;

  return chunks.map((chunk) => {
    const object = extractActionObject(chunk);
    if (object) lastObject = object;

    if (lastObject) {
      return chunk
        .replace(/\bsubmit it\b/i, `submit ${lastObject}`)
        .replace(/\bfinish it\b/i, `finish ${lastObject}`)
        .replace(/\bcomplete it\b/i, `complete ${lastObject}`)
        .replace(/\bsend it\b/i, `send ${lastObject}`);
    }

    return chunk;
  });
};

const createEntry = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        error: "Please provide some text to capture.",
      });
    }

    const chunks = resolveSplitReferences(splitEntries(text));

    const entriesToSave = await Promise.all(
      chunks.map(async (chunk) => {
        const parsed = await parseEntryWithAI(chunk);

        return {
          text: chunk.trim(),
          userEmail: req.user.email,
          type: parsed.type,
          tags: parsed.tags,
          dueDate: parsed.dueDate,
          summary: parsed.summary,
          parsedBy: parsed.parsedBy,
          aiModel: parsed.aiModel,
        };
      })
    );

    const savedEntries = await Entry.insertMany(entriesToSave);

    res.status(201).json(savedEntries);
  } catch (error) {
    console.error("Error creating entry:", error.message);
    res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
};

const getAllEntries = async (req, res) => {
  try {
    const filter = {};
    filter.userEmail = req.user.email;

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === "true";
    }

    if (req.query.tag) {
      filter.tags = { $in: [req.query.tag] };
    }

    const entries = await Entry.find(filter).sort({ createdAt: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error.message);
    res.status(500).json({ error: "Failed to fetch entries." });
  }
};

const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.text) {
      const parsed = await parseEntryWithAI(updates.text);
      updates.type = parsed.type;
      updates.tags = parsed.tags;
      updates.dueDate = parsed.dueDate;
      updates.summary = parsed.summary;
      updates.parsedBy = parsed.parsedBy;
      updates.aiModel = parsed.aiModel;
    }

    const updated = await Entry.findOneAndUpdate({ _id: id, userEmail: req.user.email }, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Entry not found." });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating entry:", error.message);
    res.status(500).json({ error: "Failed to update entry." });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Entry.findOneAndDelete({ _id: id, userEmail: req.user.email });

    if (!deleted) {
      return res.status(404).json({ error: "Entry not found." });
    }

    res.status(200).json({
      message: "Entry cleared from your garden 🌿",
    });
  } catch (error) {
    console.error("Error deleting entry:", error.message);
    res.status(500).json({ error: "Failed to delete entry." });
  }
};

module.exports = {
  createEntry,
  getAllEntries,
  updateEntry,
  deleteEntry,
};
