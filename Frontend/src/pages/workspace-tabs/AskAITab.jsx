import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { Sparkles, SendHorizontal } from "lucide-react"
import { TopBar } from "../../components/layout/TopBar"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"
import { askWorkspaceAiRequest } from "../../api/ai.api"
import { useToast } from "../../context/ToastContext"
import { apiErrorMessage } from "../../lib/axios"

export default function AskAITab() {
  const { workspace } = useOutletContext()
  const toast = useToast()
  const [question, setQuestion] = useState("")
  const [thread, setThread] = useState([])
  const [asking, setAsking] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    const q = question.trim()
    if (!q || asking) return
    setQuestion("")
    setAsking(true)
    setThread((t) => [...t, { question: q, answer: null }])
    try {
      const { answer } = await askWorkspaceAiRequest(workspace._id, q)
      setThread((t) => t.map((item, i) => (i === t.length - 1 ? { ...item, answer } : item)))
    } catch (err) {
      const message = apiErrorMessage(err, "The assistant couldn't answer that.")
      toast.error(message)
      setThread((t) => t.map((item, i) => (i === t.length - 1 ? { ...item, error: message } : item)))
    } finally {
      setAsking(false)
    }
  }

  return (
    <>
      <TopBar
        title="Ask AI"
        subtitle="Grounded in everything said in this workspace's chat"
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10">
          {thread.length === 0 ? (
            <EmptyState
              icon={<Sparkles size={22} />}
              title="Ask about your workspace"
              description={`“What did we decide about the launch date?” or “Who's blocked right now?” — the assistant answers using ${workspace.name}'s chat history.`}
            />
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col gap-6">
              {thread.map((item, i) => (
                <div key={i} className="space-y-2.5">
                  <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-signal-teal/15 px-4 py-2.5 text-sm text-ink-50">
                    {item.question}
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-700 text-signal-teal">
                      <Sparkles size={12} />
                    </span>
                    {item.answer ? (
                      <p className="rounded-lg rounded-tl-sm border border-ink-700 bg-ink-800 px-4 py-2.5 text-sm leading-relaxed text-ink-100">
                        {item.answer}
                      </p>
                    ) : item.error ? (
                      <p className="rounded-lg rounded-tl-sm border border-signal-coral/30 bg-ink-800 px-4 py-2.5 text-sm text-signal-coral">
                        {item.error}
                      </p>
                    ) : (
                      <div className="rounded-lg rounded-tl-sm border border-ink-700 bg-ink-800 px-4 py-2.5">
                        <Spinner size="sm" label="Thinking…" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="border-t border-ink-700 bg-ink-900 px-6 py-4 md:px-10">
          <div className="mx-auto flex max-w-2xl items-center gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something about this workspace…"
              className="h-11 flex-1 rounded-md border border-ink-600 bg-ink-800 px-3.5 text-sm text-ink-50 placeholder:text-ink-400 outline-none focus:border-signal-teal"
            />
            <button
              type="submit"
              disabled={!question.trim() || asking}
              aria-label="Ask"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-signal-teal text-ink-950 transition-colors hover:bg-signal-teal/90 disabled:cursor-not-allowed disabled:bg-signal-teal/30"
            >
              <SendHorizontal size={17} />
            </button>
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-ink-500">
            Answers can take a few seconds — the assistant searches your chat before replying.
          </p>
        </form>
      </div>
    </>
  )
}
