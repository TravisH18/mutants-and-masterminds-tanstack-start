// components/character-creation/ComplicationsTab.tsx
import { Card } from '~/components/retroui/Card'
import { Button } from '~/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Complication } from '~/lib/types'
import { Label } from "../retroui/Label"
import { Input } from "../retroui/Input"

interface ComplicationsTabProps {
  complications: Complication[]
  onComplicationsChange: (complications: Complication[]) => void
}

const complicationTypes = [
  'motivation', 'enemy', 'responsibility', 'reputation', 
  'accident', 'circumstance', 'relationship', 'physical', 'other'
]

const frequencyLevels = ['very common', 'common', 'uncommon', 'rare']
const intensityLevels = ['high', 'moderate', 'low']

export function ComplicationsTab({ complications, onComplicationsChange }: ComplicationsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newComplication, setNewComplication] = useState({
    name: '',
    description: '',
    type: 'motivation',
    frequency: 'common',
    intensity: 'moderate'
  })

  const addComplication = () => {
    const complication: Complication = {
      id: Math.random().toString(36).substr(2, 9),
      name: newComplication.name,
      description: newComplication.description,
      type: newComplication.type,
      frequency: newComplication.frequency,
      intensity: newComplication.intensity
    }
    onComplicationsChange([...complications, complication])
    setNewComplication({
      name: '',
      description: '',
      type: 'motivation',
      frequency: 'common',
      intensity: 'moderate'
    })
    setShowAddForm(false)
  }

  const removeComplication = (id: string) => {
    onComplicationsChange(complications.filter(comp => comp.id !== id))
  }

  const updateComplication = (id: string, field: string, value: any) => {
    const updatedComplications = complications.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    )
    onComplicationsChange(updatedComplications)
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Complications</Card.Title>
        <Card.Description>
          Add complications to your character. Each complication typically provides 1 bonus power point.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-6">
        {/* Add Complication Button */}
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Complication
        </Button>

        {/* Add Complication Form */}
        {showAddForm && (
          <Card>
            <Card.Content className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium">Complication Name</Label>
                <Input
                  type="text"
                  value={newComplication.name}
                  onChange={(e) => setNewComplication({...newComplication, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., Secret Identity"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <textarea
                  value={newComplication.description}
                  onChange={(e) => setNewComplication({...newComplication, description: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Describe the complication and how it affects your character..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <select
                    value={newComplication.type}
                    onChange={(e) => setNewComplication({...newComplication, type: e.target.value})}
                    className="w-full p-2 border rounded-md bg-card"
                  >
                    {complicationTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Frequency</Label>
                  <select
                    value={newComplication.frequency}
                    onChange={(e) => setNewComplication({...newComplication, frequency: e.target.value})}
                    className="w-full p-2 border rounded-md bg-card"
                  >
                    {frequencyLevels.map(freq => (
                      <option key={freq} value={freq}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Intensity</Label>
                  <select
                    value={newComplication.intensity}
                    onChange={(e) => setNewComplication({...newComplication, intensity: e.target.value})}
                    className="w-full p-2 border rounded-md bg-card"
                  >
                    {intensityLevels.map(intensity => (
                      <option key={intensity} value={intensity}>
                        {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addComplication}>Add Complication</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Current Complications */}
        <div className="space-y-4">
          <h4 className="font-semibold">Current Complications</h4>
          {complications.length === 0 ? (
            <p className="text-gray-500 text-sm">No complications added yet.</p>
          ) : (
            <div className="space-y-3">
              {complications.map(complication => (
                <div key={complication.id} className="p-4 border rounded-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{complication.name}</span>
                        <span className="text-xs px-2 py-1 bg-gray-500 rounded-full capitalize">
                          {complication.type}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-500 rounded-full capitalize">
                          {complication.frequency}
                        </span>
                        <span className="text-xs px-2 py-1 bg-red-500 rounded-full capitalize">
                          {complication.intensity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{complication.description}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeComplication(complication.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-500 rounded-md">
          <h4 className="font-semibold mb-2">Complications Summary</h4>
          <div className="text-sm">
            Number of Complications: {complications.length}
          </div>
          <div className="text-sm text-green-600">
            Bonus Power Points: +{complications.length}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Note: Each complication typically provides 1 bonus power point in Mutants & Masterminds.
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}