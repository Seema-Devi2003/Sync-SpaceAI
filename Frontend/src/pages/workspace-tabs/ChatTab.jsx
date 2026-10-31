import { useEffect, useRef, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { SendHorizontal, Sparkles } from "lucide-react"
import { TopBar } from "../../components/layout/TopBar"
import { ChatMessage } from "../../components/workspace/ChatMessage"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"
import { getWorkspaceMessagesRequest } from "../../api/message.api"
import { getSocket } from "../../lib/socket"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import { apiErrorMessage } from "../../lib/axios"

export default function ChatTab() {
  const { workspace } = useOutletContext()
  const { user } = useAuth()
  const toast = useToast()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState("")
  const [connected, setConnected] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function loadHistory() {
      setLoading(true)
      try {
        const { messages } = await getWorkspaceMessagesRequest(workspace._id)
        if (!cancelled) setMessages(messages || [])
      } catch (err) {
        toast.error(apiErrorMessage(err, "Couldn't load chat history."))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadHistory()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace._id])

  useEffect(() => {
    const socket = getSocket()
    socket.connect()

    function handleConnect() {
      setConnected(true)
      socket.emit("joinWorkspace", workspace._id)
    }
    function handleDisconnect() {
      setConnected(false)
    }
    function handleNewMessage(message) {
      setMessages((prev) => [...prev, message])
    }
    function handleError(msg) {
      toast.error(typeof msg === "string" ? msg : "Message failed to send.")
    }

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("newMessage", handleNewMessage)
    socket.on("errorMessage", handleError)

    if (socket.connected) handleConnect()

    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("newMessage", handleNewMessage)
      socket.off("errorMessage", handleError)
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace._id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  function sendMessage(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !user?.id) return
    getSocket().emit("sendMessage", {
      workspaceId: workspace._id,
      senderId: user.id,
      message: text,
    })
    setDraft("")
  }

  return (
    <>
      <TopBar
        title="Chat"
        subtitle="Team conversation · scanned for commitments, decisions & blockers"
        right={
          <span className="hidden items-center gap-1.5 text-xs text-ink-400 sm:flex">
            <span
              className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-signal-teal" : "bg-ink-500"}`}
            />
            {connected ? "Live" : "Connecting…"}
          </span>
        }
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 md:px-10">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner label="Loading conversation" />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState
              icon={<Sparkles size={22} />}
              title="No messages yet"
              description="Say hello to get the conversation — and SyncSpaceAI's listening — started."
            />
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {messages.map((m) => (
                <ChatMessage key={m._id} message={m} isOwn={m.sender?._id === user?.id} />
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={sendMessage}
          className="border-t border-ink-700 bg-ink-900 px-6 py-4 md:px-10"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message the workspace…"
              className="h-11 flex-1 rounded-md border border-ink-600 bg-ink-800 px-3.5 text-sm text-ink-50 placeholder:text-ink-400 outline-none focus:border-signal-teal"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-signal-teal text-ink-950 transition-colors hover:bg-signal-teal/90 disabled:cursor-not-allowed disabled:bg-signal-teal/30"
            >
              <SendHorizontal size={17} />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
