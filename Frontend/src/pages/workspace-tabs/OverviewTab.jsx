import { useEffect, useState } from "react"
import { Link, useOutletContext } from "react-router-dom"
import { ListChecks, MessagesSquare, Sparkles, ArrowRight } from "lucide-react"
import { TopBar } from "../../components/layout/TopBar"
import { HealthGauge } from "../../components/workspace/HealthGauge"
import { DetectedActionItem } from "../../components/workspace/DetectedActionItem"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"
import { getHealthScoreRequest } from "../../api/health.api"
import { getDetectedActionsRequest } from "../../api/detectedAction.api"
import { getWorkspaceTasksRequest } from "../../api/task.api"

export default function OverviewTab() {
  const { workspace } = useOutletContext()
  const [loading, setLoading] = useState(true)
  const [health, setHealth] = useState(null)
  const [actions, setActions] = useState([])
  const [taskStats, setTaskStats] = useState({ total: 0, done: 0, inProgress: 0 })

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const [healthRes, actionsRes, tasksRes] = await Promise.allSettled([
        getHealthScoreRequest(workspace._id),
        getDetectedActionsRequest(workspace._id),
        getWorkspaceTasksRequest(workspace._id),
      ])
      if (cancelled) return
      if (healthRes.status === "fulfilled") setHealth(healthRes.value.healthScore)
      if (actionsRes.status === "fulfilled") setActions(actionsRes.value.action || [])
      if (tasksRes.status === "fulfilled") {
        const tasks = tasksRes.value.findTask || []
        setTaskStats({
          total: tasks.length,
          done: tasks.filter((t) => t.status === "completed").length,
          inProgress: tasks.filter((t) => t.status === "In-Progress").length,
        })
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [workspace._id])

  return (
    <>
      <TopBar title="Overview" subtitle={workspace.description || "Workspace summary"} />
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner label="Pulling the latest signal" />
          </div>
        ) : (
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="flex flex-col items-center justify-center rounded-lg border border-ink-700 bg-ink-800 p-6">
                <p className="mb-4 self-start font-mono text-xs uppercase tracking-widest text-ink-500">
                  workspace health
                </p>
                <HealthGauge score={health} />
              </div>

              <div className="lg:col-span-2 grid grid-cols-3 gap-4">
                <StatCard label="Open tasks" value={taskStats.total - taskStats.done} icon={ListChecks} />
                <StatCard label="In progress" value={taskStats.inProgress} icon={MessagesSquare} />
                <StatCard label="Completed" value={taskStats.done} icon={Sparkles} />
                <Link
                  to={`/workspaces/${workspace._id}/chat`}
                  className="col-span-3 flex items-center justify-between rounded-lg border border-ink-700 bg-ink-800 p-5 transition-colors hover:border-signal-teal/40"
                >
                  <div>
                    <p className="font-display text-base text-ink-50">Jump into the conversation</p>
                    <p className="mt-1 text-sm text-ink-400">
                      Chat is where SyncSpaceAI listens for commitments, decisions, and blockers.
                    </p>
                  </div>
                  <ArrowRight className="shrink-0 text-signal-teal" size={20} />
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-ink-700 bg-ink-800 p-6">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-display text-base text-ink-50">Recent signals</h2>
                <Link
                  to={`/workspaces/${workspace._id}/insights`}
                  className="text-xs text-signal-teal hover:underline"
                >
                  View all
                </Link>
              </div>
              {actions.length === 0 ? (
                <EmptyState
                  title="No signals detected yet"
                  description="As your team chats, commitments, decisions, and blockers will show up here automatically."
                />
              ) : (
                <div className="mt-2">
                  {actions.slice(0, 5).map((a) => (
                    <DetectedActionItem key={a._id} action={a} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-800 p-5">
      <Icon size={17} className="text-signal-teal" />
      <p className="mt-3 font-mono text-2xl text-ink-50">{value}</p>
      <p className="mt-0.5 text-xs text-ink-400">{label}</p>
    </div>
  )
}
