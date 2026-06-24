# 🌿 MindGarden — Personal Productivity Capture Assistant

> A calm, humane space to capture your thoughts — tasks, notes, reminders, and ideas — using natural language.

## ✨ What is MindGarden?

MindGarden is unlike typical productivity dashboards. It's designed to feel **humane, calm, and emotionally intelligent** — like a digital garden where your thoughts can grow.

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
│   ├── routes/entries.js                # REST routes
│   ├── utils/parser.js                  # Rule-based NLP parser
│   ├── .env                             # Your secrets (not committed)
│   ├── .env.example                     # Template
│   └── server.js                        # Express entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CaptureBar.jsx           # Bottom input with voice
    │   │   ├── EntryCard.jsx            # Individual entry card
    │   │   ├── EmptyState.jsx           # Empty state display
    │   │   ├── FilterBar.jsx            # Filter pills
    │   │   └── TypeBadge.jsx            # Type indicator
    │   ├── pages/
    │   │   ├── GardenView.jsx           # Main garden page
    │   │   └── FocusView.jsx            # Urgent items view
    │   ├── utils/
    │   │   ├── api.js                   # Axios HTTP client
    │   │   └── voiceCapture.js          # Speech API wrapper
    │   └── App.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

---

## MongoDB Atlas Setup (Step-by-Step)

### Step 1: Create an Atlas Account
Go to https://www.mongodb.com/atlas and sign up free (M0 tier — no credit card).

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "M0 Free" tier
3. Pick cloud provider + region → Create Cluster

### Step 3: Create a Database User
1. Security → Database Access → Add New Database User
2. Authentication: Password
3. Username: `mindgarden-user`, set a password
4. Role: "Read and write to any database"

### Step 4: Whitelist Your IP
1. Security → Network Access → Add IP Address
2. For dev: "Allow Access From Anywhere"

### Step 5: Get the Connection String
1. Database → Connect → Drivers → Node.js
2. Copy the string:
   `mongodb+srv://<username>:<password>@cluster0.abc.mongodb.net/mindgarden?retryWrites=true&w=majority`
3. Replace `<username>` and `<password>`

### Step 6: Create backend/.env
```
MONGO_URI=mongodb+srv://mindgarden-user:yourpassword@cluster0.abc.mongodb.net/mindgarden?retryWrites=true&w=majority
PORT=5000
```

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

## Design System

| Token | Value |
|-------|-------|
| Background | #F7F5F2 |
| Primary | #5A7D7C (teal) |
| Accent | #D8B08C (sand) |
| Text | #2B2B2B |
| Font | Inter + Poppins |

---

## Voice Input

Uses the browser's built-in Web Speech API — no external API keys.
- Works in: Chrome, Edge
- Click the microphone icon in the capture bar

---

## GenAI / LLM Mode

MindGarden uses an LLM as the first parser when `OPENAI_API_KEY` is configured.

What the LLM does:
- Reads the user's natural-language capture
- Classifies it as `task`, `note`, `reminder`, or `idea`
- Creates semantic tags such as `study`, `work`, `urgent`, `career`, or `general`
- Generates a short summary
- Extracts a due date when the user mentions one

The app is beginner-friendly: if `OPENAI_API_KEY` is missing or the AI call fails, the backend automatically falls back to the original rule-based parser. Entries show an `AI` or `Rules` badge so you can tell which path was used.

Add these to `backend/.env` to enable real LLM parsing:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

You can check whether AI mode is active at:

```bash
GET http://localhost:5000/api/health
```

---

*Built with love for clarity, calm, and focus.*
