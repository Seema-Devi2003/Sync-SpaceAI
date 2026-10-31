import { NavLink, useParams } from "react-router-dom"
import {
  LayoutGrid,
  MessagesSquare,
  ListChecks,
  Radar,
  Sparkles,
  Users,
  ArrowLeft,
} from "lucide-react"

const tabs = [
  { to: "", end: true, label: "Overview", icon: LayoutGrid },
  { to: "chat", label: "Chat", icon: MessagesSquare },
  { to: "tasks", label: "Tasks", icon: ListChecks },
  { to: "insights", label: "Signals", icon: Radar },
  { to: "ask-ai", label: "Ask AI", icon: Sparkles },
  { to: "members", label: "Members", icon: Users },
]

export function Sidebar({ workspaceName }) {
  const { workspaceId } = useParams()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-700 bg-ink-900 md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-ink-700 px-5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="pulse-dot absolute h-2.5 w-2.5 text-signal-teal" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-signal-teal" />
        </span>
        <span className="font-display text-[15px] font-medium tracking-tight text-ink-50">
          SyncSpace<span className="text-signal-teal">AI</span>
        </span>
      </div>

      <NavLink
        to="/workspaces"
        className="mx-3 mt-4 flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium text-ink-400 transition-colors hover:bg-ink-700 hover:text-ink-100"
      >
        <ArrowLeft size={14} />
        All workspaces
      </NavLink>

      {workspaceName && (
        <div className="mx-3 mt-3 truncate rounded-md bg-ink-800 px-2.5 py-2 font-display text-sm text-ink-100">
          {workspaceName}
        </div>
      )}

      <nav className="mt-4 flex flex-1 flex-col gap-0.5 px-3">
        {tabs.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={`/workspaces/${workspaceId}/${to}`}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-signal-teal/10 text-signal-teal"
                  : "text-ink-300 hover:bg-ink-700 hover:text-ink-50"
              }`
            }
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-700 px-5 py-4 font-mono text-[11px] text-ink-500">
        live signal monitoring
      </div>
    </aside>
  )
}
