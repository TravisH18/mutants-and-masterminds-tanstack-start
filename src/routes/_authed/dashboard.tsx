
import { createFileRoute } from '@tanstack/react-router'
import AuthedNav from '~/components/AuthedNav'
import Dashboard from '~/components/Dashboard'

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { user } = Route.useRouteContext()

  return (
    <div>
      <AuthedNav />
      <h1>Welcome, {user?.email}!</h1>
      {/* Dashboard content */}
      <Dashboard />
    </div>
  )
}