import { api } from "../lib/axios"

export async function askWorkspaceAiRequest(workspaceId, question) {
  const { data } = await api.post(`/workspace/${workspaceId}/ask`, { question })
  return data
}
