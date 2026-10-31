import { Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import { useAuth } from "./context/AuthContext"
import { Spinner } from "./components/ui/Spinner"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import WorkspacesPage from "./pages/WorkspacesPage"
import WorkspacePage from "./pages/WorkspacePage"
import OverviewTab from "./pages/workspace-tabs/OverviewTab"
import ChatTab from "./pages/workspace-tabs/ChatTab"
import TasksTab from "./pages/workspace-tabs/TasksTab"
import InsightsTab from "./pages/workspace-tabs/InsightsTab"
import AskAITab from "./pages/workspace-tabs/AskAITab"
import MembersTab from "./pages/workspace-tabs/MembersTab"
import NotFoundPage from "./pages/NotFoundPage"

function HomeRoute() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900">
        <Spinner label="Loading" />
      </div>
    )
  }
  return user ? <Navigate to="/workspaces" replace /> : <LandingPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/workspaces"
        element={
          <ProtectedRoute>
            <WorkspacesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workspaces/:workspaceId"
        element={
          <ProtectedRoute>
            <WorkspacePage />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewTab />} />
        <Route path="chat" element={<ChatTab />} />
        <Route path="tasks" element={<TasksTab />} />
        <Route path="insights" element={<InsightsTab />} />
        <Route path="ask-ai" element={<AskAITab />} />
        <Route path="members" element={<MembersTab />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
