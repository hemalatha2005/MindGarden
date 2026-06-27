const TYPE_RULES = [
  { keywords: ["remind", "reminder", "don't forget", "dont forget", "alert", "notify", "alarm", "schedule"], type: "reminder" },
  { keywords: ["idea:", "idea -", "idea-", "thought:", "concept", "possibility", "what if", "what about", "brainstorm", "maybe we", "maybe i"], type: "idea" },
  { keywords: ["finish", "complete", "submit", "need to", "have to", "must", "buy", "get ", "pick up", "call ", "fix ", "send ", "write ", "prepare", "review", "update", "check ", "clean", "book ", "pay ", "apply", "register", "build", "create", "make ", "deadline", "due "], type: "task" },
];

const TAG_RULES = [
  { keywords: ["assignment", "exam", "study", "class", "lecture", "homework", "course", "college", "university", "school", "dbms", "dsa", "os ", "quiz", "test ", "interview", "coding", "biology", "science", "cell", "mitochondria"], tag: "study" },
  { keywords: ["meeting", "project", "deadline", "client", "office", "work", "boss", "team", "sprint", "standup", "presentation", "report", "email", "slack"], tag: "work" },
  { keywords: ["mom", "dad", "family", "friend", "personal", "birthday", "anniversary", "party", "home"], tag: "personal" },
  { keywords: ["gym", "health", "doctor", "medicine", "workout", "exercise", "diet", "calories", "sleep", "mental", "therapy", "hospital", "appointment"], tag: "health" },
  { keywords: ["urgent", "asap", "immediately", "critical", "emergency", "right now", "today", "tonight", "important"], tag: "urgent" },
  { keywords: ["buy", "get ", "grocery", "groceries", "milk", "eggs", "bread", "store", "shop", "order", "amazon", "flipkart"], tag: "shopping" },
];

const hasIdeaIntent = (text) =>
  [
    /\bidea\b/,
    /\bconcept\b/,
    /\bpossibility\b/,
    /\bwhat if\b/,
    /\bbrainstorm\b/,
    /\bmaybe (we|i)\b/,
    /\b(start|open|launch)\s+(a|an|my|our)?\s*(cafe|business|startup|company|shop|store|restaurant|brand|app|website|platform|service)\b/,
  ].some((pattern) => pattern.test(text));

const detectType = (text) => {
  if (text.startsWith("/task")) return "task";
  if (text.startsWith("/note")) return "note";
  if (text.startsWith("/reminder")) return "reminder";
  if (text.startsWith("/idea")) return "idea";
  if (hasIdeaIntent(text)) return "idea";

  for (const rule of TYPE_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) return rule.type;
  }

  return "note";
};

const detectTags = (text) => {
  const tags = [];
  for (const rule of TAG_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) tags.push(rule.tag);
  }
  return tags;
};

const parseDate = (text) => {
  const now = new Date();
  const daysFromNow = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() + n);
    return d;
  };

  if (/\b(eod|end of day|end-of-day)\b/.test(text)) {
    const d = new Date(now);
    d.setHours(17, 0, 0, 0);
    return d;
  }

  if (text.includes("tonight") || text.includes("today")) {
    const d = new Date(now);
    if (text.includes("tonight")) d.setHours(20, 0, 0, 0);
    return d;
  }

  if (text.includes("tomorrow") || text.includes("tmrw") || text.includes("tommorow") || text.includes("tomorow")) {
    const d = daysFromNow(1);
    if (text.includes("evening")) d.setHours(18, 0, 0, 0);
    else if (text.includes("morning")) d.setHours(9, 0, 0, 0);
    else if (text.includes("afternoon")) d.setHours(14, 0, 0, 0);
    return d;
  }

  if (text.includes("next week")) return daysFromNow(7);

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  for (let i = 0; i < days.length; i++) {
    if (text.includes(days[i])) {
      let diff = i - now.getDay();
      if (diff <= 0) diff += 7;
      return daysFromNow(diff);
    }
  }

  const inDaysMatch = text.match(/in (\d+) days?/);
  if (inDaysMatch) return daysFromNow(parseInt(inDaysMatch[1], 10));

  const byDayMatch = text.match(/by (\d{1,2})(st|nd|rd|th)?/);
  if (byDayMatch) {
    const d = new Date(now);
    d.setDate(parseInt(byDayMatch[1], 10));
    if (d < now) d.setMonth(d.getMonth() + 1);
    return d;
  }

  return null;
};

const generateSummary = (text) => {
  const cleaned = text.trim();
  const stripped = cleaned
    .replace(/^(remind me\s+(today|tomorrow|tonight|by eod|at eod|on \w+)?\s*to|remind me to|i need to|i have to|don't forget to|please |note:|idea:|thought:|\/task|\/note|\/reminder|\/idea)\s*/i, "")
    .trim();
  const source = stripped || cleaned;
  const capitalized = source.charAt(0).toUpperCase() + source.slice(1);

  if (capitalized.length <= 60) return capitalized;

  const words = capitalized.split(" ");
  let summary = "";
  for (const word of words) {
    if ((summary + " " + word).trim().length > 60) break;
    summary = (summary + " " + word).trim();
  }

  return `${summary}...`;
};

const parseEntry = (rawText) => {
  const lower = rawText.toLowerCase();
  let type = detectType(lower);
  const tags = detectTags(lower);
  const dueDate = parseDate(lower);

  if (dueDate && !lower.startsWith("/task") && !lower.startsWith("/note") && !lower.startsWith("/idea") && !lower.startsWith("/reminder")) {
    type = "reminder";
  }

  return { type, tags, dueDate, summary: generateSummary(rawText) };
};

const parseMultipleEntries = (rawText) =>
  rawText
    .split(/\s+and\s+(?=remind|need|idea|note)/i)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => parseEntry(chunk));

module.exports = { parseEntry, parseMultipleEntries };
