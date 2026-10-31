import axios from "axios"
import { API_BASE_URL } from "./config"

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

let onUnauthorized = null
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const status = response?.status

    const isAuthRoute =
      config?.url?.includes("/auth/login") ||
      config?.url?.includes("/auth/register") ||
      config?.url?.includes("/auth/refresh")

    if (status === 401 && !config._retry && !isAuthRoute) {
      config._retry = true
      try {
        if (!refreshPromise) {
          refreshPromise = api.post("/auth/refresh").finally(() => {
            refreshPromise = null
          })
        }
        await refreshPromise
        return api(config)
      } catch (refreshError) {
        if (onUnauthorized) onUnauthorized()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export function apiErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  return err?.response?.data?.message || err?.message || fallback
}
