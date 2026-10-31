# SyncSpaceAI

A real-time team workspace that listens to your chat and automatically surfaces the **commitments**,
**decisions**, and **blockers** buried in everyday conversation — plus lets you ask an AI assistant
questions about what your team has discussed, grounded in your own chat history.

Built as a full-stack MERN project with a real-time layer (Socket.IO) and a small RAG (retrieval-augmented
generation) pipeline on top of an LLM API and a vector database.

## Why this project

Most portfolio chat apps stop at "send and receive messages." SyncSpaceAI goes a step further:

- **Automatic signal detection** — every chat message is classified by an LLM as a `commitment`,
  `decision`, `blocker`, or `normal` message, and anything non-trivial is logged to the workspace's
  Insights feed.
- **Ask AI (RAG)** — every message is embedded and stored in Pinecone. "Ask AI" answers questions
  about the workspace by retrieving the most relevant past messages and passing them to the LLM as
  context, rather than hallucinating from nothing.
- **Workspace health score** — a simple derived metric (task completion rate minus a penalty per open
  blocker) that gives a team an at-a-glance read on how things are going.

## Tech stack

**Frontend:** React 19, React Router, Tailwind CSS v4, Socket.IO client, Axios, Vite
**Backend:** Node.js, Express 5, MongoDB + Mongoose, Socket.IO, JWT (access + refresh tokens)
**AI / data:** Mistral AI (chat completion + embeddings), Pinecone (vector search)

## Architecture

```
Frontend (Vite/React)  <---- REST (axios, httpOnly cookies) ---->  Backend (Express)
        |                                                                |
        '-------------------- WebSocket (Socket.IO) ---------------------'
                                                                          |
                                                          MongoDB  <------+------>  Pinecone
                                                        (users, workspaces,      (message embeddings
                                                         tasks, messages,          for Ask AI / RAG)
                                                         detected actions)              |
                                                                                    Mistral AI
                                                                              (classification, embeddings,
                                                                                   chat completion)
```

- Auth uses short-lived (15 min) access tokens + long-lived (7 day) refresh tokens, both as httpOnly
  cookies. The refresh token is also stored on the user document so it can be invalidated on logout.
- Chat messages are saved via a Socket.IO event, broadcast to everyone in the workspace room, then
  asynchronously classified and embedded — so sending a message never blocks on the AI calls.
- Workspace membership is a separate collection (`membership`) linking users to workspaces with a
  `role` (`admin` / `member`), which drives permission checks across the API.

## Features

- Email/password auth with JWT access + refresh tokens
- Create/join multiple workspaces, each with its own chat, tasks, and members
- Real-time chat (Socket.IO), scanned automatically for commitments/decisions/blockers
- Kanban-style task board (To-Do / In-Progress / Completed) with priority and assignment
- Insights tab: filterable feed of detected signals + a workspace health gauge
- Ask AI tab: ask natural-language questions, answered using the workspace's own chat history (RAG)
- Member directory: invite by email, change roles, remove members, leave a workspace
- Public landing page for signed-out visitors, protected routes for everything else

## Running locally

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)
- A [Mistral AI](https://mistral.ai) API key
- A [Pinecone](https://www.pinecone.io) index named `synac-message`

### Backend
```bash
cd Backend
cp .env.example .env   # then fill in your own values
npm install
npm run dev             # starts on http://localhost:3000
```

### Frontend
```bash
cd Frontend
cp .env.example .env   # defaults already point at localhost:3000
npm install
npm run dev             # starts on http://localhost:5173
```

## Known limitations / next steps

- No automated test suite yet (unit/integration tests would be the next priority)
- No file/image attachments in chat
- No email delivery for invites — invited users must already have an account
- Workspace health score is a simple heuristic, not tuned against real usage data

## License

ISC
