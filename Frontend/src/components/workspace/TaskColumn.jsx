export function TaskColumn({ title, accent, count, children }) {
  return (
    <div className="flex min-w-[280px] flex-1 flex-col rounded-lg border border-ink-700 bg-ink-900/40">
      <div className="flex items-center justify-between border-b border-ink-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
          <h3 className="font-display text-sm text-ink-100">{title}</h3>
        </div>
        <span className="font-mono text-xs text-ink-500">{count}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3">{children}</div>
    </div>
  )
}
