const tones = {
  neutral: "bg-ink-700 text-ink-200 border-ink-600",
  teal: "bg-signal-teal/10 text-signal-teal border-signal-teal/30",
  amber: "bg-signal-amber/10 text-signal-amber border-signal-amber/30",
  coral: "bg-signal-coral/10 text-signal-coral border-signal-coral/30",
  violet: "bg-signal-violet/10 text-signal-violet border-signal-violet/30",
}

export function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
