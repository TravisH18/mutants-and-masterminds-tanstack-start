// components/character-creation/PowersTab.tsx
import { Card } from '~/components/retroui/Card'
import { Button } from '~/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Power } from '~/lib/types'


interface PowersTabProps {
  powers: Power[]
  onPowersChange: (powers: Power[]) => void
}

const powerEffects = [
  'Damage', 'Affliction', 'Weaken', 'Transform', 'Create', 'Healing',
  'Movement', 'Senses', 'Protection', 'Enhanced Trait', 'Summon', 'Control',
  'Environment', 'Illusion', 'Insubstantial', 'Immortality', 'Regeneration'
]

const commonExtras = [
  'Area', 'Ranged', 'Affects Incorporeal', 'Affects Insubstantial', 'Alternate Resistance',
  'Attack', 'Aura', 'Contagious', 'Continuous', 'Dimensional', 'Increased Duration',
  'Indirect', 'Innate', 'Insidious', 'Multiattack', 'Penetrating', 'Precise',
  'Reach', 'Ricochet', 'Selective', 'Split', 'Subtle', 'Triggered'
]

const commonFlaws = [
  'Action', 'Ammunition', 'Check Required', 'Concentration', 'Custom',
  'Decreased Duration', 'Diminished Range', 'Distracting', 'Fades',
  'Feedback', 'Grab-Based', 'Inaccurate', 'Limited', 'Noticeable',
  'Quirk', 'Reduced Range', 'Removable', 'Resistible', 'Sense-Dependent',
  'Side Effect', 'Slower', 'Tiring', 'Unreliable'
]

export function PowersTab({ powers, onPowersChange }: PowersTabProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPower, setNewPower] = useState({
    name: '',
    description: '',
    effect: '',
    rank: 1,
    costPerRank: 1,
    descriptors: [] as string[],
    extras: [] as string[],
    flaws: [] as string[]
  })

  const addPower = () => {
    const power: Power = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPower.name,
      description: newPower.description,
      effect: newPower.effect,
      rank: newPower.rank,
      costPerRank: newPower.costPerRank,
      totalCost: newPower.rank * newPower.costPerRank,
      descriptors: newPower.descriptors,
      extras: newPower.extras,
      flaws: newPower.flaws
    }
    onPowersChange([...powers, power])
    setNewPower({
      name: '',
      description: '',
      effect: '',
      rank: 1,
      costPerRank: 1,
      descriptors: [],
      extras: [],
      flaws: []
    })
    setShowAddForm(false)
  }

  const updatePower = (id: string, field: string, value: any) => {
    const updatedPowers = powers.map(power => {
      if (power.id === id) {
        const updated = { ...power, [field]: value }
        if (field === 'rank' || field === 'costPerRank') {
          updated.totalCost = updated.rank * updated.costPerRank
        }
        return updated
      }
      return power
    })
    onPowersChange(updatedPowers)
  }

  const removePower = (id: string) => {
    onPowersChange(powers.filter(power => power.id !== id))
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Powers</Card.Title>
        <Card.Description>
          Add and customize powers for your character. Powers are the core of your superhero abilities.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-6">
        {/* Add Power Button */}
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Power
        </Button>

        {/* Add Power Form */}
        {showAddForm && (
          <Card>
            <Card.Content className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Power Name</label>
                  <input
                    type="text"
                    value={newPower.name}
                    onChange={(e) => setNewPower({...newPower, name: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Energy Blast"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Effect</label>
                  <select
                    value={newPower.effect}
                    onChange={(e) => setNewPower({...newPower, effect: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Effect</option>
                    {powerEffects.map(effect => (
                      <option key={effect} value={effect}>{effect}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={newPower.description}
                  onChange={(e) => setNewPower({...newPower, description: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Rank</label>
                  <input
                    type="number"
                    min="1"
                    value={newPower.rank}
                    onChange={(e) => setNewPower({...newPower, rank: parseInt(e.target.value) || 1})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cost per Rank</label>
                  <input
                    type="number"
                    min="1"
                    value={newPower.costPerRank}
                    onChange={(e) => setNewPower({...newPower, costPerRank: parseInt(e.target.value) || 1})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Total Cost</label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    {newPower.rank * newPower.costPerRank}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addPower}>Add Power</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Current Powers */}
        <div className="space-y-4">
          <h4 className="font-semibold">Current Powers</h4>
          {powers.length === 0 ? (
            <p className="text-gray-500 text-sm">No powers added yet.</p>
          ) : (
            <div className="space-y-4">
              {powers.map(power => (
                <div key={power.id} className="p-4 border rounded-md space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{power.name}</div>
                      <div className="text-sm text-gray-600">{power.description}</div>
                      <div className="text-sm">
                        <strong>Effect:</strong> {power.effect} | 
                        <strong> Descriptors:</strong> {power.descriptors.join(', ') || 'None'}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePower(power.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Rank:</label>
                      <input
                        type="number"
                        min="1"
                        value={power.rank}
                        onChange={(e) => updatePower(power.id, 'rank', parseInt(e.target.value) || 1)}
                        className="w-20 p-1 border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Cost/Rank:</label>
                      <input
                        type="number"
                        min="1"
                        value={power.costPerRank}
                        onChange={(e) => updatePower(power.id, 'costPerRank', parseInt(e.target.value) || 1)}
                        className="w-20 p-1 border rounded"
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Cost: {power.totalCost}
                    </div>
                  </div>

                  {power.extras.length > 0 && (
                    <div className="text-sm">
                      <strong>Extras:</strong> {power.extras.join(', ')}
                    </div>
                  )}
                  {power.flaws.length > 0 && (
                    <div className="text-sm">
                      <strong>Flaws:</strong> {power.flaws.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h4 className="font-semibold mb-2">Powers Summary</h4>
          <div className="text-sm">
            Total Powers Cost: {powers.reduce((sum, power) => sum + power.totalCost, 0)} points
          </div>
          <div className="text-sm">
            Number of Powers: {powers.length}
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}