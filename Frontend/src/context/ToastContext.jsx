import { createContext, useCallback, useContext, useRef, useState } from "react"

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback(
    (message, variant = "default") => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, message, variant }])
      timers.current[id] = setTimeout(() => dismiss(id), 4200)
      return id
    },
    [dismiss]
  )

  const toast = {
    show: push,
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "default"),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            onClick={() => dismiss(t.id)}
            className={`animate-fade-in cursor-pointer rounded-md border px-4 py-3 text-sm shadow-lg backdrop-blur ${
              t.variant === "success"
                ? "border-signal-teal/40 bg-ink-800/95 text-ink-50"
                : t.variant === "error"
                ? "border-signal-coral/50 bg-ink-800/95 text-ink-50"
                : "border-ink-600 bg-ink-800/95 text-ink-100"
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                  t.variant === "success"
                    ? "bg-signal-teal"
                    : t.variant === "error"
                    ? "bg-signal-coral"
                    : "bg-ink-300"
                }`}
              />
              <p className="leading-snug">{t.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
