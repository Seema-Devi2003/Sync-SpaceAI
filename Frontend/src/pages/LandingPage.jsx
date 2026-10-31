import { Link } from "react-router-dom"
import { Handshake, GitBranch, TriangleAlert, MessagesSquare, ListChecks, Sparkles } from "lucide-react"
import { Button } from "../components/ui/Button"

const signals = [
  { icon: Handshake, label: "commitment", tone: "text-signal-teal", copy: "tracked automatically" },
  { icon: TriangleAlert, label: "blocker", tone: "text-signal-amber", copy: "surfaced in real time" },
  { icon: GitBranch, label: "decision", tone: "text-signal-violet", copy: "logged for the team" },
]

const features = [
  {
    icon: MessagesSquare,
    title: "Real-time team chat",
    description: "One live conversation per workspace, powered by WebSockets — no refreshing, no missed messages.",
  },
  {
    icon: Sparkles,
    title: "AI that actually reads the room",
    description: "Every message is classified as a commitment, decision, or blocker, then logged automatically as a signal.",
  },
  {
    icon: ListChecks,
    title: "Ask AI about your workspace",
    description: "Chat history is embedded into a vector store, so you can ask \"what did we decide about launch?\" and get a grounded answer.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <header className="flex items-center justify-between border-b border-ink-700 px-6 py-4 md:px-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-dot absolute h-2.5 w-2.5 text-signal-teal" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-signal-teal" />
          </span>
          <span className="font-display text-[15px] font-medium tracking-tight text-ink-50">
            SyncSpace<span className="text-signal-teal">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-20 text-center md:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-signal-teal">
          workspace intelligence
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-[1.1] text-ink-50 md:text-5xl">
          Every commitment, decision, and blocker — caught as your team talks.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink-300">
          SyncSpaceAI listens to your workspace chat, tags what matters, and keeps a live read
          on project health — so nothing said in passing gets lost.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/register">
            <Button size="lg">Create a workspace</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">Sign in</Button>
          </Link>
        </div>

        <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-3 font-mono text-xs text-ink-500">
          {signals.map(({ icon: Icon, label, tone, copy }) => (
            <div key={label} className="rounded-md border border-ink-700 px-3 py-3">
              <Icon size={16} className={`mx-auto ${tone}`} />
              <p className={`mt-2 ${tone}`}>{label}</p>
              <p className="mt-1 text-ink-400">{copy}</p>
            </div>
          ))}
        </div>
      </main>

      <section className="border-t border-ink-700 px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-lg border border-ink-700 bg-ink-800 p-6">
              <Icon size={20} className="text-signal-teal" />
              <h2 className="mt-4 font-display text-base text-ink-50">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-700 px-6 py-8 text-center text-xs text-ink-500 md:px-10">
        SyncSpaceAI — built with the MERN stack, Socket.IO, and Mistral + Pinecone for RAG.
      </footer>
    </div>
  )
}
