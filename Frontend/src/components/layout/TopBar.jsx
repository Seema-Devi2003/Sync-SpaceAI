import { LogOut } from "lucide-react"
import { Avatar } from "../ui/Avatar"
import { useAuth } from "../../context/AuthContext"

export function TopBar({ title, subtitle, right }) {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-ink-700 bg-ink-900 px-5 md:px-8">
      <div className="min-w-0">
        <h1 className="truncate font-display text-lg text-ink-50">{title}</h1>
        {subtitle && <p className="truncate text-xs text-ink-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {right}
        <div className="hidden items-center gap-2 border-l border-ink-700 pl-3 sm:flex">
          <Avatar name={user?.username || user?.email || "?"} size="sm" />
          <span className="max-w-[120px] truncate text-sm text-ink-200">{user?.username}</span>
        </div>
        <button
          onClick={logout}
          aria-label="Log out"
          className="rounded-md p-2 text-ink-400 transition-colors hover:bg-ink-700 hover:text-signal-coral"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}
