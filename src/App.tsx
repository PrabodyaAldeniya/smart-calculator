import { useState } from 'react'
import Calculator from './components/Calculator'
import { CalculationHistory } from './components/CalculationHistory'
import type { CalculationRecord } from './types/calculator'

function App() {
  const [history, setHistory] = useState<CalculationRecord[]>([])

  const onClear = () => {
    setHistory([])
  }

  const onAddToHistory = (expression: string, result: string) => {
    setHistory(prev => [{ id: Date.now().toString(), expression, result, timestamp: Date.now() }, ...prev])
  }

  return (
    <div className="main-page">
      <Calculator
        initialDisplay="0"
        onClear={onClear}
        onAddToHistory={onAddToHistory}
      />
      <CalculationHistory
        records={history}
        onClear={onClear}
        onDeleteLast={() => {}}
      />
    </div>
  )
}

export default App