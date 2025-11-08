// components/character-creation/AbilitiesTab.tsx
import { Card } from "../retroui/Card"

interface AbilitiesTabProps {
  abilities: {
    strength: number
    stamina: number
    agility: number
    dexterity: number
    fighting: number
    intellect: number
    awareness: number
    presence: number
  }
  onAbilitiesChange: (abilities: any) => void
}

const abilityLabels = {
  strength: 'Strength',
  stamina: 'Stamina', 
  agility: 'Agility',
  dexterity: 'Dexterity',
  fighting: 'Fighting',
  intellect: 'Intellect',
  awareness: 'Awareness',
  presence: 'Presence'
}

export function AbilitiesTab({ abilities, onAbilitiesChange }: AbilitiesTabProps) {
  const updateAbility = (ability: string, value: number) => {
    onAbilitiesChange({
      ...abilities,
      [ability]: Math.max(0, value) // Ensure non-negative
    })
  }

  const calculateAbilityCost = (rank: number) => rank * 2 // M&M costs 2 points per ability rank

  return (
    <Card>
      <Card.Header>
        <Card.Title>Abilities</Card.Title>
        <Card.Description>
          Set your character's core abilities. Each rank costs 2 power points.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(abilityLabels).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium">
                {label}
              </label>
              <input
                type="number"
                min="0"
                value={abilities[key as keyof typeof abilities]}
                onChange={(e) => updateAbility(key, parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded-md"
              />
              <div className="text-xs text-gray-500">
                Cost: {calculateAbilityCost(abilities[key as keyof typeof abilities])} pts
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="font-semibold mb-2">Ability Summary</h4>
          <div className="text-sm">
            Total Ability Cost: {
              Object.values(abilities).reduce((sum, rank) => sum + calculateAbilityCost(rank), 0)
            } points
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}