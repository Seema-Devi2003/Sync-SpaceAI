export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-ink-600 px-6 py-14 text-center">
      {icon && <div className="text-ink-400">{icon}</div>}
      <div className="space-y-1">
        <p className="font-display text-base text-ink-100">{title}</p>
        {description && <p className="max-w-sm text-sm text-ink-300">{description}</p>}
      </div>
      {action}
    </div>
  )
}
