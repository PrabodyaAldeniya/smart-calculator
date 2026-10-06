import type { DisplayValue } from '../utils/calculator'

type DisplayProps = {
  display: DisplayValue
  expression: string
  onHistoryToggle: () => void
}

export const CalculatorDisplay = ({
  display,
  expression,
  onHistoryToggle,
}: DisplayProps) => {
  const expr = expression === '0' || expression === '' ? '' : expression

  return (
    <div className="calculator-display">
      <div className="display-line expression">
        {expr}
      </div>
      <div className="display-line current">
        {display}
      </div>
      <button
        className="calculator-button function history-display-btn"
        onClick={onHistoryToggle}
        aria-label="Toggle calculation history"
        style={{ flexShrink: 0 }}
      >
        📜
      </button>
    </div>
  )
}