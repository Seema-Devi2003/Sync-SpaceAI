import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { UserPlus, LogOut, ShieldCheck, UserMinus } from "lucide-react"
import { TopBar } from "../../components/layout/TopBar"
import { Input, Select } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Avatar } from "../../components/ui/Avatar"
import { Spinner } from "../../components/ui/Spinner"
import {
  changeRoleRequest,
  getWorkspaceMembersRequest,
  inviteMemberRequest,
  leaveWorkspaceRequest,
  removeMemberRequest,
} from "../../api/workspace.api"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import { apiErrorMessage } from "../../lib/axios"

export default function MembersTab() {
  const { workspace, role } = useOutletContext()
  const { user } = useAuth()
  const toast = useToast()
  const isAdmin = role === "admin"

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const [inviteForm, setInviteForm] = useState({ email: "", role: "member" })
  const [inviting, setInviting] = useState(false)

  const [leaving, setLeaving] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace._id])

  async function load() {
    setLoading(true)
    try {
      const { members } = await getWorkspaceMembersRequest(workspace._id)
      setMembers(members || [])
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't load members."))
    } finally {
      setLoading(false)
    }
  }

  async function onInvite(e) {
    e.preventDefault()
    if (!inviteForm.email.trim()) return
    setInviting(true)
    try {
      await inviteMemberRequest(workspace._id, {
        email: inviteForm.email.trim(),
        role: inviteForm.role,
      })
      toast.success(`Invited ${inviteForm.email.trim()} as ${inviteForm.role}.`)
      setInviteForm({ email: "", role: "member" })
      await load()
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't invite that person."))
    } finally {
      setInviting(false)
    }
  }

  async function onChangeRole(memberUserId, nextRole) {
    setBusyId(memberUserId)
    const previous = members
    setMembers((list) =>
      list.map((m) => (m.user?._id === memberUserId ? { ...m, role: nextRole } : m))
    )
    try {
      await changeRoleRequest(workspace._id, memberUserId, nextRole)
      toast.success("Member role updated.")
    } catch (err) {
      setMembers(previous)
      toast.error(apiErrorMessage(err, "Couldn't update that member's role."))
    } finally {
      setBusyId(null)
    }
  }

  async function onRemove(memberUserId) {
    setBusyId(memberUserId)
    const previous = members
    setMembers((list) => list.filter((m) => m.user?._id !== memberUserId))
    try {
      await removeMemberRequest(workspace._id, memberUserId)
      toast.success("Member removed.")
    } catch (err) {
      setMembers(previous)
      toast.error(apiErrorMessage(err, "Couldn't remove that member."))
    } finally {
      setBusyId(null)
    }
  }

  async function onLeave() {
    setLeaving(true)
    try {
      await leaveWorkspaceRequest(workspace._id)
      toast.success("You left the workspace.")
      window.location.href = "/workspaces"
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't leave the workspace."))
      setLeaving(false)
    }
  }

  return (
    <>
      <TopBar title="Members" subtitle="Invite teammates and manage access" />
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
        <div className="mx-auto max-w-2xl space-y-6">
          {isAdmin && (
            <div className="rounded-lg border border-ink-700 bg-ink-800 p-5">
              <h2 className="flex items-center gap-2 font-display text-base text-ink-50">
                <UserPlus size={16} className="text-signal-teal" />
                Invite a teammate
              </h2>
              <p className="mt-1 text-sm text-ink-400">
                They need an existing SyncSpaceAI account under this email.
              </p>
              <form onSubmit={onInvite} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Input
                  className="flex-1"
                  placeholder="teammate@company.com"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                />
                <Select
                  className="sm:w-36"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value }))}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </Select>
                <Button type="submit" loading={inviting} className="sm:w-auto">
                  Invite
                </Button>
              </form>
            </div>
          )}

          <div className="rounded-lg border border-ink-700 bg-ink-800 p-5">
            <h2 className="font-display text-base text-ink-50">
              {loading ? "Members" : `Members (${members.length})`}
            </h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner label="Loading members" />
              </div>
            ) : (
              <ul className="mt-3 divide-y divide-ink-700">
                {members.map((m) => {
                  const isSelf = m.user?._id === user?.id
                  const name = m.user?.username || m.user?.email || "Unknown"
                  return (
                    <li key={m._id} className="flex items-center justify-between gap-3 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={name} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm text-ink-50">
                            {name} {isSelf && <span className="text-ink-500">(you)</span>}
                          </p>
                          <p className="truncate text-xs text-ink-400">{m.user?.email}</p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Badge tone={m.role === "admin" ? "teal" : "neutral"}>
                          {m.role === "admin" && <ShieldCheck size={11} />}
                          {m.role}
                        </Badge>

                        {isAdmin && !isSelf && (
                          <>
                            <Select
                              value={m.role}
                              disabled={busyId === m.user?._id}
                              onChange={(e) => onChangeRole(m.user._id, e.target.value)}
                              className="h-8 w-28 text-xs"
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                            </Select>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={busyId === m.user?._id}
                              onClick={() => onRemove(m.user._id)}
                              aria-label={`Remove ${name}`}
                            >
                              <UserMinus size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-ink-700 bg-ink-800 p-5">
            <h2 className="font-display text-base text-ink-50">Leave this workspace</h2>
            <p className="mt-1 text-sm text-ink-400">
              You'll lose access to its chat, tasks, and signals.
            </p>
            {confirmLeave ? (
              <div className="mt-4 flex items-center gap-2">
                <Button variant="danger" loading={leaving} onClick={onLeave}>
                  <LogOut size={14} />
                  Confirm leave
                </Button>
                <Button variant="ghost" onClick={() => setConfirmLeave(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => setConfirmLeave(true)}>
                Leave workspace
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
