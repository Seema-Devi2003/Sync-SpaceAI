const palette = [
  "bg-signal-teal/20 text-signal-teal",
  "bg-signal-amber/20 text-signal-amber",
  "bg-signal-violet/20 text-signal-violet",
  "bg-signal-coral/20 text-signal-coral",
]

function hashString(str = "") {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 997
  return hash
}

export function Avatar({ name = "?", size = "md" }) {
  const initials = name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?"
  const tone = palette[hashString(name) % palette.length]
  const dims = size === "sm" ? "h-7 w-7 text-xs" : size === "lg" ? "h-11 w-11 text-sm" : "h-9 w-9 text-xs"
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-medium ${tone} ${dims}`}
    >
      {initials}
    </span>
  )
}
