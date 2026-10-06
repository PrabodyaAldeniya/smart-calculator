export type Operator =
  | '+'
  | '-'
  | '×'
  | '÷'
  | '%'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'asin'
  | 'acos'
  | 'atan'
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

export type AngleMode = 'deg' | 'rad'

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