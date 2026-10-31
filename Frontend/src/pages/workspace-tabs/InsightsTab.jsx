import { useEffect, useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { Radar } from "lucide-react"
import { TopBar } from "../../components/layout/TopBar"
import { DetectedActionItem } from "../../components/workspace/DetectedActionItem"
import { HealthGauge } from "../../components/workspace/HealthGauge"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"
import { getDetectedActionsRequest } from "../../api/detectedAction.api"
import { getHealthScoreRequest } from "../../api/health.api"
import { useToast } from "../../context/ToastContext"
import { apiErrorMessage } from "../../lib/axios"

const filters = [
  { key: "all", label: "All" },
  { key: "commitment", label: "Commitments" },
  { key: "decision", label: "Decisions" },
  { key: "blocker", label: "Blockers" },
]

export default function InsightsTab() {
  const { workspace } = useOutletContext()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [actions, setActions] = useState([])
  const [health, setHealth] = useState(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const [actionsRes, healthRes] = await Promise.allSettled([
        getDetectedActionsRequest(workspace._id),
        getHealthScoreRequest(workspace._id),
      ])
      if (cancelled) return
      if (actionsRes.status === "fulfilled") setActions(actionsRes.value.action || [])
      else toast.error(apiErrorMessage(actionsRes.reason, "Couldn't load signals."))
      if (healthRes.status === "fulfilled") setHealth(healthRes.value.healthScore)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace._id])

  const filtered = useMemo(
    () => (filter === "all" ? actions : actions.filter((a) => a.action === filter)),
    [actions, filter]
  )

  const counts = useMemo(
    () => ({
      commitment: actions.filter((a) => a.action === "commitment").length,
      decision: actions.filter((a) => a.action === "decision").length,
      blocker: actions.filter((a) => a.action === "blocker").length,
    }),
    [actions]
  )

  return (
    <>
      <TopBar title="Signals" subtitle="What SyncSpaceAI has picked up from your team's chat" />
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Reading the signal" />
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-ink-700 bg-ink-800 p-5">
                <HealthGauge score={health} size={120} />
              </div>
              <div className="space-y-2 rounded-lg border border-ink-700 bg-ink-800 p-4">
                <CountRow label="Commitments" value={counts.commitment} color="var(--color-signal-teal)" />
                <CountRow label="Decisions" value={counts.decision} color="var(--color-signal-violet)" />
                <CountRow label="Blockers" value={counts.blocker} color="var(--color-signal-amber)" />
              </div>
            </div>

            <div className="rounded-lg border border-ink-700 bg-ink-800 p-6">
              <div className="mb-4 flex flex-wrap gap-1.5">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      filter === f.key
                        ? "border-signal-teal/40 bg-signal-teal/10 text-signal-teal"
                        : "border-ink-600 text-ink-300 hover:text-ink-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <EmptyState
                  icon={<Radar size={22} />}
                  title="Nothing here yet"
                  description="Signals appear automatically as commitments, decisions, and blockers come up in chat."
                />
              ) : (
                <div>
                  {filtered
                    .slice()
                    .reverse()
                    .map((a) => (
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

function CountRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-ink-300">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        {label}
      </span>
      <span className="font-mono text-ink-100">{value}</span>
    </div>
  )
}
