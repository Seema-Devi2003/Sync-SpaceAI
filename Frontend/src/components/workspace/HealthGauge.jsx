const RADIUS = 54
const CIRC = 2 * Math.PI * RADIUS

function toneFor(score) {
  if (score >= 70) return { color: "var(--color-signal-teal)", label: "Healthy" }
  if (score >= 40) return { color: "var(--color-signal-amber)", label: "Needs attention" }
  return { color: "var(--color-signal-coral)", label: "At risk" }
}

export function HealthGauge({ score, size = 156 }) {
  const clamped = Math.max(0, Math.min(100, score ?? 0))
  const { color, label } = toneFor(clamped)
  const offset = CIRC - (clamped / 100) * CIRC

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--color-ink-700)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl text-ink-50">{Math.round(score ?? 0)}</span>
          <span className="text-[11px] text-ink-400">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  )
}
