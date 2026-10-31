# ⚡ Sync-Space — AI-Powered Real-Time Team Collaboration Platform

Sync-Space is a full-stack **MERN + Socket.IO** workspace app where teams chat in real time, manage tasks on a Kanban board, invite members by email, and let an **AI project manager (Mistral via LangChain)** summarize progress, assign tasks fairly, and even **turn chat conversations into tasks that an admin approves**.

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Architecture](#-architecture)
4. [Project Structure](#-project-structure)
5. [Getting Started](#-getting-started)
6. [Environment Variables](#-environment-variables)
7. [API Reference](#-api-reference)
8. [Data Models](#-data-models)
9. [Real-Time Chat Design](#-real-time-chat-design)
10. [AI Features in Detail](#-ai-features-in-detail)
11. [Invite Flow](#-invite-flow)
12. [Deployment](#️-deployment)
13. [Interview Explanation Guide](#-interview-explanation-guide)

---

## ✨ Features

### 🔐 Authentication
- Register / login with email + password (bcrypt hashing)
- JWT stored in an **httpOnly cookie** (7-day expiry); session restored on refresh via `GET /api/auth/get-me`
- Server-side validation (username ≥ 3 chars; password ≥ 6 chars with an uppercase letter and a number)
- Protected frontend routes

### 🏢 Workspaces
- Create a workspace (becomes its **admin**), auto-generated **6-character join code**
- Join via code or via **email invitation link**
- Admin-only: rename/update workspace, remove members, delete workspace (cascades to its tasks and messages)

### 💬 Real-Time Chat
- Per-workspace chat rooms using **Socket.IO**
- Messages are **persisted in MongoDB** and broadcast to the room
- History loaded on workspace switch; live connection indicator; duplicate-message prevention

### ✅ Task Management
- **Kanban board**: To-Do → In-Progress → Review → Completed
- Priority (low / medium / high), due date, assignee, creator
- Create, update status, and delete tasks

### 🤖 AI Features (Mistral AI + LangChain)
| Feature | What it does |
|---|---|
| **Smart Summary** | Analyzes the workspace's tasks → summary, bottleneck, next steps, motivational note |
| **AI Task Assigner** | Type tasks in plain English → AI distributes them across members considering current workload, with a reason for each |
| **Chat → Tasks** | Admin clicks "Analyze chat" → AI reads the last 50 messages and extracts real action items with suggested assignees |
| **Human-in-the-loop approval** | AI tasks are saved as `Pending-Approval`; admin can edit, approve (→ `To-Do`) or reject (delete) each one |

### 📧 Email Invitations
- Admin invites one or many emails; each gets a **signed 48-hour JWT link**
- Sent through **Gmail OAuth2 (Nodemailer + googleapis)**
- Link is bound to the invited email address

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, Redux Toolkit, React Router 7, Tailwind CSS 4, Axios, Socket.IO client, Sonner (toasts), Lucide icons, react-markdown |
| **Backend** | Node.js (ES Modules), Express 5, Mongoose 9 |
| **Database** | MongoDB (Atlas) |
| **Real-time** | Socket.IO 4 |
| **AI** | LangChain (`PromptTemplate` → model → `StringOutputParser`), `@langchain/mistralai` (`mistral-small-latest`, temperature 0.3) |
| **Email** | Nodemailer + Google OAuth2 (`googleapis`) |
| **Auth/Security** | JWT, bcryptjs, cookie-parser, CORS (credentials), express-validator |

---

## 🏗️ Architecture

```
┌──────────────────────────┐   REST (axios, cookies)    ┌───────────────────────────────┐
│  React 19 + Redux Toolkit │ ─────────────────────────▶ │  Express 5 API                │
│  (Vite, Tailwind)         │                            │  routes → validate → auth →   │
│                           │ ◀───────────────────────── │  controllers → services       │
│  SocketContext            │                            └──────┬───────────┬────────────┘
│   └─ socket.io-client     │   WebSocket (new_message)         │           │
└─────────────▲─────────────┘ ◀─────────────────────────────────┤           │
              │                                           ┌──────▼─────┐ ┌───▼─────────────┐
              └────────── Socket.IO server (rooms) ◀──────┤  MongoDB   │ │ Mistral AI via  │
                                                          │  (Mongoose)│ │ LangChain       │
                                                          └────────────┘ └─────────────────┘
                                                                 Gmail OAuth2 ──▶ invite emails
```

**Backend** is layered: `routes → validators → auth middleware → controllers → services/models`.
**Frontend** is feature-based (`auth`, `chat`, `tasks`, `workspaces`, `ai-insights`, `invite`) with one Redux slice per feature and a `SocketContext` that wires the socket to Redux.

---

## 📂 Project Structure

```
Sync-Space/
├── Backend/
│   ├── server.js                     # HTTP server + Socket.IO setup, port 5000
│   └── src/
│       ├── app.js                    # Express app, CORS, routers, global error handler
│       ├── config/database.js
│       ├── controller/               # auth, workspace, task, message, ai, invite
│       ├── middleware/               # auth (JWT cookie), validate
│       ├── models/                   # user, workspace, task, message
│       ├── routes/                   # auth, workspace, tasks, messages, ai, invite
│       ├── services/ai.service.js    # LangChain + Mistral prompts
│       ├── sockets/socket.js         # rooms: join_workspace
│       ├── utils/generate.Token.js
│       └── validation/               # express-validator rule sets
│
└── Frontend/
    └── src/
        ├── App.jsx                   # Routes + session check
        ├── app/store.js              # Redux store
        ├── context/SocketContext.jsx # socket lifecycle, room join, history fetch
        ├── components/               # Sidebar, Navbar, Modal, Button, Input, ProtectedRoute...
        ├── pages/                    # Dashboard, Messages, WorkspaceSetting, JoinPage
        └── features/
            ├── auth/                 # Login, Register, auth.slice
            ├── chat/                 # ChatWindow, MessageItem, chatSlice
            ├── tasks/                # TaskBoard, TaskCard, taskSlice
            ├── workspaces/           # workspaceSlice
            ├── invite/               # InvitePanel
            └── ai-insights/          # Summary, AiTaskAssigner, ChatAnalyzer, PendingApprovals, ai.slice
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB connection string (Atlas or local)
- Mistral AI API key
- (Optional, for invites) Gmail OAuth2 credentials

### 1. Backend
```bash
cd Backend
npm install
# create .env (see below)
node server.js          # runs on http://localhost:5000
```
> Tip: add `"start": "node server.js"` and `"dev": "nodemon server.js"` to `Backend/package.json` scripts.

### 2. Frontend
```bash
cd Frontend
npm install
npm run dev             # http://localhost:5173
```
Optional: set `VITE_API_URL` (defaults to `http://localhost:5000/api`).

### 3. Try it
1. Register two users (use two browsers / an incognito window).
2. User A creates a workspace → shares the join code (or sends an email invite).
3. User B joins → chat in real time, create tasks, try the AI tools.

---

## 🔑 Environment Variables

`Backend/.env`:

```env
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<long-random-string>
MISTRAL_API_KEY=<mistral-api-key>
FRONTEND_URL=http://localhost:5173

# Only needed for email invitations
GMAIL_USER=<sender@gmail.com>
GMAIL_CLIENT_ID=<google-oauth-client-id>
GMAIL_CLIENT_SECRET=<google-oauth-client-secret>
GMAIL_REFRESH_TOKEN=<refresh-token-from-oauth-playground>
```

> ⚠️ Never commit `.env`. If real keys were ever shared or committed, **rotate them**.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api` — all routes except register/login/invite-verify require the `token` cookie.

### Auth — `/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create account |
| POST | `/login` | Login, sets httpOnly cookie |
| POST | `/logout` | Clears cookie |
| GET | `/get-me` | Current user |

### Workspaces — `/workspace`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` or `/my-spaces` | Member | Workspaces the user belongs to |
| POST | `/create` | User | Create workspace (caller = admin) |
| POST | `/join` | User | Join with 6-char `joinCode` |
| PATCH | `/:workspaceId` | Admin | Update name/description |
| DELETE | `/:workspaceId` | Admin | Delete workspace + tasks + messages |
| DELETE | `/:workspaceId/members/:memberId` | Admin | Remove a member |

### Tasks — `/tasks`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/?workspaceId=` | List tasks of a workspace |
| POST | `/` | Create task `{title, description, workspaceId, assignedTo, priority, dueDate}` |
| PATCH | `/:id` | Update status |
| DELETE | `/:id` | Delete task |

### Messages — `/messages`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/send` | Save message `{content, workspaceId}` and broadcast `new_message` to the room |
| GET | `/:workspaceId` | Chat history (oldest → newest) |

### AI — `/ai`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/summarize?workspaceId=` | Member | AI summary of workspace tasks |
| POST | `/assign-tasks` | Member | `{workspaceId, taskDescriptions[]}` → AI assignment suggestions |
| POST | `/analyze-chat` | **Admin** | Extract tasks from last 50 messages → saved as `Pending-Approval` |
| GET | `/pending-tasks?workspaceId=` | Admin UI | List pending AI tasks |
| PATCH | `/approve-task/:taskId` | Admin UI | Approve (optionally edit title/description/assignee/priority) → `To-Do` |
| DELETE | `/reject-task/:taskId` | Admin UI | Reject → delete |

### Invites — `/invite`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/:workspaceId` | Admin | `{emails: []}` → sends invite emails |
| GET | `/verify?token=` | Public | Validates token; joins the user if logged in |

---

## 🗄️ Data Models

| Model | Key fields |
|---|---|
| **User** | `username`, `email` (unique, lowercase), `password` (bcrypt), `avatar`, `role` (user/admin), `status` (online/offline/busy), `workspaces[]`, `lastActive` |
| **Workspace** | `name`, `description`, `joinCode` (unique), `admin` → User, `members[]` → User |
| **Task** | `title`, `description`, `status` (`Pending-Approval`, `To-Do`, `In-Progress`, `Review`, `Completed`), `priority`, `workspace`, `assignedTo`, `createdBy`, `dueDate`, `aiReasoning` |
| **Message** | `sender` → User, `content`, `workspace`, `attachments[]` |

All models use `timestamps: true`. Passwords are stripped from JSON output via `toJSON`.

---

## 🔌 Real-Time Chat Design

The key design decision: **one write path, HTTP + Socket.IO broadcast**.

1. Client sends the message with `POST /api/messages/send` (authenticated by cookie).
2. Controller saves it in MongoDB, populates the sender.
3. Controller emits `new_message` to the Socket.IO **room** named after the `workspaceId`.
4. Every client in that room (including the sender) receives it; `SocketContext` dispatches `addMessage` to Redux (with de-duplication).

Why not send through the socket directly? Messages sent only over the socket weren't persisted and could be duplicated. Routing through HTTP gives authentication via the existing cookie, validation, and guaranteed persistence, while Socket.IO is used purely for fan-out.

On workspace switch the client clears the chat, fetches history, and emits `join_workspace`; the server makes the socket leave old rooms and join the new one.

---

## 🤖 AI Features in Detail

All AI calls live in `services/ai.service.js` and use a LangChain pipeline:

```
PromptTemplate → ChatMistralAI (mistral-small-latest, temp 0.3) → StringOutputParser
```

- **Summary**: prompt requests Summary / Bottleneck / Next Steps / Motivation in Markdown (rendered with `react-markdown`).
- **Assignment & chat extraction**: the prompt injects the member list (with IDs), current workload (or chat transcript), and demands a **strict JSON array**. The code strips Markdown fences, `JSON.parse`s it, and validates it is an array. Low temperature keeps output stable.
- **Guardrails**: "only extract real tasks, don't invent any", empty array when nothing found, errors are caught and surfaced as clean API messages.
- **Human-in-the-loop**: AI never writes directly to the board. Suggestions become `Pending-Approval` tasks with `aiReasoning`; the admin reviews, edits, approves or rejects.

---

## 📧 Invite Flow

1. Admin enters emails → backend verifies admin ownership.
2. For each email: skip if already a member, else sign a **48h JWT** `{workspaceId, email}` and email a link `FRONTEND_URL/join?token=…` via Gmail OAuth2.
3. Invitee opens `/join`:
   - **Not logged in** → sees a workspace preview and is prompted to log in / register.
   - **Logged in** → backend checks the account email matches the invited email, then adds them to the workspace.

---

## ☁️ Deployment

| Part | Suggested host | Notes |
|---|---|---|
| **Frontend** | Vercel / Netlify | Build: `npm run build`, output: `dist`. Set `VITE_API_URL=https://<your-api-domain>/api` |
| **Backend** | Render / Railway | Start command: `node server.js` (supports WebSockets for Socket.IO) |
| **Database** | MongoDB Atlas | Allow the backend host's IP (or `0.0.0.0/0`) in Network Access |

Set the backend environment variables from the section above on the host, with `FRONTEND_URL` pointing to your deployed frontend URL (used for CORS, Socket.IO and invite links).

---



## 6️⃣ Live Demo Script

1. Register **User A** → create a workspace → show the join code.
2. In an incognito window register **User B** → join with the code (or via email invite).
3. Chat between both windows → show instant delivery and persistence after refresh.
4. Create tasks on the Kanban board and move status.
5. Chat something like *"Bob, please design the landing page by Friday. I'll handle the API."* → as admin click **Analyze Chat**.
6. Open **Pending Approvals** → edit one task, approve it, reject another → show the board update.
7. Run **AI Summary** and **AI Task Assigner** with a few plain-English tasks.
8. Close by showing the live deployed link and mentioning what you'd add next.

---



## 👨‍💻 Author
Built by **Seema Devi** — [GitHub](https://github.com/Seema-Devi2003) ·

