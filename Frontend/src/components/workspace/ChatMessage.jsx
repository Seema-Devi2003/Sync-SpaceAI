import { Avatar } from "../ui/Avatar"

export function ChatMessage({ message, isOwn }) {
  const name = message.sender?.username || "Unknown"
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : ""

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      <Avatar name={name} size="sm" />
      <div className={`flex max-w-[75%] flex-col ${isOwn ? "items-end" : "items-start"}`}>
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-ink-300">{isOwn ? "You" : name}</span>
          {time && <span className="text-[11px] text-ink-500">{time}</span>}
        </div>
        <div
          className={`mt-1 rounded-lg px-3.5 py-2 text-sm leading-relaxed ${
            isOwn
              ? "rounded-tr-sm bg-signal-teal/15 text-ink-50"
              : "rounded-tl-sm border border-ink-700 bg-ink-800 text-ink-100"
          }`}
        >
          {message.message}
        </div>
      </div>
    </div>
  )
}
