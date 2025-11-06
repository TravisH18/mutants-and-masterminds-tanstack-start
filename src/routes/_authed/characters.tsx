import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/characters')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { user } = Route.useRouteContext()

  return (
    <div>
      <h1>Welcome, to the list of your heros!</h1>
      {/* Dashboard content */}
    </div>
  )
}