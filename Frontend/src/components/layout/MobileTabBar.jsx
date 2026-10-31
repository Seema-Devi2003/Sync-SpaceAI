import { NavLink, useParams } from "react-router-dom"
import { LayoutGrid, MessagesSquare, ListChecks, Radar, Sparkles, Users } from "lucide-react"

const tabs = [
  { to: "", end: true, label: "Home", icon: LayoutGrid },
  { to: "chat", label: "Chat", icon: MessagesSquare },
  { to: "tasks", label: "Tasks", icon: ListChecks },
  { to: "insights", label: "Signals", icon: Radar },
  { to: "ask-ai", label: "Ask", icon: Sparkles },
  { to: "members", label: "Team", icon: Users },
]

export function MobileTabBar() {
  const { workspaceId } = useParams()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink-700 bg-ink-900/95 backdrop-blur md:hidden">
      {tabs.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={label}
          to={`/workspaces/${workspaceId}/${to}`}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] ${
              isActive ? "text-signal-teal" : "text-ink-400"
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
