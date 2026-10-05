import type { DisplayValue } from '../utils/calculator'

type DisplayProps = {
  display: DisplayValue
  expression: string
}

export const CalculatorDisplay = ({
  display,
  expression,
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
    </div>
  )
}