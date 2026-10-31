import { api } from "../lib/axios"

export async function createTaskRequest(workspaceId, task) {
  const { data } = await api.post(`/task/${workspaceId}/tasks`, task)
  return data
}

export async function getWorkspaceTasksRequest(workspaceId, filters = {}) {
  const { data } = await api.get(`/task/${workspaceId}/tasks`, { params: filters })
  return data
}

export async function updateTaskStatusRequest(workspaceId, taskId, status) {
  const { data } = await api.patch(`/task/${workspaceId}/tasks/${taskId}/status`, { status })
  return data
}

export async function deleteTaskRequest(workspaceId, taskId) {
  const { data } = await api.delete(`/task/${workspaceId}/tasks/${taskId}`)
  return data
}
