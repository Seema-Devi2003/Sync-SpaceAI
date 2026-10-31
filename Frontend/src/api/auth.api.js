import { api } from "../lib/axios"

export async function registerRequest({ username, email, password }) {
  const { data } = await api.post("/auth/register", { username, email, password })
  return data
}

export async function loginRequest({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password })
  return data
}

export async function getMeRequest() {
  const { data } = await api.get("/auth/get-me")
  return data
}

export async function refreshRequest() {
  const { data } = await api.post("/auth/refresh")
  return data
}

export async function logoutRequest() {
  const { data } = await api.post("/auth/logout")
  return data
}
