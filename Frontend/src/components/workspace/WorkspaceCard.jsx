import { Link } from "react-router-dom"
import { ArrowUpRight, Crown } from "lucide-react"
import { Badge } from "../ui/Badge"

export function WorkspaceCard({ membership }) {
  const { workspace, role } = membership
  if (!workspace) return null

  return (
    <Link
      to={`/workspaces/${workspace._id}`}
      className="group flex flex-col justify-between rounded-lg border border-ink-700 bg-ink-800 p-5 transition-colors hover:border-signal-teal/40"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg text-ink-50">{workspace.name}</h3>
          <ArrowUpRight
            size={18}
            className="shrink-0 text-ink-500 transition-colors group-hover:text-signal-teal"
          />
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-400">
          {workspace.description || "No description yet."}
        </p>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <Badge tone={role === "admin" ? "teal" : "neutral"}>
          {role === "admin" && <Crown size={11} />}
          {role}
        </Badge>
      </div>
    </Link>
  )
}
