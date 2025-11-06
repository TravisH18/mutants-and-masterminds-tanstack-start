import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/campaigns')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { user } = Route.useRouteContext()

  return (
    <div>
      <h1>Welcome, to your campaigns!</h1>
      {/* Dashboard content */}
    </div>
  )
}