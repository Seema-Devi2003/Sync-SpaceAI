import { useCallback, useEffect, useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import { getMyWorkspacesRequest, getWorkspaceByIdRequest } from "../api/workspace.api"
import { Sidebar } from "../components/layout/Sidebar"
import { MobileTabBar } from "../components/layout/MobileTabBar"
import { Spinner } from "../components/ui/Spinner"
import { useToast } from "../context/ToastContext"
import { apiErrorMessage } from "../lib/axios"

export default function WorkspacePage() {
  const { workspaceId } = useParams()
  const toast = useToast()
  const [state, setState] = useState({ loading: true, workspace: null, role: null })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    try {
      const { workspace: memberships } = await getMyWorkspacesRequest()
      const mine = memberships?.find((m) => m.workspace?._id === workspaceId)
      if (mine) {
        setState({ loading: false, workspace: mine.workspace, role: mine.role })
        return
      }
      const { workspace } = await getWorkspaceByIdRequest(workspaceId)
      setState({ loading: false, workspace, role: "member" })
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't load this workspace."))
      setState({ loading: false, workspace: null, role: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId])

  useEffect(() => {
    load()
  }, [load])

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900">
        <Spinner label="Loading workspace" />
      </div>
    )
  }

  if (!state.workspace) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-ink-900 text-center">
        <p className="font-display text-lg text-ink-50">Workspace not found</p>
        <p className="text-sm text-ink-400">
          You may not have access, or it may have been removed.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-ink-900">
      <Sidebar workspaceName={state.workspace.name} />
      <div className="flex min-w-0 flex-1 flex-col pb-14 md:pb-0">
        <Outlet context={{ workspace: state.workspace, role: state.role, refreshWorkspace: load }} />
      </div>
      <MobileTabBar />
    </div>
  )
}
