import { api } from "../lib/axios"

export async function createWorkspaceRequest({ name, description }) {
  const { data } = await api.post("/workspace", { name, description })
  return data
}

export async function getMyWorkspacesRequest() {
  const { data } = await api.get("/workspace")
  return data
}

export async function getWorkspaceByIdRequest(workspaceId) {
  const { data } = await api.get(`/workspace/${workspaceId}`)
  return data
}

export async function getWorkspaceMembersRequest(workspaceId) {
  const { data } = await api.get(`/workspace/${workspaceId}/members`)
  return data
}

export async function inviteMemberRequest(workspaceId, { email, role }) {
  const { data } = await api.post(`/workspace/${workspaceId}/members`, { email, role })
  return data
}

export async function removeMemberRequest(workspaceId, memberId) {
  const { data } = await api.delete(`/workspace/${workspaceId}/members/${memberId}`)
  return data
}

export async function changeRoleRequest(workspaceId, memberId, role) {
  const { data } = await api.patch(`/workspace/${workspaceId}/members/${memberId}/role`, { role })
  return data
}

export async function leaveWorkspaceRequest(workspaceId) {
  const { data } = await api.delete(`/workspace/${workspaceId}/leave`)
  return data
}
