import { api } from "../lib/axios"

export async function getDetectedActionsRequest(workspaceId) {
  const { data } = await api.get(`/workspace/${workspaceId}/detected-actions`)
  return data
}
