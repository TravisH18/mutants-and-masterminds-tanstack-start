// components/NewCharacterWizard.tsx
import { useState, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsPanels, TabsTrigger, TabsTriggerList } from '~/components/retroui/Tab'
import { Card } from './retroui/Card'
import { AbilitiesTab } from '~/components/character-creation/AbilitiesTab'
import { SkillsTab } from '~/components/character-creation/SkillsTab'
import { AdvantagesTab } from '~/components/character-creation/AdvantagesTab'
import { PowersTab } from '~/components/character-creation/PowersTab'
import { EquipmentTab } from '~/components/character-creation/EquipmentTab'
import { ComplicationsTab } from '~/components/character-creation/ComplicationsTab'
import { PointsDisplay } from '~/components/character-creation/PointsDisplay'
import { Power, Skill, Equipment, Complication, Advantage, Abilities } from '~/lib/types'
import { getSupabaseServerClient } from '~/utils/supabase'
import { toast } from 'sonner'

export interface CharacterData {
    id?: string
    name: string
    campaign_id?: string
    player_id?: string
    power_points: number
    hero_points: number
    power_level: number
    dodge: number
    parry: number
    fortitude: number
    toughness: number
    will: number
    identity?: string
    description?: string
    background?: string
    abilities: Abilities
    skills: Array<Skill>
    advantages: Array<Advantage>
    powers: Array<Power>
    equipment: Array<Equipment>
    complications: Array<Complication>
}

export interface PointsState {
    totalPoints: number
    spentPoints: number
    remainingPoints: number
    bonusPoints: number // From complications
}

export function NewCharacterWizard() {
    const supabase = getSupabaseServerClient()

    const router = useRouter()
    const [character, setCharacter] = useState<CharacterData>({
        name: '',
        campaign_id: '', // You'll set this from route params or selection
        power_points: 150,
        hero_points: 1,
        power_level: 10,
        identity: '',
        description: '',
        background: '',
        abilities: {
            strength: 0,
            stamina: 0,
            agility: 0,
            dexterity: 0,
            fighting: 0,
            intellect: 0,
            awareness: 0,
            presence: 0,
        },
        dodge: 0,
        parry: 0,
        fortitude: 0,
        toughness: 0,
        will: 0,
        skills: [],
        advantages: [],
        powers: [],
        equipment: [],
        complications: [],
    })

    const [points, setPoints] = useState<PointsState>({
        totalPoints: 150, // Default for PL 10
        spentPoints: 0,
        remainingPoints: 150,
        bonusPoints: 0,
    })

    const [isSaving, setIsSaving] = useState(false)

    // Calculate total points spent whenever character data changes
    useEffect(() => {
        const calculatePoints = () => {
            // Ability costs (2 points per rank in M&M)
            const abilityCost = Object.values(character.abilities).reduce((sum, rank) => sum + rank * 2, 0)

            // Skill costs (1 point per rank)
            const skillCost = character.skills.reduce((sum, skill) => sum + skill.totalCost, 0)

            // Advantage costs
            const advantageCost = character.advantages.reduce((sum, adv) => sum + adv.totalCost, 0)

            // Power costs
            const powerCost = character.powers.reduce((sum, power) => sum + power.totalCost, 0)

            // Equipment costs
            const equipmentCost = character.equipment.reduce((sum, item) => sum + item.cost, 0)

            // Bonus points from complications (typically 1 point per complication in M&M)
            const bonusPoints = character.complications.length

            const spentPoints = abilityCost + skillCost + advantageCost + powerCost + equipmentCost
            const remainingPoints = points.totalPoints + bonusPoints - spentPoints

            setPoints({
                totalPoints: points.totalPoints,
                spentPoints,
                remainingPoints,
                bonusPoints,
            })
        }

        calculatePoints()
    }, [character, points.totalPoints])

    const updateCharacter = (updates: Partial<CharacterData>) => {
        setCharacter(prev => ({ ...prev, ...updates }))
    }

    const handleSaveCharacter = async () => {
        if (points.remainingPoints < 0 || !character.name) {
            alert('Please fix validation errors before saving.')
            return
        }

        setIsSaving(true)

        try {
            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                throw new Error('You must be logged in to save a character')
            }

            // Prepare main character data
            const characterData = {
                name: character.name,
                player_id: user.id,
                campaign_id: character.campaign_id || null,
                power_points: points.totalPoints,
                hero_points: character.hero_points,
                power_level: character.power_level,
                // Abilities
                strength: character.abilities.strength,
                stamina: character.abilities.stamina,
                agility: character.abilities.agility,
                dexterity: character.abilities.dexterity,
                fighting: character.abilities.fighting,
                intellect: character.abilities.intellect,
                awareness: character.abilities.awareness,
                presence: character.abilities.presence,
                // Combat Values (calculate or use defaults)
                dodge: character.dodge || 0,
                parry: character.parry || 0,
                fortitude: character.fortitude || 0,
                toughness: character.toughness || 0,
                will: character.will || 0,
                // Details
                identity: character.identity || '',
                description: character.description || '',
                background: character.background || '',
            }

            // Upsert main character record
            const { data: savedCharacter, error: characterError } = await supabase
                .from('characters')
                .upsert(characterData)
                .select()
                .single()

            if (characterError) {
                throw new Error(`Failed to save character: ${characterError.message}`)
            }

            const characterId = savedCharacter.id

            // Save related data in parallel for better performance
            const savePromises = []

            // Save skills
            if (character.skills.length > 0) {
                const skillsData = character.skills.map(skill => ({
                    ...skill,
                    character_id: characterId
                }))
                savePromises.push(
                    supabase.from('character_skills').upsert(skillsData)
                )
            }

            // Save advantages
            if (character.advantages.length > 0) {
                const advantagesData = character.advantages.map(advantage => ({
                    ...advantage,
                    character_id: characterId
                }))
                savePromises.push(
                    supabase.from('character_advantages').upsert(advantagesData)
                )
            }

            // Save powers
            if (character.powers.length > 0) {
                const powersData = character.powers.map(power => ({
                    ...power,
                    character_id: characterId,
                    descriptors: power.descriptors || [] // Ensure array
                }))
                savePromises.push(
                    supabase.from('character_powers').upsert(powersData)
                )
            }

            // Save equipment
            if (character.equipment.length > 0) {
                const equipmentData = character.equipment.map(item => ({
                    ...item,
                    character_id: characterId
                }))
                savePromises.push(
                    supabase.from('equipment').upsert(equipmentData)
                )
            }

            // Save complications
            if (character.complications.length > 0) {
                const complicationsData = character.complications.map(complication => ({
                    ...complication,
                    character_id: characterId
                }))
                savePromises.push(
                    supabase.from('character_complications').upsert(complicationsData)
                )
            }

            // Wait for all related data to save
            const results = await Promise.all(savePromises)

            // Check for any errors in related data saves
            const errors = results.filter(result => result.error)
            if (errors.length > 0) {
                console.warn('Some related data failed to save:', errors)
                // You might want to show a warning but still proceed since main character saved
            }

            // Update local state with the ID for future updates
            setCharacter(prev => ({ ...prev, id: characterId }))

            // Navigate to the character page
            // await router.navigate({
            //     to: '/_authed/characters/$characterId',
            //     params: { characterId }
            // })

        } catch (error) {
            console.error('Error saving character:', error)
            toast.error(`Failed to save character: ${error}`)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Fixed Points Display */}
            <div className="sticky top-4 z-10">
                <PointsDisplay points={points} />
            </div>

            {/* Character Name Input */}
            <Card>
                <Card.Header>
                    <Card.Title>Character Basics</Card.Title>
                    <Card.Description>Enter your character's name and basic information</Card.Description>
                </Card.Header>
                <Card.Content>
                    <input
                        type="text"
                        placeholder="Character Name"
                        value={character.name}
                        onChange={(e) => updateCharacter({ name: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />
                </Card.Content>
            </Card>

            {/* Creation Tabs */}
            <Tabs defaultValue="abilities" className="w-full">
                <TabsTriggerList className="grid grid-cols-6 mb-8">
                    <TabsTrigger value="abilities">Abilities</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="advantages">Advantages</TabsTrigger>
                    <TabsTrigger value="powers">Powers</TabsTrigger>
                    <TabsTrigger value="equipment">Equipment</TabsTrigger>
                    <TabsTrigger value="complications">Complications</TabsTrigger>
                </TabsTriggerList>
                <TabsPanels>
                    <TabsContent>
                        <AbilitiesTab
                            abilities={character.abilities}
                            onAbilitiesChange={(abilities) => updateCharacter({ abilities })}
                        />
                    </TabsContent>

                    <TabsContent>
                        <SkillsTab
                            skills={character.skills}
                            onSkillsChange={(skills) => updateCharacter({ skills })}
                        />
                    </TabsContent>

                    <TabsContent>
                        <AdvantagesTab
                            advantages={character.advantages}
                            onAdvantagesChange={(advantages) => updateCharacter({ advantages })}
                        />
                    </TabsContent>

                    <TabsContent>
                        <PowersTab
                            powers={character.powers}
                            onPowersChange={(powers) => updateCharacter({ powers })}
                        />
                    </TabsContent>

                    <TabsContent>
                        <EquipmentTab
                            equipment={character.equipment}
                            onEquipmentChange={(equipment: Equipment[]) => updateCharacter({ equipment })}
                        />
                    </TabsContent>

                    <TabsContent>
                        <ComplicationsTab
                            complications={character.complications}
                            onComplicationsChange={(complications: Complication[]) => updateCharacter({ complications })}
                        />
                    </TabsContent>
                </TabsPanels>

            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                    onClick={() => router.navigate({ to: '/dashboard' })}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSaveCharacter}
                    disabled={points.remainingPoints < 0 || !character.name}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Save Character
                </button>
            </div>
        </div>
    )
}