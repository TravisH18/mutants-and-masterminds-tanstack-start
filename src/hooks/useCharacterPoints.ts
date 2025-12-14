import * as React from 'react'
import { CharacterData, PointsState } from '~/lib/types'
export function useCharacterPoints(character: CharacterData, totalPoints: number) {
    const [points, setPoints] = React.useState<PointsState>({
        totalPoints,
        spentPoints: 0,
        remainingPoints: totalPoints,
        bonusPoints: 0,
    })

    React.useEffect(() => {
        // Move your points calculation logic here
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
    }, [character, totalPoints])

    return points
}