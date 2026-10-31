import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthLayout } from "./AuthLayout"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { apiErrorMessage } from "../lib/axios"

export default function RegisterPage() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!form.username) nextErrors.username = "Username is required"
    if (!form.email) nextErrors.email = "Email is required"
    if (!form.password || form.password.length < 6)
      nextErrors.password = "Use at least 6 characters"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      await register(form)
      toast.success("Account created. Let's build a workspace.")
      navigate("/workspaces", { replace: true })
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't create your account."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      description="Free to set up. Invite your team once you're in."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-signal-teal hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input
          label="Username"
          name="username"
          autoComplete="username"
          placeholder="jordan-lee"
          value={form.username}
          onChange={update("username")}
          error={errors.username}
        />
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
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
        />
        <Button type="submit" className="mt-2 w-full" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}
