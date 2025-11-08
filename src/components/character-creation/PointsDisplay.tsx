// components/character-creation/PointsDisplay.tsx - Updated
import { Card } from '~/components/retroui/Card'
import { PointsState } from '~/components/NewCharacterWizard'
import { CircleCheck, TriangleAlert } from 'lucide-react'
interface PointsDisplayProps {
  points: PointsState
}

export function PointsDisplay({ points }: PointsDisplayProps) {
  return (
    <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
      <Card.Content className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Points</div>
            <div className="text-2xl font-bold text-blue-600">{points.totalPoints}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Spent Points</div>
            <div className="text-2xl font-bold text-red-600">{points.spentPoints}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Bonus Points</div>
            <div className="text-2xl font-bold text-green-600">+{points.bonusPoints}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Remaining Points</div>
            <div className={`text-2xl font-bold ${
              points.remainingPoints < 0 ? 'text-red-600' : 
              points.remainingPoints === 0 ? 'text-green-600' : 'text-blue-600'
            }`}>
              {points.remainingPoints}
            </div>
          </div>
        </div>
        {points.remainingPoints < 0 && (
          <div className="text-center text-red-600 text-sm mt-2 font-semibold">
            <TriangleAlert /> You have overspent by {Math.abs(points.remainingPoints)} points!
          </div>
        )}
        {points.remainingPoints > 0 && (
          <div className="text-center text-green-600 text-sm mt-2">
            You have {points.remainingPoints} points remaining to spend
          </div>
        )}
        {points.remainingPoints === 0 && (
          <div className="text-center text-green-600 text-sm mt-2 font-semibold">
            <CircleCheck /> Perfect! All points allocated.
          </div>
        )}
      </Card.Content>
    </Card>
  )
}
