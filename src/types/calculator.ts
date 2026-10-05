export type Operator =
  | '+'
  | '-'
  | '×'
  | '÷'
  | '%'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'ln'
  | 'log'
  | '√'
  | 'x!'
  | 'xʸ'
  | 'π'
  | 'e'
  | '('
  | ')'
  | 'Ans'
  | 'EXP'
  | 'Inv'

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

export type CalculatorMode = 'DEG' | 'RAD'