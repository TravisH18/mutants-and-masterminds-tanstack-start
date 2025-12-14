// components/character-creation/SkillsTab.tsx
import { Card } from '~/components/retroui/Card'
import { Button } from '~/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Skill } from '~/lib/types'


interface SkillsTabProps {
  skills: Skill[]
  onSkillsChange: (skills: Skill[]) => void
}

const defaultSkills = [
  { name: 'Acrobatics', abilityType: 'agility', cost: 1 },
  { name: 'Athletics', abilityType: 'strength', cost: 1 },
  { name: 'Close Combat', abilityType: 'fighting', cost: 1 },
  { name: 'Deception', abilityType: 'presence', cost: 1 },
  { name: 'Expertise', abilityType: 'intellect', cost: 1 },
  { name: 'Insight', abilityType: 'awareness', cost: 1 },
  { name: 'Intimidation', abilityType: 'presence', cost: 1 },
  { name: 'Investigation', abilityType: 'intellect', cost: 1 },
  { name: 'Perception', abilityType: 'awareness', cost: 1 },
  { name: 'Persuasion', abilityType: 'presence', cost: 1 },
  { name: 'Ranged Combat', abilityType: 'dexterity', cost: 1 },
  { name: 'Sleight of Hand', abilityType: 'dexterity', cost: 1 },
  { name: 'Stealth', abilityType: 'agility', cost: 1 },
  { name: 'Technology', abilityType: 'intellect', cost: 1 },
  { name: 'Treatment', abilityType: 'intellect', cost: 1 },
  { name: 'Vehicles', abilityType: 'dexterity', cost: 1 },
]

export function SkillsTab({ skills, onSkillsChange }: SkillsTabProps) {
  const addSkill = (skillName: string) => {
    const newSkill: Skill = {
      id: Math.random().toString(36).substr(2, 9),
      name: skillName,
      abilityType: defaultSkills.find(s => s.name === skillName)?.abilityType || 'intellect',
      ranks: 0,
      totalCost: 0
    }
    onSkillsChange([...skills, newSkill])
  }

  const updateSkill = (id: string, ranks: number) => {
    const updatedSkills = skills.map(skill => 
      skill.id === id 
        ? { ...skill, ranks, totalCost: ranks }
        : skill
    )
    onSkillsChange(updatedSkills)
  }

  const removeSkill = (id: string) => {
    onSkillsChange(skills.filter(skill => skill.id !== id))
  }

  const availableSkills = defaultSkills.filter(
    defaultSkill => !skills.some(skill => skill.name === defaultSkill.name)
  )

  return (
    <Card>
      <Card.Header>
        <Card.Title>Skills</Card.Title>
        <Card.Description>
          Add skills to your character. Each rank costs 1 power point.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-6">
        {/* Add Skill Section */}
        {availableSkills.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Add New Skill</label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map(skill => (
                <Button
                  key={skill.name}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSkill(skill.name)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {skill.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Current Skills */}
        <div className="space-y-4">
          <h4 className="font-semibold">Current Skills</h4>
          {skills.length === 0 ? (
            <p className="text-gray-500 text-sm">No skills added yet.</p>
          ) : (
            <div className="space-y-3">
              {skills.map(skill => (
                <div key={skill.id} className="flex items-center gap-4 p-3 border rounded-md">
                  <div className="flex-1">
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{skill.abilityType}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Ranks:</label>
                    <input
                      type="number"
                      min="0"
                      value={skill.ranks}
                      onChange={(e) => updateSkill(skill.id, parseInt(e.target.value) || 0)}
                      className="w-20 p-1 border rounded"
                    />
                  </div>
                  <div className="text-sm text-gray-600 w-16">
                    Cost: {skill.totalCost}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-500 rounded-md">
          <h4 className="font-semibold mb-2">Skills Summary</h4>
          <div className="text-sm">
            Total Skills Cost: {skills.reduce((sum, skill) => sum + skill.totalCost, 0)} points
          </div>
          <div className="text-sm">
            Number of Skills: {skills.length}
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}