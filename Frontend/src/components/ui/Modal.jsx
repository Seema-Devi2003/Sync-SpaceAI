import { useEffect } from "react"
import { createPortal } from "react-dom"

export function Modal({ open, onClose, title, children, className = "" }) {
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full max-w-md animate-fade-in rounded-lg border border-ink-600 bg-ink-800 p-6 shadow-2xl ${className}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-lg text-ink-50">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-ink-400 transition-colors hover:bg-ink-700 hover:text-ink-100"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
