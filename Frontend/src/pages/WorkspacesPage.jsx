import { useEffect, useState } from "react"
import { Plus, LogOut, Radio } from "lucide-react"
import { getMyWorkspacesRequest, createWorkspaceRequest } from "../api/workspace.api"
import { WorkspaceCard } from "../components/workspace/WorkspaceCard"
import { CreateWorkspaceModal } from "../components/workspace/CreateWorkspaceModal"
import { Button } from "../components/ui/Button"
import { Spinner } from "../components/ui/Spinner"
import { EmptyState } from "../components/ui/EmptyState"
import { Avatar } from "../components/ui/Avatar"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { apiErrorMessage } from "../lib/axios"

export default function WorkspacesPage() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { workspace } = await getMyWorkspacesRequest()
      setMemberships(workspace || [])
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't load your workspaces."))
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate({ name, description }) {
    setCreating(true)
    try {
      await createWorkspaceRequest({ name, description })
      toast.success(`${name} is ready.`)
      await load()
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't create the workspace."))
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-900">
      <header className="flex items-center justify-between border-b border-ink-700 px-6 py-4 md:px-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-dot absolute h-2.5 w-2.5 text-signal-teal" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-signal-teal" />
          </span>
          <span className="font-display text-[15px] font-medium tracking-tight text-ink-50">
            SyncSpace<span className="text-signal-teal">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar name={user?.username || "?"} size="sm" />
            <span className="text-sm text-ink-200">{user?.username}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut size={15} />
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-signal-teal">
              <Radio size={12} /> your workspaces
            </p>
            <h1 className="mt-1.5 font-display text-2xl text-ink-50">
              Where's the team at, {user?.username}?
            </h1>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            New workspace
          </Button>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner label="Loading workspaces" />
            </div>
          ) : memberships.length === 0 ? (
            <EmptyState
              title="No workspaces yet"
              description="Create your first workspace to start tracking chat, tasks, and the decisions your team makes along the way."
              action={
                <Button onClick={() => setModalOpen(true)}>
                  <Plus size={16} />
                  Create a workspace
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {memberships.map((m) => (
                <WorkspaceCard key={m._id} membership={m} />
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateWorkspaceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
        loading={creating}
      />
    </div>
  )
}
