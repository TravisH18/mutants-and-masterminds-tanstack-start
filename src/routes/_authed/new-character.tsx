// routes/new-character.tsx
import { createFileRoute } from '@tanstack/react-router'
import { NewCharacterWizard } from '~/components/NewCharacterWizard'

export const Route = createFileRoute('/new-character')({
  component: NewCharacterComponent,
})

function NewCharacterComponent() {
  return <NewCharacterWizard />
}