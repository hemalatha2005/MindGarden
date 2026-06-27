# 🌿 MindGarden — Personal Productivity Capture Assistant

> A calm, humane space to capture your thoughts — tasks, notes, reminders, and ideas — using natural language.

## ✨ What is MindGarden?

MindGarden is designed to feel **calm, simple, and focused** — like a digital garden where your notes can grow instead of noise.

Just type (or speak) anything on your mind:
- `"Remind me to call mom tomorrow evening"` → Reminder, tagged `personal`, due tomorrow
- `"Need to finish DBMS assignment before Friday"` → Task, tagged `study`, due Friday
- `"Idea: build AI resume reviewer"` → Idea, tagged `work`
- `"Buy milk, eggs, and bread"` → Task, tagged `shopping`

---

## Folder Structure

```
C:\ProductivityCaptureTool\
├── backend/
│   ├── controllers/entryController.js   # CRUD logic
│   ├── models/Entry.js                  # Mongoose schema
│   ├── models/UserSettings.js           # User settings schema
│   ├── routes/entries.js                # REST routes
│   ├── routes/auth.js                   # OTP auth routes
│   ├── services/aiParser.js             # Optional AI parser integration
│   ├── utils/parser.js                  # Rule-based NLP parser
│   ├── .env                             # Your secrets (not committed)
│   ├── .env.example                     # Template
│   └── server.js                        # Express entry point
│
└── frontend/
    ├── public/
    │   ├── favicon.svg                 # Browser tab icon
    │   └── index.html                  # App shell
    ├── src/
    │   ├── App.jsx                     # Main app routing
    │   ├── main.jsx                    # Vite entry point
    │   ├── index.css                   # Global styles
    │   ├── components/
    │   │   ├── AuthGate.jsx            # OTP sign-in gate
    │   │   ├── CaptureBar.jsx          # Entry input + voice mic
    │   │   ├── EmptyState.jsx          # Empty inbox state
    │   │   ├── EntryCard.jsx           # Entry list item
    │   │   ├── EntryDetailModal.jsx    # Entry edit modal
    │   │   ├── InsightPanel.jsx        # Sidebar stats + insights
    │   │   ├── Sidebar.jsx              # Main navigation sidebar
    │   │   ├── SettingsContext.jsx     # Settings state loader
    │   │   └── TypeBadge.jsx           # Entry type indicator
    │   ├── pages/
    │   │   ├── GardenView.jsx          # Inbox / capture page
    │   │   └── FocusView.jsx           # Focus mode page
    │   └── utils/
    │       ├── api.js                  # Axios client
    │       ├── authApi.js              # Session + OTP helpers
    │       ├── settingsApi.js          # Settings API helpers
    │       └── voiceCapture.js         # Speech capture helper
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

> Note: The app currently uses only the main inbox and Focus Mode routes. Settings is not exposed in the sidebar navigation.

---

## Local Development

### Backend
```bash
cd C:\ProductivityCaptureTool\backend
npm install
# Create .env from .env.example and add your MONGO_URI
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd C:\ProductivityCaptureTool\frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

Run both terminals simultaneously.

---

## Frontend Routes

| Path | Page |
|------|------|
| `/` | Inbox / GardenView |
| `/focus` | Focus Mode |
| `*` | Redirects to `/` |

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/entries | Create entry |
| GET | /api/entries | Get all entries |
| GET | /api/entries?type=task | Filter by type |
| GET | /api/entries?completed=false | Filter by status |
| GET | /api/entries?tag=urgent | Filter by tag |
| PATCH | /api/entries/:id | Update entry |
| DELETE | /api/entries/:id | Delete entry |

### Example: Create Entry
```bash
curl -X POST http://localhost:5000/api/entries \
  -H "Content-Type: application/json" \
  -d '{"text": "Remind me to call mom tomorrow evening"}'
```

### Example Response
```json
{
  "_id": "6652a1b3c4f...",
  "text": "Remind me to call mom tomorrow evening",
  "type": "reminder",
  "tags": ["personal"],
  "summary": "Call mom",
  "dueDate": "2024-06-24T18:00:00.000Z",
  "completed": false,
  "createdAt": "2024-06-23T10:00:00.000Z"
}
```

---

## How the NLP Parser Works

Rule-based keyword matching — no ML required.

### Type Detection
| Keywords | Type |
|----------|------|
| remind, don't forget, alert | reminder |
| idea:, what if, brainstorm | idea |
| finish, submit, need to, buy | task |
| (everything else) | note |

### Tag Detection
| Keywords | Tag |
|----------|-----|
| exam, study, assignment, dsa | study |
| meeting, deadline, client | work |
| mom, family, personal | personal |
| gym, doctor, health | health |
| urgent, asap, critical | urgent |
| buy, grocery, milk | shopping |

### Date Parsing
| Phrase | Parsed Date |
|--------|-------------|
| today / tonight | Today (tonight = 8 PM) |
| tomorrow evening | Tomorrow 6 PM |
| next week | 7 days from now |
| friday | Next Friday |
| in 3 days | 3 days from now |

---

## Voice Input

Uses the browser's built-in Web Speech API — no external API keys.
- Works in: Chrome, Edge
- Click the microphone icon in the capture bar

---

## AI Parser Mode

MindGarden can use an LLM as the first parser when `OPENAI_API_KEY` is configured.

What the LLM does:
- Reads the user's natural-language capture
- Classifies it as `task`, `note`, `reminder`, or `idea`
- Creates semantic tags such as `study`, `work`, `urgent`, or `personal`
- Generates a short summary
- Extracts a due date when the user mentions one

If `OPENAI_API_KEY` is missing or the AI call fails, the backend falls back to rule-based parsing.

Add these to `backend/.env` to enable AI parsing:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

You can check whether AI mode is active at:

```bash
GET http://localhost:5000/api/health
```

---

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, MongoDB / Mongoose
- Auth: OTP sign in flow
- Voice: Web Speech API

---

*Built with calm, clarity, and a focus-first design.*
