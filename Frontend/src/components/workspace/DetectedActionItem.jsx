import { Handshake, GitBranch, TriangleAlert } from "lucide-react"
import { Badge } from "../ui/Badge"

const meta = {
  commitment: { tone: "teal", icon: Handshake, label: "Commitment" },
  decision: { tone: "violet", icon: GitBranch, label: "Decision" },
  blocker: { tone: "amber", icon: TriangleAlert, label: "Blocker" },
}

export function DetectedActionItem({ action }) {
  const m = meta[action.action] || meta.commitment
  const Icon = m.icon

  return (
    <div className="flex gap-3 border-b border-ink-700 py-3.5 last:border-0">
      <div className="mt-0.5">
        <Badge tone={m.tone}>
          <Icon size={11} />
          {m.label}
        </Badge>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-ink-100">{action.summary}</p>
        <p className="mt-1 text-xs text-ink-500">
          {action.createdBy?.username ? `Flagged from ${action.createdBy.username}` : "Flagged"}
          {action.createdAt &&
            " · " +
              new Date(action.createdAt).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
        </p>
      </div>
    </div>
  )
}
