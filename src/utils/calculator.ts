import type { Operator, CalculationRecord, AngleMode } from '../types/calculator'

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
  mode: AngleMode
  history: CalculationRecord[]
}

// Initial calculator state
export const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  mode: 'deg',
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

// Convert degrees to radians
export const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180
}

// Convert radians to degrees
export const toDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI
}

// Calculate inverse trigonometric functions with range validation
// Returns result in the appropriate unit based on angleMode
export const calculateInverseTrig = (
  op: 'asin' | 'acos' | 'atan',
  value: number,
  angleMode: AngleMode
): number => {
  let result: number

  // Validate input range for asin and acos
  if (op === 'asin' || op === 'acos') {
    if (value < -1 || value > 1) {
      // Return NaN-safe value - will be handled by caller to show Error
      return NaN
    }
  }

  switch (op) {
    case 'asin':
      result = Math.asin(value)
      break
    case 'acos':
      result = Math.acos(value)
      break
    case 'atan':
      result = Math.atan(value)
      break
  }

  // Convert to degrees if angleMode is 'deg', otherwise return radians
  if (angleMode === 'deg') {
    return result * 180 / Math.PI
  }
  return result
}

// Toggle DEG/RAD mode
export const toggleMode = (state: CalculatorState): CalculatorState => ({
  ...state,
  mode: state.mode === 'deg' ? 'rad' : 'deg',
})