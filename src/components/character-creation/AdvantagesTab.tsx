// components/character-creation/AdvantagesTab.tsx
import { Card } from '~/components/retroui/Card'
import { Button } from '~/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Advantage } from '~/lib/types'


interface AdvantagesTabProps {
  advantages: Advantage[]
  onAdvantagesChange: (advantages: Advantage[]) => void
}

const commonAdvantages = [
  { name: 'Accurate Attack', description: 'Trade damage for attack bonus', cost: 1 },
  { name: 'All-out Attack', description: 'Trade defense for attack bonus', cost: 1 },
  { name: 'Animal Empathy', description: 'Communicate with animals', cost: 1 },
  { name: 'Assessment', description: 'Evaluate opponent capabilities', cost: 1 },
  { name: 'Defensive Attack', description: 'Trade attack for defense bonus', cost: 1 },
  { name: 'Defensive Roll', description: 'Bonus to active defenses', cost: 1 },
  { name: 'Equipment', description: 'Access to equipment points', cost: 1 },
  { name: 'Evasion', description: 'Bonus against area attacks', cost: 1 },
  { name: 'Fast Grab', description: 'Grab as a free action', cost: 1 },
  { name: 'Fearless', description: 'Immunity to fear effects', cost: 1 },
  { name: 'Improved Aim', description: 'Bonus when aiming', cost: 1 },
  { name: 'Improved Critical', description: 'Increase critical threat range', cost: 1 },
  { name: 'Improved Defense', description: 'Bonus to active defenses', cost: 1 },
  { name: 'Improved Disarm', description: 'Bonus to disarm attempts', cost: 1 },
  { name: 'Improved Initiative', description: 'Bonus to initiative rolls', cost: 1 },
  { name: 'Improved Trip', description: 'Bonus to trip attempts', cost: 1 },
  { name: 'Instant Up', description: 'Stand from prone as free action', cost: 1 },
  { name: 'Power Attack', description: 'Trade attack bonus for damage', cost: 1 },
  { name: 'Precise Attack', description: 'Ignore attack penalties', cost: 1 },
  { name: 'Quick Draw', description: 'Draw weapons as free action', cost: 1 },
  { name: 'Seize Initiative', description: 'Act in surprise round', cost: 1 },
  { name: 'Takedown', description: 'Extra attacks after defeating foes', cost: 1 },
  { name: 'Taunt', description: 'Demoralize foes as move action', cost: 1 },
  { name: 'Uncanny Dodge', description: 'Aware of attacks even when surprised', cost: 1 },
]

export function AdvantagesTab({ advantages, onAdvantagesChange }: AdvantagesTabProps) {
  const addAdvantage = (advantageName: string) => {
    const advantageInfo = commonAdvantages.find(a => a.name === advantageName)
    const newAdvantage: Advantage = {
      id: Math.random().toString(36).substr(2, 9),
      name: advantageName,
      description: advantageInfo?.description || '',
      ranks: 1,
      costPerRank: advantageInfo?.cost || 1,
      totalCost: advantageInfo?.cost || 1
    }
    onAdvantagesChange([...advantages, newAdvantage])
  }

  const updateAdvantage = (id: string, field: string, value: any) => {
    const updatedAdvantages = advantages.map(adv => {
      if (adv.id === id) {
        const updated = { ...adv, [field]: value }
        if (field === 'ranks' || field === 'costPerRank') {
          updated.totalCost = updated.ranks * updated.costPerRank
        }
        return updated
      }
      return adv
    })
    onAdvantagesChange(updatedAdvantages)
  }

  const removeAdvantage = (id: string) => {
    onAdvantagesChange(advantages.filter(adv => adv.id !== id))
  }

  const availableAdvantages = commonAdvantages.filter(
    defaultAdv => !advantages.some(adv => adv.name === defaultAdv.name)
  )

  return (
    <Card>
      <Card.Header>
        <Card.Title>Advantages</Card.Title>
        <Card.Description>
          Add advantages to your character. Most advantages cost 1 point per rank.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-6">
        {/* Add Advantage Section */}
        {availableAdvantages.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Add New Advantage</label>
            <div className="flex flex-wrap gap-2">
              {availableAdvantages.map(advantage => (
                <Button
                  key={advantage.name}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addAdvantage(advantage.name)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {advantage.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Current Advantages */}
        <div className="space-y-4">
          <h4 className="font-semibold">Current Advantages</h4>
          {advantages.length === 0 ? (
            <p className="text-gray-500 text-sm">No advantages added yet.</p>
          ) : (
            <div className="space-y-4">
              {advantages.map(advantage => (
                <div key={advantage.id} className="p-4 border rounded-md space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{advantage.name}</div>
                      <div className="text-sm text-gray-600">{advantage.description}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAdvantage(advantage.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Ranks:</label>
                      <input
                        type="number"
                        min="1"
                        value={advantage.ranks}
                        onChange={(e) => updateAdvantage(advantage.id, 'ranks', parseInt(e.target.value) || 1)}
                        className="w-20 p-1 border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Cost/Rank:</label>
                      <input
                        type="number"
                        min="1"
                        value={advantage.costPerRank}
                        onChange={(e) => updateAdvantage(advantage.id, 'costPerRank', parseInt(e.target.value) || 1)}
                        className="w-20 p-1 border rounded"
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Cost: {advantage.totalCost}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h4 className="font-semibold mb-2">Advantages Summary</h4>
          <div className="text-sm">
            Total Advantages Cost: {advantages.reduce((sum, adv) => sum + adv.totalCost, 0)} points
          </div>
          <div className="text-sm">
            Number of Advantages: {advantages.length}
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}