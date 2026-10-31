import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { Plus, ListChecks } from "lucide-react"
import { TopBar } from "../../components/layout/TopBar"
import { TaskColumn } from "../../components/workspace/TaskColumn"
import { TaskCard } from "../../components/workspace/TaskCard"
import { CreateTaskModal } from "../../components/workspace/CreateTaskModal"
import { Button } from "../../components/ui/Button"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"
import {
  createTaskRequest,
  deleteTaskRequest,
  getWorkspaceTasksRequest,
  updateTaskStatusRequest,
} from "../../api/task.api"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import { apiErrorMessage } from "../../lib/axios"

const columns = [
  { key: "To-Do", title: "To-do", accent: "var(--color-ink-300)" },
  { key: "In-Progress", title: "In progress", accent: "var(--color-signal-amber)" },
  { key: "completed", title: "Completed", accent: "var(--color-signal-teal)" },
]

export default function TasksTab() {
  const { workspace } = useOutletContext()
  const { user } = useAuth()
  const toast = useToast()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace._id])

  async function load() {
    setLoading(true)
    try {
      const { findTask } = await getWorkspaceTasksRequest(workspace._id)
      setTasks(findTask || [])
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't load tasks."))
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(task) {
    setCreating(true)
    try {
      await createTaskRequest(workspace._id, task)
      toast.success("Task created.")
      await load()
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't create the task."))
    } finally {
      setCreating(false)
    }
  }

  async function handleStatusChange(taskId, status) {
    const previous = tasks
    setTasks((t) => t.map((task) => (task._id === taskId ? { ...task, status } : task)))
    try {
      await updateTaskStatusRequest(workspace._id, taskId, status)
    } catch (err) {
      setTasks(previous)
      toast.error(apiErrorMessage(err, "Couldn't update the task."))
    }
  }

  async function handleDelete(taskId) {
    const previous = tasks
    setTasks((t) => t.filter((task) => task._id !== taskId))
    try {
      await deleteTaskRequest(workspace._id, taskId)
    } catch (err) {
      setTasks(previous)
      toast.error(apiErrorMessage(err, "Couldn't delete the task."))
    }
  }

  return (
    <>
      <TopBar
        title="Tasks"
        subtitle={`${tasks.length} task${tasks.length === 1 ? "" : "s"} in this workspace`}
        right={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={15} />
            New task
          </Button>
        }
      />
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-6 md:px-10">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Loading tasks" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<ListChecks size={22} />}
            title="No tasks yet"
            description="Break the work down so the team knows what's next."
            action={
              <Button onClick={() => setModalOpen(true)}>
                <Plus size={16} />
                Create the first task
              </Button>
            }
          />
        ) : (
          <div className="flex h-full gap-4">
            {columns.map((col) => (
              <TaskColumn
                key={col.key}
                title={col.title}
                accent={col.accent}
                count={tasks.filter((t) => t.status === col.key).length}
              >
                {tasks
                  .filter((t) => t.status === col.key)
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      currentUserId={user?.id}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
              </TaskColumn>
            ))}
          </div>
        )}
      </div>

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
        loading={creating}
        currentUserId={user?.id}
      />
    </>
  )
}
