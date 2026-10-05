import type { DisplayValue } from '../utils/calculator'
import type { CalculationRecord } from '../types/calculator'

export const CalculatorDisplay = ({
  display,
  history,
}: {
  display: DisplayValue
  history: CalculationRecord[]
}) => {
  return (
    <div className="calculator-display">
      <div className="display-line current">
        {display}
      </div>
      {history.length > 0 && (
        <div className="display-line history">
          {history[history.length - 1].expression}
        </div>
      )}
    </div>
  )
}