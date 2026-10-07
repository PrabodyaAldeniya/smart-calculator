import { useState } from 'react'
import { CalculatorDisplay } from './CalculatorDisplay'
import { CalculatorButton } from './CalculatorButton'
import type { Operator, CalculationRecord, AngleMode } from '../types/calculator'
import { toRadians, toDegrees } from '../utils/calculator'

type CalculatorProps = {
  initialDisplay?: string
  onAddToHistory: (expression: string, result: string) => void
  toggleHistory: () => void
  historyOpen: boolean
  history: CalculationRecord[]
  clearHistory: () => void
}

const Calculator = ({
  initialDisplay,
  onAddToHistory,
  toggleHistory,
  historyOpen,
  history,
  clearHistory,
}: CalculatorProps) => {
  const [display, setDisplay] = useState<string>(initialDisplay ?? '0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false)
  const [expression, setExpression] = useState<string>('0')
  const [angleMode, setAngleMode] = useState<AngleMode>('deg')
  const [isInverse, setIsInverse] = useState<boolean>(false)
  const [ansValue, setAnsValue] = useState<string | null>(null)

  const handleNumber = (digit: string) => {
    if (display === 'Error') {
      setDisplay('0')
    }
    setDisplay(prev => {
      if (waitingForOperand) {
        return digit
      }
      if (prev === '0') return digit
      return prev + digit
    })
    if (waitingForOperand) {
      setWaitingForOperand(false)
      setExpression(prev => prev + digit)
    } else if (expression === '0') {
      setExpression(digit)
    } else {
      setExpression(prev => prev + digit)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setExpression('0')
  }

  const handleBackspace = () => {
    if (display === 'Error') {
      setDisplay('0')
      setExpression('0')
      return
    }

    setDisplay(prev => {
      if (prev.length <= 1) return '0'
      return prev.slice(0, -1)
    })

    setExpression(prev => {
      if (prev === '0' || prev === '') return '0'
      if (prev.length <= 1) return '0'
      return prev.slice(0, -1)
    })
  }

  const handleDecimal = () => {
    if (!display.includes('.')) {
      if (waitingForOperand) {
        setDisplay('0.')
      } else {
        setDisplay(prev => prev + '.')
      }
    }
    if (!expression.includes('.')) {
      setExpression(prev => prev + '.')
    }
  }

  const handleOperator = (op: Operator) => {
    const current = parseFloat(display)

    if (isNaN(current)) return

    if (op === '%') {
      const percentValue = current / 100
      setDisplay(String(percentValue))
      setPreviousValue(current)
      setOperator('%' as Operator)
      setWaitingForOperand(true)
      setExpression(prev => prev === '0' ? String(percentValue) : prev + ' %')
      return
    }

    if (operator !== null && previousValue !== null && !waitingForOperand) {
      let result: number
      switch (operator) {
        case '+': result = previousValue + current; break
        case '-': result = previousValue - current; break
        case '×': result = previousValue * current; break
        case '÷':
          if (current === 0) {
            setDisplay('Error')
            return
          }
          result = previousValue / current
          break
        default: return
      }

      if (!isFinite(result)) {
        setDisplay('Error')
      } else {
        const roundedResult = Math.round(result * 1000000) / 1000000
        setDisplay(String(roundedResult))
        setPreviousValue(roundedResult as number)
        setExpression(String(roundedResult))
      }
    } else {
      setPreviousValue(current)
      setOperator(op)
      setWaitingForOperand(true)
      if (expression === '0') {
        setExpression(`${current} ${op} `)
      } else {
        setExpression(prev => prev + `${op} `)
      }
    }
  }

  const handleEquals = () => {
    if (operator === null) return

    const current = parseFloat(display)
    if (isNaN(current)) return

    let result: number

    switch (operator) {
      case '+': result = (previousValue ?? 0) + current; break
      case '-': result = (previousValue ?? 0) - current; break
      case '×': result = (previousValue ?? 0) * current; break
      case '÷':
        if (current === 0) {
          setDisplay('Error')
          return
        }
        result = (previousValue ?? 0) / current
        break
      case '%': result = (previousValue ?? 0) % current; break
      default: return
    }

    const roundedResult = Math.round(result * 1000000) / 1000000

    if (!isFinite(result)) {
      setDisplay('Error')
    } else {
      const exprForSmall = `${previousValue ?? 0} ${operator} ${current}`
      const exprForHistory = `${exprForSmall} = ${roundedResult}`
      setDisplay(String(roundedResult))
      onAddToHistory(exprForHistory, String(roundedResult))
      setExpression(exprForSmall)
    }

    setPreviousValue(roundedResult as number)
    setOperator(null)
    setWaitingForOperand(true)
    setAnsValue(String(roundedResult))
  }

  const handleScientific = (op: Operator) => {
    const current = parseFloat(display)

    if (isNaN(current)) return

    let result: number

    const isTrigInverse = isInverse && ['sin', 'cos', 'tan'].includes(op)

    switch (op) {
      case 'sin': {
        if (isTrigInverse) {
          if (current < -1 || current > 1) return
          result = Math.asin(current)
          if (angleMode === 'deg') result = toDegrees(result)
        } else {
          const radians = angleMode === 'deg' ? toRadians(current) : current
          result = Math.sin(radians)
        }
        break
      }
      case 'cos': {
        if (isTrigInverse) {
          if (current < -1 || current > 1) return
          result = Math.acos(current)
          if (angleMode === 'deg') result = toDegrees(result)
        } else {
          const radians = angleMode === 'deg' ? toRadians(current) : current
          result = Math.cos(radians)
        }
        break
      }
      case 'tan': {
        if (isTrigInverse) {
          result = Math.atan(current)
          if (angleMode === 'deg') result = toDegrees(result)
        } else {
          const radians = angleMode === 'deg' ? toRadians(current) : current
          result = Math.tan(radians)
        }
        break
      }
      case 'ln':
        if (current <= 0) return
        result = Math.log(current)
        break
      case 'log':
        if (current <= 0) return
        result = Math.log10(current)
        break
      case '√':
        if (current < 0) return
        result = Math.sqrt(current)
        break
      case 'x!':
        if (!Number.isInteger(current) || current < 0) return
        let fact = 1
        for (let i = 2; i <= current; i++) fact *= i
        result = fact
        break
      case 'xʸ':
        if (previousValue === null) return
        result = Math.pow(previousValue, current)
        break
      case 'π':
        result = Math.PI
        break
      case 'e':
        result = Math.E
        break
      case 'Ans':
        if (ansValue === null || ansValue === '0' || ansValue === 'Error') return
        setDisplay(String(parseFloat(ansValue)))
        setExpression(ansValue)
        setWaitingForOperand(true)
        return
      case 'Inv':
        if (current === 0) return
        result = 1 / current
        break
      case 'EXP':
        result = Math.exp(current)
        break
      case '(':
      case ')':
        return
      default:
        return
    }

    if (!isFinite(result)) {
      setDisplay('Error')
      return
    }

    const roundedResult = Math.round(result * 1000000) / 1000000

    let opDisplay: string
    if (['sin', 'cos', 'tan'].includes(op)) {
      opDisplay = isInverse
        ? op === 'sin'
          ? 'sin⁻¹'
          : op === 'cos'
          ? 'cos⁻¹'
          : 'tan⁻¹'
        : op
    } else {
      opDisplay = op
    }

    const exprInput = current.toString()
    const expr = `${opDisplay}(${exprInput})`
    const resultStr = String(roundedResult)

    setDisplay(String(roundedResult))
    setPreviousValue(roundedResult as number)
    setWaitingForOperand(true)
    setExpression(_prev => String(roundedResult))
    setAnsValue(String(roundedResult))
    onAddToHistory(expr, resultStr)
  }

  const handleToggleMode = () => {
    setAngleMode(prev => {
      const newMode = prev === 'deg' ? 'rad' : 'deg'
      return newMode
    })
  }

  const handleToggleInverse = () => {
    setIsInverse(prev => !prev)
  }

  return (
    <div className="calculator-container" onKeyDown={(e) => e.key === 'Backspace' && handleBackspace()}>
      <CalculatorDisplay
        display={display}
        expression={expression}
        onHistoryToggle={toggleHistory}
      />

      {historyOpen && (
        <div className="history-overlay open" onClick={toggleHistory}>
          <div className="history-overlay-content" onClick={e => e.stopPropagation()}>
            <button
              className="history-close-btn"
              onClick={toggleHistory}
              aria-label="Close history"
            >
              ✕
            </button>
            <h3>Calculation History</h3>
            {history.length === 0 ? (
              <p>No calculations yet</p>
            ) : (
              <div className="history-list">
                {history.map((record, _index) => (
                  <div
                    key={record.id}
                    className="history-item flex justify-between items-center px-3 py-2 text-sm"
                  >
                    <span className="flex-1 truncate">{record.expression}</span>
                    <span className="text-[--accent] font-medium">{record.result}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              className="history-clear"
              onClick={clearHistory}
              aria-label="Clear calculation history"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="calculator-buttons">
        {/* Mode controls row: DEG|RAD, INV, (, ), x! */}
        <CalculatorButton
          variant="mode-toggle"
          label={angleMode === 'deg' ? 'DEG' : 'RAD'}
          onClick={handleToggleMode}
          className={angleMode === 'deg' ? 'active' : ''}
          aria-label="Toggle DEG/RAD mode"
        />
        <CalculatorButton
          variant="function"
          label="INV"
          onClick={handleToggleInverse}
          aria-label="Toggle inverse mode"
        />
        <CalculatorButton variant="function" label="x!" onClick={() => handleScientific('x!')} />
        <CalculatorButton variant="function" label="(" onClick={() => handleScientific('(')} />
        <CalculatorButton variant="function" label=")" onClick={() => handleScientific(')')} />

        {/* Scientific functions Row 1: sin, cos, tan, ln */}
        <CalculatorButton
          variant="function"
          label={isInverse ? 'sin⁻¹' : 'sin'}
          onClick={() => handleScientific('sin')}
          aria-label={isInverse ? 'Compute inverse sine' : 'Compute sine'}
        />
        <CalculatorButton
          variant="function"
          label={isInverse ? 'cos⁻¹' : 'cos'}
          onClick={() => handleScientific('cos')}
          aria-label={isInverse ? 'Compute inverse cosine' : 'Compute cosine'}
        />
        <CalculatorButton
          variant="function"
          label={isInverse ? 'tan⁻¹' : 'tan'}
          onClick={() => handleScientific('tan')}
          aria-label={isInverse ? 'Compute inverse tangent' : 'Compute tangent'}
        />
        <CalculatorButton variant="function" label="ln" onClick={() => handleScientific('ln')} />

        {/* Scientific functions Row 2: log, √, π, e */}
        <CalculatorButton variant="function" label="log" onClick={() => handleScientific('log')} />
        <CalculatorButton variant="function" label="√" onClick={() => handleScientific('√')} />
        <CalculatorButton variant="function" label="π" onClick={() => handleScientific('π')} />
        <CalculatorButton variant="function" label="e" onClick={() => handleScientific('e')} />

        {/* Scientific functions Row 3: xʸ, EXP, Ans, Hist. */}
        <CalculatorButton variant="function" label="xʸ" onClick={() => handleScientific('xʸ')} />
        <CalculatorButton variant="function" label="EXP" onClick={() => handleScientific('EXP')} />
        <CalculatorButton variant="function" label="Ans" onClick={() => handleScientific('Ans')} />
        <CalculatorButton variant="history" label="Hist." onClick={toggleHistory} aria-label="Toggle calculation history" />

        {/* Standard calculator keypad Row 1: AC, DEL, %, ÷ */}
        <CalculatorButton variant="ac" label="AC" onClick={handleClear} />
        <CalculatorButton variant="function" label="DEL" onClick={handleBackspace} />
        <CalculatorButton variant="function" label="%" onClick={() => handleOperator('%')} />
        <CalculatorButton variant="operator" label="÷" onClick={() => handleOperator('÷')} />

        {/* Standard calculator keypad Row 2: 7, 8, 9, × */}
        <CalculatorButton variant="number" label="7" onClick={() => handleNumber('7')} />
        <CalculatorButton variant="number" label="8" onClick={() => handleNumber('8')} />
        <CalculatorButton variant="number" label="9" onClick={() => handleNumber('9')} />
        <CalculatorButton variant="operator" label="×" onClick={() => handleOperator('×')} />

        {/* Standard calculator keypad Row 3: 4, 5, 6, − */}
        <CalculatorButton variant="number" label="4" onClick={() => handleNumber('4')} />
        <CalculatorButton variant="number" label="5" onClick={() => handleNumber('5')} />
        <CalculatorButton variant="number" label="6" onClick={() => handleNumber('6')} />
        <CalculatorButton variant="operator" label="−" onClick={() => handleOperator('-')} />

        {/* Standard calculator keypad Row 4: 1, 2, 3, + */}
        <CalculatorButton variant="number" label="1" onClick={() => handleNumber('1')} />
        <CalculatorButton variant="number" label="2" onClick={() => handleNumber('2')} />
        <CalculatorButton variant="number" label="3" onClick={() => handleNumber('3')} />
        <CalculatorButton variant="operator" label="+" onClick={() => handleOperator('+')} />

        {/* Standard calculator keypad Row 5: Ans, 0, ., = */}
        <CalculatorButton variant="function" label="Ans" onClick={() => handleScientific('Ans')} />
        <CalculatorButton variant="number" label="0" onClick={() => handleNumber('0')} />
        <CalculatorButton variant="number" label="." onClick={handleDecimal} />
        <CalculatorButton variant="equals" label="=" onClick={handleEquals} />
      </div>
    </div>
  )
}

export default Calculator