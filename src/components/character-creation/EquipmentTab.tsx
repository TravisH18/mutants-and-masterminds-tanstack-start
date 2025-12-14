// components/character-creation/EquipmentTab.tsx
import { Card } from '~/components/retroui/Card'
import { Button } from '~/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Equipment } from '~/lib/types'
import { Label } from "../retroui/Label"
import { Input } from "../retroui/Input"
import { Textarea } from '../retroui/Textarea'

interface EquipmentTabProps {
  equipment: Equipment[]
  onEquipmentChange: (equipment: Equipment[]) => void
}

const equipmentTypes = ['gadget', 'vehicle', 'headquarters', 'weapon', 'armor', 'other']

export function EquipmentTab({ equipment, onEquipmentChange }: EquipmentTabProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    description: '',
    type: 'gadget',
    cost: 0
  })

  const addEquipment = () => {
    const item: Equipment = {
      id: Math.random().toString(36).substr(2, 9),
      name: newEquipment.name,
      description: newEquipment.description,
      type: newEquipment.type,
      cost: newEquipment.cost
    }
    onEquipmentChange([...equipment, item])
    setNewEquipment({
      name: '',
      description: '',
      type: 'gadget',
      cost: 0
    })
    setShowAddForm(false)
  }

  const removeEquipment = (id: string) => {
    onEquipmentChange(equipment.filter(item => item.id !== id))
  }

  const updateEquipment = (id: string, field: string, value: any) => {
    const updatedEquipment = equipment.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    )
    onEquipmentChange(updatedEquipment)
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Equipment</Card.Title>
        <Card.Description>
          Add equipment, gadgets, vehicles, and headquarters for your character.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-6">
        {/* Add Equipment Button */}
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>

        {/* Add Equipment Form */}
        {showAddForm && (
          <Card>
            <Card.Content className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <Input
                    type="text"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Utility Belt"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <select
                    value={newEquipment.type}
                    onChange={(e) => setNewEquipment({...newEquipment, type: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {equipmentTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                  value={newEquipment.description}
                  onChange={(e: any) => setNewEquipment({...newEquipment, description: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Describe the equipment and its capabilities..."
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Cost</Label>
                <Input
                  type="number"
                  min="0"
                  value={newEquipment.cost}
                  onChange={(e) => setNewEquipment({...newEquipment, cost: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addEquipment}>Add Equipment</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Current Equipment */}
        <div className="space-y-4">
          <h4 className="font-semibold">Current Equipment</h4>
          {equipment.length === 0 ? (
            <p className="text-gray-500 text-sm">No equipment added yet.</p>
          ) : (
            <div className="space-y-3">
              {equipment.map(item => (
                <div key={item.id} className="p-4 border rounded-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">
                        Cost: {item.cost}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEquipment(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-500 rounded-md">
          <h4 className="font-semibold mb-2">Equipment Summary</h4>
          <div className="text-sm">
            Total Equipment Cost: {equipment.reduce((sum, item) => sum + item.cost, 0)} points
          </div>
          <div className="text-sm">
            Number of Equipment Items: {equipment.length}
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}