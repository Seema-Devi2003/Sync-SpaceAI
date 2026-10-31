import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-900 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-amber">404</p>
      <h1 className="font-display text-2xl text-ink-50">This page isn't in the workspace</h1>
      <p className="max-w-sm text-sm text-ink-400">
        The link might be broken, or the page may have moved.
      </p>
      <Link to="/">
        <Button>Back to safety</Button>
      </Link>
    </div>
  )
}
