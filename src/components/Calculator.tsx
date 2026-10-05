import { useState } from 'react'
import { CalculatorDisplay } from './CalculatorDisplay'
import { CalculatorButton } from './CalculatorButton'
import type { Operator } from '../types/calculator'

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
  const [display, setDisplay] = useState<string>(
    initialDisplay ?? '0'
  )
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false)
  const [expression, setExpression] = useState<string>('0')

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
      setExpression(prev => prev === '0' ? digit : prev + ' ' + digit)
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
    onClear()
  }

  const handlePlusMinus = () => {
    if (display === 'Error') return
    const current = parseFloat(display)
    if (isNaN(current)) return
    setDisplay(String(-current))
    setExpression(prev => {
      const trimmed = prev.trim()
      if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
        return -current === Math.abs(current) ? `-${trimmed}` : trimmed.replace(/^-/, '')
      }
      const parts = trimmed.split(/[\s+\-×÷%]/)
      const lastNum = parts.pop()
      if (lastNum && /^-?\d+(?:\.\d+)?$/.test(lastNum)) {
        const newLast = -current === Math.abs(current) ? `-${lastNum}` : lastNum.replace(/^-/, '')
        parts.push(newLast)
        return parts.join(' ')
      }
      return prev
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

  const handleOperator = (op: string) => {
    const current = parseFloat(display)

    if (isNaN(current)) return

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
        case '%': result = previousValue % current; break
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
      setOperator(op as Operator)
      setWaitingForOperand(true)
      if (expression === '0') {
        setExpression(String(current) + ' ')
      } else {
        setExpression(prev => prev + op + ' ')
      }
    }
  }

  const handleEquals = () => {
    if (operator === null || waitingForOperand) return

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
      setDisplay(String(roundedResult))
      const exprStr = `${previousValue ?? 0} ${operator} ${current} = ${roundedResult}`
      onAddToHistory(exprStr, String(roundedResult))
    }

    setPreviousValue(roundedResult as number)
    setOperator(null)
    setWaitingForOperand(true)
    setExpression(String(roundedResult))
  }

  return (
    <div className="calculator-container">
      <CalculatorDisplay display={display} expression={expression} />

      <div className="calculator-buttons">
        <button
          className="calculator-history-btn w-full h-14 text-[--text]/60 mb-2 rounded-lg flex items-center justify-center"
          onClick={() => alert('History')}
          aria-label="View calculation history"
        >
          History
        </button>

        <div className="grid grid-cols-4 gap-2 mb-2">
          <CalculatorButton variant="function" label="AC" onClick={handleClear} />
          <CalculatorButton
            variant="function"
            label="+/-"
            onClick={handlePlusMinus}
          />
          <CalculatorButton variant="operator" label="%" onClick={() => handleOperator('%')} />
          <CalculatorButton variant="operator" label="÷" onClick={() => handleOperator('÷')} />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-2">
          <CalculatorButton variant="number" label="7" onClick={() => handleNumber('7')} />
          <CalculatorButton variant="number" label="8" onClick={() => handleNumber('8')} />
          <CalculatorButton variant="number" label="9" onClick={() => handleNumber('9')} />
          <CalculatorButton variant="operator" label="×" onClick={() => handleOperator('×')} />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-2">
          <CalculatorButton variant="number" label="4" onClick={() => handleNumber('4')} />
          <CalculatorButton variant="number" label="5" onClick={() => handleNumber('5')} />
          <CalculatorButton variant="number" label="6" onClick={() => handleNumber('6')} />
          <CalculatorButton variant="operator" label="−" onClick={() => handleOperator('-')} />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-2">
          <CalculatorButton variant="number" label="1" onClick={() => handleNumber('1')} />
          <CalculatorButton variant="number" label="2" onClick={() => handleNumber('2')} />
          <CalculatorButton variant="number" label="3" onClick={() => handleNumber('3')} />
          <CalculatorButton variant="operator" label="+" onClick={() => handleOperator('+')} />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <CalculatorButton
            variant="number"
            label="0"
            onClick={() => handleNumber('0')}
            span={2}
          />
          <CalculatorButton variant="operator" label="." onClick={handleDecimal} />
          <CalculatorButton variant="equals" label="=" onClick={handleEquals} />
        </div>
      </div>
    </div>
  )
}

export default Calculator