// routes/new-character.tsx
import { createFileRoute } from '@tanstack/react-router'
import { NewCharacterWizard } from '~/components/NewCharacterWizard'
import { Loader } from '~/components/retroui/Loader'

export const Route = createFileRoute('/_authed/new-character')({
  component: NewCharacterComponent,
  pendingComponent: () => <div><Loader /></div>
})

function NewCharacterComponent() {
  return <NewCharacterWizard />
}