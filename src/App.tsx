import { useState } from 'react'
import Calculator from './components/Calculator'
import type { CalculationRecord } from './types/calculator'

function App() {
  const [history, setHistory] = useState<CalculationRecord[]>([])
  const [historyOpen, setHistoryOpen] = useState<boolean>(false)

  const onAddToHistory = (expression: string, result: string) => {
    setHistory(prev => {
      const newRecord: CalculationRecord = {
        id: Date.now().toString(),
        expression,
        result,
        timestamp: Date.now(),
      }
      if (prev.length > 0 && prev[0].expression === expression && prev[0].result === result) {
        return prev
      }
      return [newRecord, ...prev]
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  const toggleHistory = () => {
    setHistoryOpen(prev => !prev)
  }

  return (
    <div className="main-page">
      <Calculator
        initialDisplay="0"
        onAddToHistory={onAddToHistory}
        toggleHistory={toggleHistory}
        clearHistory={clearHistory}
        historyOpen={historyOpen}
        history={history}
      />
    </div>
  )
}

export default App