export function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <div className="flex min-h-screen bg-ink-900">
      <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden border-r border-ink-700 bg-ink-950 px-12 py-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(143,163,168,0.35) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="relative flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-dot absolute h-2.5 w-2.5 text-signal-teal" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-signal-teal" />
          </span>
          <span className="font-display text-sm font-medium tracking-tight text-ink-50">
            SyncSpace<span className="text-signal-teal">AI</span>
          </span>
        </div>

        <div className="relative space-y-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-500">
            workspace intelligence
          </p>
          <h2 className="max-w-md font-display text-[2.6rem] leading-[1.08] text-ink-50">
            Every commitment, decision, and blocker — caught as your team talks.
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-300">
            SyncSpaceAI listens to your workspace chat, tags what matters, and keeps a live
            read on project health — so nothing said in passing gets lost.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-3 font-mono text-xs text-ink-500">
          <div className="rounded-md border border-ink-700 px-3 py-2.5">
            <p className="text-signal-teal">commitment</p>
            <p className="mt-1 text-ink-400">tracked automatically</p>
          </div>
          <div className="rounded-md border border-ink-700 px-3 py-2.5">
            <p className="text-signal-amber">blocker</p>
            <p className="mt-1 text-ink-400">surfaced in real time</p>
          </div>
          <div className="rounded-md border border-ink-700 px-3 py-2.5">
            <p className="text-signal-violet">decision</p>
            <p className="mt-1 text-ink-400">logged for the team</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="h-2.5 w-2.5 rounded-full bg-signal-teal" />
            <span className="font-display text-sm font-medium text-ink-50">
              SyncSpace<span className="text-signal-teal">AI</span>
            </span>
          </div>
          {eyebrow && (
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-signal-teal">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-2xl text-ink-50">{title}</h1>
          {description && <p className="mt-2 text-sm text-ink-400">{description}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-sm text-ink-400">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
