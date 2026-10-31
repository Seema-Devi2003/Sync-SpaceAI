import { useState } from "react"
import { Modal } from "../ui/Modal"
import { Input, Textarea, Select } from "../ui/Input"
import { Button } from "../ui/Button"

export function CreateTaskModal({ open, onClose, onCreate, loading, currentUserId }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
  })
  const [error, setError] = useState("")

  function reset() {
    setForm({ title: "", description: "", priority: "medium", assignedTo: "" })
    setError("")
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError("Give the task a title")
      return
    }
    await onCreate({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      assignedTo: form.assignedTo.trim() || undefined,
    })
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="New task">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="Ship the onboarding flow"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          error={error}
          autoFocus
        />
        <Textarea
          label="Description"
          placeholder="Any useful context"
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <Select
          label="Priority"
          value={form.priority}
          onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        <div className="flex flex-col gap-1.5">
          <Input
            label="Assign to (user ID)"
            placeholder={currentUserId || "Paste a teammate's user ID"}
            value={form.assignedTo}
            onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-ink-500">
              Leave blank to assign no one, or paste an ID to assign a teammate.
            </p>
            {currentUserId && (
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, assignedTo: currentUserId }))}
                className="shrink-0 text-xs text-signal-teal hover:underline"
              >
                Assign to me
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  )
}
