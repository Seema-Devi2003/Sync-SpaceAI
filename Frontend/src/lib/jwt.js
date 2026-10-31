// Lightweight, non-verifying JWT payload decoder.
// The server is the source of truth for auth; we only decode the token we
// already hold to read non-secret claims (id, email) for UI convenience.
export function decodeJwt(token) {
  if (!token) return null
  try {
    const payload = token.split(".")[1]
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}
