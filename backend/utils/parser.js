/**
 * utils/parser.js — Rule-Based NLP Parser for MindGarden
 *
 * This is the "brain" of MindGarden. It takes raw user text and returns
 * a structured object with:
 *   - type    : task | note | reminder | idea
 *   - tags    : array of semantic labels
 *   - dueDate : parsed Date object or null
 *   - summary : short 1-line summary
 *
 * Strategy: Simple keyword matching + date parsing.
 * No machine learning required — easy to understand and extend.
 */

// ──────────────────────────────────────────────
// Keyword Maps
// ──────────────────────────────────────────────

/**
 * Maps keyword patterns to entry types.
 * The first matching rule wins, so order from most specific to most general.
 */
const TYPE_RULES = [
  // Reminder keywords
  { keywords: ["remind", "reminder", "don't forget", "dont forget", "alert", "notify", "alarm", "schedule"], type: "reminder" },
  // Idea keywords
  { keywords: ["idea:", "idea -", "idea—", "thought:", "concept:", "what if", "what about", "brainstorm", "maybe we", "maybe i"], type: "idea" },
  // Task keywords (action verbs / obligation words)
  { keywords: ["finish", "complete", "submit", "do ", "need to", "have to", "must", "buy", "get ", "pick up", "call ", "fix ", "send ", "write ", "prepare", "review", "update", "check ", "clean", "book ", "pay ", "apply", "register", "build", "create", "make ", "deadline", "due "], type: "task" },
];

/**
 * Maps keyword patterns to semantic tags.
 * Multiple tags can apply to one entry.
 */
const TAG_RULES = [
  { keywords: ["assignment", "exam", "study", "class", "lecture", "homework", "course", "college", "university", "school", "dbms", "dsa", "os ", "quiz", "test ", "interview", "coding"], tag: "study" },
  { keywords: ["meeting", "project", "deadline", "client", "office", "work", "boss", "team", "sprint", "standup", "presentation", "report", "email", "slack"], tag: "work" },
  { keywords: ["mom", "dad", "family", "friend", "personal", "birthday", "anniversary", "party", "home", "house"], tag: "personal" },
  { keywords: ["gym", "health", "doctor", "medicine", "workout", "exercise", "diet", "calories", "sleep", "mental", "therapy", "hospital", "appointment"], tag: "health" },
  { keywords: ["urgent", "asap", "immediately", "critical", "emergency", "right now", "today", "tonight", "important"], tag: "urgent" },
  { keywords: ["buy", "get ", "grocery", "groceries", "milk", "eggs", "bread", "store", "shop", "order", "amazon", "flipkart"], tag: "shopping" },
];

// ──────────────────────────────────────────────
// Type Detection
// ──────────────────────────────────────────────

/**
 * detectType(text)
 * Scans the text against TYPE_RULES and returns the matched type.
 * Falls back to "note" if nothing matches.
 *
 * @param {string} text - lowercased user input
 * @returns {string} - "task" | "note" | "reminder" | "idea"
 */
const detectType = (text) => {
  for (const rule of TYPE_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.type;
    }
  }
  return "note"; // Default if nothing else matches
};

// ──────────────────────────────────────────────
// Tag Detection
// ──────────────────────────────────────────────

/**
 * detectTags(text)
 * Finds all applicable semantic tags for the given text.
 * Returns an empty array if no tags match.
 *
 * @param {string} text - lowercased user input
 * @returns {string[]} - array of matched tags
 */
const detectTags = (text) => {
  const tags = [];
  for (const rule of TAG_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      tags.push(rule.tag);
    }
  }
  return tags;
};

// ──────────────────────────────────────────────
// Date Parsing
// ──────────────────────────────────────────────

/**
 * parseDate(text)
 * Attempts to extract a due date from natural language phrases.
 *
 * Handles:
 *  - "today", "tonight"
 *  - "tomorrow", "tmrw"
 *  - "next week"
 *  - Day names: "monday", "tuesday", ... "sunday"
 *  - "in X days"
 *  - "friday evening", "monday morning" etc.
 *
 * @param {string} text - lowercased user input
 * @returns {Date|null} - parsed Date or null
 */
const parseDate = (text) => {
  const now = new Date();

  // Helper: returns a Date set to the given number of days from today
  const daysFromNow = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() + n);
    return d;
  };

  // Today or tonight
  if (text.includes("tonight") || text.includes("today")) {
    const d = new Date(now);
    // "tonight" → set to 8 PM
    if (text.includes("tonight")) d.setHours(20, 0, 0, 0);
    return d;
  }

  // Tomorrow
  if (text.includes("tomorrow") || text.includes("tmrw")) {
    const d = daysFromNow(1);
    // If "evening" is mentioned, set 6 PM
    if (text.includes("evening")) d.setHours(18, 0, 0, 0);
    // If "morning" is mentioned, set 9 AM
    else if (text.includes("morning")) d.setHours(9, 0, 0, 0);
    // If "afternoon" is mentioned, set 2 PM
    else if (text.includes("afternoon")) d.setHours(14, 0, 0, 0);
    return d;
  }

  // Next week
  if (text.includes("next week")) {
    return daysFromNow(7);
  }

  // Named days of the week (find the next occurrence)
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  for (let i = 0; i < days.length; i++) {
    if (text.includes(days[i])) {
      const todayIndex = now.getDay(); // 0 = Sunday
      let diff = i - todayIndex;
      if (diff <= 0) diff += 7; // Always go to the NEXT occurrence
      return daysFromNow(diff);
    }
  }

  // "in X days" — e.g., "in 3 days"
  const inDaysMatch = text.match(/in (\d+) days?/);
  if (inDaysMatch) {
    return daysFromNow(parseInt(inDaysMatch[1], 10));
  }

  // "by X" with a date pattern (e.g. "by 25th") — basic day-of-month
  const byDayMatch = text.match(/by (\d{1,2})(st|nd|rd|th)?/);
  if (byDayMatch) {
    const d = new Date(now);
    d.setDate(parseInt(byDayMatch[1], 10));
    if (d < now) d.setMonth(d.getMonth() + 1); // Move to next month if past
    return d;
  }

  return null; // No date found
};

// ──────────────────────────────────────────────
// Summary Generator
// ──────────────────────────────────────────────

/**
 * generateSummary(text)
 * Creates a short 1-line summary for long entries.
 * For short text (under 60 chars), returns the text as-is.
 * For longer text, intelligently truncates at a word boundary.
 *
 * @param {string} text - original (non-lowercased) user input
 * @returns {string} - short summary
 */
const generateSummary = (text) => {
  const cleaned = text.trim();

  // Short enough — no summary needed
  if (cleaned.length <= 60) return cleaned;

  // Remove filler starters like "remind me to", "i need to", "don't forget to"
  const stripped = cleaned
    .replace(/^(remind me to|i need to|i have to|don't forget to|please |note:|idea:|thought:)\s*/i, "")
    .trim();

  // Capitalize first letter
  const capitalized = stripped.charAt(0).toUpperCase() + stripped.slice(1);

  // Truncate at 60 characters at a word boundary
  if (capitalized.length <= 60) return capitalized;

  const words = capitalized.split(" ");
  let summary = "";
  for (const word of words) {
    if ((summary + " " + word).trim().length > 60) break;
    summary = (summary + " " + word).trim();
  }

  return summary + "…";
};

// ──────────────────────────────────────────────
// Main Parser Export
// ──────────────────────────────────────────────

/**
 * parseEntry(rawText)
 * The main function — takes raw user input and returns a structured object.
 *
 * Example:
 *   Input:  "Remind me to call mom tomorrow evening"
 *   Output: { type: "reminder", tags: ["personal"], dueDate: <Date>, summary: "Call mom" }
 *
 * @param {string} rawText - original user input
 * @returns {{ type, tags, dueDate, summary }}
 */
const parseEntry = (rawText) => {
  const lower = rawText.toLowerCase();

  const type = detectType(lower);
  const tags = detectTags(lower);
  const dueDate = parseDate(lower);
  const summary = generateSummary(rawText);

  return { type, tags, dueDate, summary };
};

module.exports = { parseEntry };
