import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '~/utils/supabase'

const fetchCharacters = createServerFn({method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const {user} = Route.useRouteContext()

  if (!user) {
    return null 
  }
  const characters = await supabase
    .from('characters')
    .select('*')
    .eq('player_id', user.id)

  if (!characters) {
    return null
  }
  return {
    characters: characters.data
  }
})

export const Route = createFileRoute('/_authed/characters')({
  component: CharactersComponent,
})

async function CharactersComponent() {
  
  const { user } = Route.useRouteContext()
  
  const characters = await fetchCharacters()
  console.log(characters?.characters)

  return (
    <div>
      <h1>Welcome, to the list of your heros!</h1>
      {/* Get list of heros from supabase */}
    </div>
  )
}