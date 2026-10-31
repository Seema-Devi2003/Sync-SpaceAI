import { createContext, useCallback, useContext, useEffect, useState } from "react"
import {
  getMeRequest,
  loginRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
} from "../api/auth.api"
import { registerUnauthorizedHandler } from "../lib/axios"
import { decodeJwt } from "../lib/jwt"

const AuthContext = createContext(null)

function buildUser({ user, accessToken }) {
  const claims = decodeJwt(accessToken)
  return {
    id: claims?.id ?? null,
    username: user?.username ?? null,
    email: user?.email ?? claims?.email ?? null,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const { accessToken } = await refreshRequest()
        const { user: me } = await getMeRequest()
        if (!cancelled) setUser(buildUser({ user: me, accessToken }))
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    bootstrap()
    registerUnauthorizedHandler(() => setUser(null))
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials)
    setUser(buildUser(data))
    return data
  }, [])

  const register = useCallback(async (details) => {
    const data = await registerRequest(details)
    setUser(buildUser(data))
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
