import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AuthLayout } from "./AuthLayout"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { apiErrorMessage } from "../lib/axios"

export default function LoginPage() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!form.email) nextErrors.email = "Email is required"
    if (!form.password) nextErrors.password = "Password is required"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      await login(form)
      toast.success("Welcome back.")
      navigate(location.state?.from || "/workspaces", { replace: true })
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't log you in. Check your details."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back"
      description="Pick up where your team left off."
      footer={
        <>
          New to SyncSpaceAI?{" "}
          <Link to="/register" className="font-medium text-signal-teal hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
        />
        <Button type="submit" className="mt-2 w-full" loading={loading}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  )
}
