import { Trash2 } from "lucide-react"
import { Badge } from "../ui/Badge"

const priorityTone = { low: "neutral", medium: "amber", high: "coral" }

export function TaskCard({ task, currentUserId, onStatusChange, onDelete }) {
  const isMine = task.assignedTo === currentUserId

  return (
    <div className="group rounded-lg border border-ink-700 bg-ink-800 p-4 transition-colors hover:border-ink-600">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug text-ink-50">{task.title}</p>
        <button
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
          className="shrink-0 rounded p-1 text-ink-500 opacity-0 transition-opacity hover:bg-ink-700 hover:text-signal-coral group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-400">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge tone={priorityTone[task.priority] || "neutral"}>{task.priority}</Badge>
        {isMine && <Badge tone="teal">assigned to you</Badge>}
      </div>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className="mt-3 w-full rounded-md border border-ink-600 bg-ink-900 px-2 py-1.5 text-xs text-ink-200 outline-none focus:border-signal-teal"
      >
        <option value="To-Do">To-Do</option>
        <option value="In-Progress">In-Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  )
}
