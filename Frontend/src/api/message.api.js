import { api } from "../lib/axios"

export async function getWorkspaceMessagesRequest(workspaceId) {
  const { data } = await api.get(`/message/${workspaceId}/messages`)
  return data
}
