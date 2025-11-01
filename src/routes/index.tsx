import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/retroui/Button'
import { Card } from '~/components/retroui/Card'
export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <h1>Welcome</h1>
      <Card>
        <Card.Header>
          <Card.Title>Welcome to the Mutants and Mastermind 3e TTRPG Web App</Card.Title>
          <Card.Description>Built by Travis Hudson using Tanstack Start, Shadcn UI, and Retro UI</Card.Description>
        </Card.Header>
        <Card.Content className='flex flex-col items-center gap-4'>
          <Button>
            <Link to='/login'>Login</Link>{' '}
          </Button>
          <Button>
            <Link to='/signup'>New user? Sign up</Link>{' '}
          </Button>
        </Card.Content>
      </Card>
    </div>
  )
}
