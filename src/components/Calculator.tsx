import { useState } from 'react'
import { CalculatorDisplay } from './CalculatorDisplay'
import { CalculatorButton } from './CalculatorButton'
import type { Operator, CalculatorMode } from '../types/calculator'

type CalculatorProps = {
  initialDisplay?: string
  onClear: () => void
  onAddToHistory: (expression: string, result: string) => void
}

const Calculator = ({
  initialDisplay,
  onClear,
  onAddToHistory,
}: CalculatorProps) => {
  const [display, setDisplay] = useState<string>(initialDisplay ?? '0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false)
  const [expression, setExpression] = useState<string>('0')
  const [mode, setMode] = useState<CalculatorMode>('DEG')
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
    setAnsValue(null)
    onClear()
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
      // Percentage: convert current value to percentage (divide by 100)
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
      // Build the expression string for history and small display
      const exprForSmall = `${previousValue ?? 0} ${operator} ${current}`
      const exprForHistory = `${exprForSmall} = ${roundedResult}`
      setDisplay(String(roundedResult))
      onAddToHistory(exprForHistory, String(roundedResult))
      // Preserve the original expression for small display
      setExpression(exprForSmall)
    }

    // For chained calculations: previousValue holds the result,
    // so the next operator can use it as the first operand
    setPreviousValue(roundedResult as number)
    setOperator(null)
    setWaitingForOperand(true)
    setAnsValue(String(roundedResult))
  }

  const handleScientific = (op: Operator) => {
    // For unary scientific functions, apply immediately to display
    const current = parseFloat(display)

    if (isNaN(current)) return

    let result: number

    switch (op) {
      case 'sin': {
        const radians = mode === 'DEG' ? (current * Math.PI) / 180 : current
        result = Math.sin(radians)
        break
      }
      case 'cos': {
        const radians = mode === 'DEG' ? (current * Math.PI) / 180 : current
        result = Math.cos(radians)
        break
      }
      case 'tan': {
        const radians = mode === 'DEG' ? (current * Math.PI) / 180 : current
        result = Math.tan(radians)
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
        result = parseFloat(ansValue)
        break
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

    setDisplay(String(roundedResult))
    setPreviousValue(roundedResult as number)
    setWaitingForOperand(true)
    // Update expression to show the function was applied
    if (['sin', 'cos', 'tan', 'ln', 'log', '√', 'x!'].includes(op)) {
      setExpression(_prev => String(roundedResult))
    }
  }

  const handleToggleMode = () => {
    setMode(prev => {
      const newMode = prev === 'DEG' ? 'RAD' : 'DEG'
      return newMode
    })
  }

  return (
    <div className="calculator-container">
      <CalculatorDisplay display={display} expression={expression} />

      <div className="calculator-buttons">
        {/* Top controls row: Deg Rad, x!, (, ), %, AC */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          <CalculatorButton
            variant="function"
            label="Deg"
            onClick={handleToggleMode}
            className={mode === 'DEG' ? 'active' : ''}
            aria-label="Toggle DEG mode"
          />
          <CalculatorButton
            variant="function"
            label="Rad"
            onClick={handleToggleMode}
            className={mode === 'RAD' ? 'active' : ''}
            aria-label="Toggle RAD mode"
          />
          <CalculatorButton variant="function" label="x!" onClick={() => handleScientific('x!')} />
          <CalculatorButton variant="function" label="(" onClick={() => handleScientific('(')} />
          <CalculatorButton variant="function" label=")" onClick={() => handleScientific(')')} />
          <CalculatorButton variant="function" label="%" onClick={() => handleOperator('%')} />
          <CalculatorButton variant="function" label="AC" onClick={handleClear} />
        </div>

        {/* Row 2: Inv, sin, ln, 7, 8, 9, ÷ */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          <CalculatorButton variant="function" label="Inv" onClick={() => handleScientific('Inv')} />
          <CalculatorButton variant="function" label="sin" onClick={() => handleScientific('sin')} />
          <CalculatorButton variant="function" label="ln" onClick={() => handleScientific('ln')} />
          <CalculatorButton variant="number" label="7" onClick={() => handleNumber('7')} />
          <CalculatorButton variant="number" label="8" onClick={() => handleNumber('8')} />
          <CalculatorButton variant="number" label="9" onClick={() => handleNumber('9')} />
          <CalculatorButton variant="operator" label="÷" onClick={() => handleOperator('÷')} />
        </div>

        {/* Row 3: π, cos, log, 4, 5, 6, × */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          <CalculatorButton variant="function" label="π" onClick={() => handleScientific('π')} />
          <CalculatorButton variant="function" label="cos" onClick={() => handleScientific('cos')} />
          <CalculatorButton variant="function" label="log" onClick={() => handleScientific('log')} />
          <CalculatorButton variant="number" label="4" onClick={() => handleNumber('4')} />
          <CalculatorButton variant="number" label="5" onClick={() => handleNumber('5')} />
          <CalculatorButton variant="number" label="6" onClick={() => handleNumber('6')} />
          <CalculatorButton variant="operator" label="×" onClick={() => handleOperator('×')} />
        </div>

        {/* Row 4: e, tan, √, 1, 2, 3, − */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          <CalculatorButton variant="function" label="e" onClick={() => handleScientific('e')} />
          <CalculatorButton variant="function" label="tan" onClick={() => handleScientific('tan')} />
          <CalculatorButton variant="function" label="√" onClick={() => handleScientific('√')} />
          <CalculatorButton variant="number" label="1" onClick={() => handleNumber('1')} />
          <CalculatorButton variant="number" label="2" onClick={() => handleNumber('2')} />
          <CalculatorButton variant="number" label="3" onClick={() => handleNumber('3')} />
          <CalculatorButton variant="operator" label="−" onClick={() => handleOperator('-')} />
        </div>

        {/* Row 5: Ans, EXP, xʸ, 0, ., =, + */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          <CalculatorButton variant="function" label="Ans" onClick={() => handleScientific('Ans')} />
          <CalculatorButton variant="function" label="EXP" onClick={() => handleScientific('EXP')} />
          <CalculatorButton variant="function" label="xʸ" onClick={() => handleScientific('xʸ')} />
          <CalculatorButton variant="number" label="0" onClick={() => handleNumber('0')} />
          <CalculatorButton variant="operator" label="." onClick={handleDecimal} />
          <CalculatorButton variant="equals" label="=" onClick={handleEquals} />
          <CalculatorButton variant="operator" label="+" onClick={() => handleOperator('+')} />
        </div>
      </div>
    </div>
  )
}

export default Calculator