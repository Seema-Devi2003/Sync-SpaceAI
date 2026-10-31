import { useState } from "react"
import { Modal } from "../ui/Modal"
import { Input, Textarea } from "../ui/Input"
import { Button } from "../ui/Button"

export function CreateWorkspaceModal({ open, onClose, onCreate, loading }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  function handleClose() {
    setName("")
    setDescription("")
    setError("")
    onClose()
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError("Give your workspace a name")
      return
    }
    await onCreate({ name: name.trim(), description: description.trim() })
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="New workspace">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Workspace name"
          placeholder="Platform Team"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          autoFocus
        />
        <Textarea
          label="Description"
          placeholder="What is this workspace for?"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create workspace
          </Button>
        </div>
      </form>
    </Modal>
  )
}
