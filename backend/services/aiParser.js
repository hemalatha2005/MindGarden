const { parseEntry } = require("../utils/parser");

const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

const ALLOWED_TYPES = ["task", "note", "reminder", "idea"];
const ALLOWED_TAGS = [
  "study",
  "work",
  "personal",
  "health",
  "urgent",
  "shopping",
  "finance",
  "career",
  "home",
  "general",
];

const systemPrompt = `
You are the AI brain for a lightweight personal productivity capture tool.
Convert one natural-language capture into structured JSON for storage.

Rules:
- type must be one of: task, note, reminder, idea.
- Classify early-stage concepts, possibilities, business ideas, app ideas, startup ideas,
  and phrases like "start a cafe" as idea unless the user clearly assigns an action/deadline.
- If the user uses the word "idea" anywhere, type should be idea.
- tags must be short lowercase semantic labels from this set when possible:
  study, work, personal, health, urgent, shopping, finance, career, home, general.
- summary must be a clear one-line summary, maximum 80 characters.
- summary must be self-contained. Do not use vague pronouns like "it", "this", or "that"
  when the object can be named from the capture.
- dueDate must be an ISO 8601 date/time string when the user mentions a date or reminder time.
- If there is no due date, use null.
- completed must always be false for a new capture.
- Return only valid JSON. No markdown.
`.trim();

const buildUserPrompt = (text, now) => `
Current date/time: ${now.toISOString()}
User capture: ${text}

Return this exact JSON shape:
{
  "type": "task",
  "tags": ["work"],
  "summary": "Short summary",
  "dueDate": null,
  "completed": false
}
`.trim();

const cleanType = (type) => {
  const normalized = String(type || "").toLowerCase();
  return ALLOWED_TYPES.includes(normalized) ? normalized : "note";
};

const cleanTags = (tags) => {
  if (!Array.isArray(tags)) return ["general"];

  const unique = [
    ...new Set(
      tags
        .map((tag) => String(tag || "").toLowerCase().trim())
        .filter((tag) => ALLOWED_TAGS.includes(tag))
    ),
  ];

  return unique.length > 0 ? unique.slice(0, 4) : ["general"];
};

const cleanDueDate = (dueDate) => {
  if (!dueDate) return null;
  const parsed = new Date(dueDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const hasVaguePronoun = (text) => /\b(it|this|that|them)\b/i.test(text);

const normalizeAIResult = (raw, originalText, model) => {
  const rulesResult = parseEntry(originalText);
  const aiSummary = String(raw.summary || originalText).trim().slice(0, 80);
  const rulesSummary = String(rulesResult.summary || "").trim();
  const summary = hasVaguePronoun(aiSummary) && rulesSummary && !hasVaguePronoun(rulesSummary)
    ? rulesSummary
    : aiSummary;
  const type = rulesResult.type === "idea" ? "idea" : cleanType(raw.type);

  return {
    type,
    tags: cleanTags(raw.tags),
    dueDate: cleanDueDate(raw.dueDate),
    summary: summary || originalText.trim().slice(0, 80),
    parsedBy: "ai",
    aiModel: model,
  };
};

const parseWithRules = (text) => ({
  ...parseEntry(text),
  parsedBy: "rules",
  aiModel: null,
});

const parseEntryWithAI = async (text) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return parseWithRules(text);
  }

  try {
    const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: buildUserPrompt(text, new Date()) },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("AI parsing failed, using rules fallback:", errorText);
      return parseWithRules(text);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return parseWithRules(text);
    }

    return normalizeAIResult(JSON.parse(content), text, model);
  } catch (error) {
    console.warn("AI parsing failed, using rules fallback:", error.message);
    return parseWithRules(text);
  }
};

module.exports = { parseEntryWithAI };
