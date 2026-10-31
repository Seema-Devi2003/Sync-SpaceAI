import { api } from "../lib/axios"

export async function getHealthScoreRequest(workspaceId) {
  const { data } = await api.get(`/workspace/${workspaceId}/health-score`)
  return data
}
