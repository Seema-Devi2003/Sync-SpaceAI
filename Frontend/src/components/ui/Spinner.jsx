export function Spinner({ label, size = "md" }) {
  const dims = size === "sm" ? "h-3.5 w-3.5 border-2" : "h-5 w-5 border-2"
  return (
    <div className="flex items-center gap-2.5 text-ink-300">
      <span
        className={`${dims} animate-spin rounded-full border-ink-600 border-t-signal-teal`}
        aria-hidden="true"
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}
