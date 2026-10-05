export type Operator = '+' | '-' | '×' | '÷' | '%'

export interface CalculationRecord {
  id: string
  expression: string
  result: string
  timestamp: number
}

export interface CalculatorHistory {
  records: CalculationRecord[]
  addRecord: (expression: string, result: string) => void
  clearRecords: () => void
  deleteLastRecord: () => void
}