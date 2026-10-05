import type { Operator, CalculationRecord, CalculatorMode } from '../types/calculator'

// Calculator display state
export type DisplayValue = string

// Calculator input actions
export type CalculatorAction =
  | { type: 'INPUT_NUMBER'; digit: string }
  | { type: 'INPUT_OPERATOR'; operator: Operator }
  | { type: 'INPUT_EQUALS' }
  | { type: 'INPUT_CLEAR' }
  | { type: 'INPUT_BACKSPACE' }
  | { type: 'INPUT_DECIMAL' }
  | { type: 'INPUT_SIN' }
  | { type: 'INPUT_COS' }
  | { type: 'INPUT_TAN' }
  | { type: 'INPUT_LN' }
  | { type: 'INPUT_LOG' }
  | { type: 'INPUT_SQRT' }
  | { type: 'INPUT_FACT' }
  | { type: 'INPUT_POWER' }
  | { type: 'INPUT_PI' }
  | { type: 'INPUT_E' }
  | { type: 'INPUT_LPAREN' }
  | { type: 'INPUT_RPAREN' }
  | { type: 'INPUT_INV' }
  | { type: 'INPUT_EXP' }
  | { type: 'INPUT_TOGGLE_MODE' }

// Calculator state managed by TypeScript types
export interface CalculatorState {
  display: DisplayValue
  previousValue: number | null
  operator: Operator | null
  waitingForOperand: boolean
  mode: CalculatorMode
  history: CalculationRecord[]
}

// Initial calculator state
export const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  mode: 'DEG',
  history: [],
}

// Add a calculation record to history
export const addToHistory = (
  state: CalculatorState,
  expression: string,
  result: string,
): CalculatorState => ({
  ...state,
  history: [
    ...state.history,
    {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: Date.now(),
    },
  ],
})

// Clear all history records
export const clearHistory = (state: CalculatorState): CalculatorState => ({
  ...state,
  history: [],
})

// Delete last history record
export const deleteLastHistoryRecord = (state: CalculatorState): CalculatorState => ({
  ...state,
  history: state.history.slice(0, -1),
})

// Get history records count
export const getHistoryCount = (state: CalculatorState): number => state.history.length

// Toggle DEG/RAD mode
export const toggleMode = (state: CalculatorState): CalculatorState => ({
  ...state,
  mode: state.mode === 'DEG' ? 'RAD' : 'DEG',
})