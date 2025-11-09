
import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '~/components/Dashboard'

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { user } = Route.useRouteContext()

  return (
    <div>
      {/* <h1>Welcome, {user?.email}!</h1> */}
      {/* Dashboard content */}
      <Dashboard />
    </div>
  )
}