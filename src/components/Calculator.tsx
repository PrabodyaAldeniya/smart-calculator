import { useState } from 'react'
import { CalculatorDisplay } from './CalculatorDisplay'
import { CalculatorButton } from './CalculatorButton'

type CalculatorProps = {
  initialDisplay?: string
}

const Calculator = ({ initialDisplay }: CalculatorProps = { initialDisplay: undefined }) => {
  const [display, setDisplay] = useState<string>(
    initialDisplay ?? '0'
  )
  const [history, setHistory] = useState<
    Array<{ id: string; expression: string; result: string; timestamp: number }>
  >([])

  const handleNumber = (digit: string) => {
    if (display === 'Error') {
      setDisplay('0')
    }
    setDisplay(prev => {
      if (prev === '0') return digit
      return prev + digit
    })
  }

  const handleClear = () => {
    setDisplay('0')
    setHistory([])
  }

  const handleBackspace = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')
  }

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(prev => prev + '.')
    }
  }

  const handleEquals = () => {
    setDisplay('0')
  }

  const handleOperator = (_op: string) => {
    // Full calculation logic will be added later
    setDisplay('0')
  }

  return (
    <div className="calculator-container">
      <CalculatorDisplay display={display} history={history} />

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
            onClick={handleBackspace}
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