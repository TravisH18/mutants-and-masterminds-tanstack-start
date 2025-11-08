import { ErrorComponent, createFileRoute } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import CharacterSheet from '~/components/CharacterSheet'
import { NotFound } from '~/components/NotFound'
import { getSupabaseServerClient } from '~/utils/supabase'

const fetchCharacter = createServerFn({ method: 'GET' })
    .inputValidator((d: string) => d)
    .handler(async ({ data: characterId }) => {
        console.info(`Fetching character with ID ${characterId}`)
        const supabase = getSupabaseServerClient()

        const { data, error } = await supabase
            .from('characters')
            .select('*')
            .eq('id', characterId)

        if (error) {
            return null
        }

        if (data) {
            return {
                character: data
            }
        }


    })

export const Route = createFileRoute('/_authed/characters/$characterId')({
    loader: ({ params: {characterId } }) => fetchCharacter(characterId),
    errorComponent: CharacterErrorComponent,
    component: CharacterComponent,
    notFoundComponent: () => {
        return <NotFound>Character Not Found</NotFound>
    }
})


export function CharacterErrorComponent({ error }: ErrorComponentProps) {
    return <ErrorComponent error={error} />
}

function CharacterComponent() {
    const character = Route.useLoaderData()
    console.log('Character:', character)
    return (
        <CharacterSheet />
    )
}

