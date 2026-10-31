export function Input({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-200">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`h-10 rounded-md border border-ink-600 bg-ink-800 px-3 text-sm text-ink-50 placeholder:text-ink-400 outline-none transition-colors focus:border-signal-teal ${
          error ? "border-signal-coral" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-signal-coral">{error}</span>}
    </div>
  )
}

export function Textarea({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-200">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-400 outline-none transition-colors focus:border-signal-teal ${
          error ? "border-signal-coral" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-signal-coral">{error}</span>}
    </div>
  )
}

export function Select({ label, error, className = "", id, children, ...props }) {
  const inputId = id || props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-200">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`h-10 rounded-md border border-ink-600 bg-ink-800 px-3 text-sm text-ink-50 outline-none transition-colors focus:border-signal-teal ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-signal-coral">{error}</span>}
    </div>
  )
}
