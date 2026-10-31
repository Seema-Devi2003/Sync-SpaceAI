const variants = {
  primary:
    "bg-signal-teal text-ink-950 hover:bg-signal-teal/90 disabled:bg-signal-teal/40",
  secondary:
    "bg-ink-700 text-ink-50 border border-ink-600 hover:bg-ink-600 disabled:opacity-50",
  ghost:
    "bg-transparent text-ink-200 hover:bg-ink-700 hover:text-ink-50 disabled:opacity-40",
  danger:
    "bg-transparent border border-signal-coral/40 text-signal-coral hover:bg-signal-coral/10 disabled:opacity-40",
}

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-[15px]",
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
      )}
      {children}
    </button>
  )
}
