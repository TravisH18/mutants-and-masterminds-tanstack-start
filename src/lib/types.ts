export interface Advantage {
    id: string
    name: string
    description: string
    ranks: number
    costPerRank: number
    totalCost: number
}

export interface Power {
    id: string
    name: string
    description: string
    actionType: string,
    durationType: string,
    rangeType: string,
    effect: string
    rank: number
    costPerRank: number
    totalCost: number
    descriptors: string[]
    extras: string[]
    flaws: string[]
}

export interface Skill {
    id: string
    name: string
    skillType: string
    abilityType: string
    ranks: number
    totalCost: number
}

export interface Equipment {
    id: string
    name: string
    description: string
    type: string
    cost: number
}

export interface Complication {
    id: string
    name: string
    description: string
    type: string
    frequency: string
    intensity: string
}

export interface Abilities {
    strength: number
    stamina: number
    agility: number
    dexterity: number
    fighting: number
    intellect: number
    awareness: number
    presence: number
}

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