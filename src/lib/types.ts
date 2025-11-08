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