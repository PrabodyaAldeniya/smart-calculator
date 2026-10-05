import type { Operator, CalculationRecord } from '../types/calculator'

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

// Calculator state managed by TypeScript types
export interface CalculatorState {
  display: DisplayValue
  previousValue: number | null
  operator: Operator | null
  waitingForOperand: boolean
  history: CalculationRecord[]
}

// Initial calculator state
export const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  history: [],
}

// Reducer function to handle calculator actions
export const calculatorReducer = (
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState => {
  switch (action.type) {
    case 'INPUT_NUMBER': {
      const { digit } = action
      if (state.waitingForOperand) {
        return {
          ...state,
          display: digit,
          waitingForOperand: false,
        }
      }

      const currentDisplay = state.display === '0' ? '' : state.display
      const newDisplay = currentDisplay + digit

      // Prevent display from being too long
      if (newDisplay.length > 15) {
        return state
      }

      return {
        ...state,
        display: newDisplay === '' ? '0' : newDisplay,
      }
    }

    case 'INPUT_OPERATOR': {
      const { operator } = action
      const current = parseFloat(state.display)

      if (isNaN(current)) {
        return state
      }

      const { previousValue, operator: currentOperator } = state

      // If there's a pending operator, calculate first
      if (previousValue !== null && currentOperator) {
        const calculated = applyOperator(state, currentOperator)
        return calculatorReducer(calculated, { type: 'INPUT_OPERATOR', operator })
      }

      return {
        ...state,
        previousValue: current,
        operator: operator,
        waitingForOperand: true,
      }
    }

    case 'INPUT_EQUALS': {
      return applyOperator(state, state.operator ?? null)
    }

    case 'INPUT_CLEAR': {
      return initialState
    }

    case 'INPUT_BACKSPACE': {
      if (state.display.length <= 1) {
        return { ...state, display: '0' }
      }

      const newDisplay = state.display.slice(0, -1)
      return {
        ...state,
        display: newDisplay === '' ? '0' : newDisplay,
      }
    }

    case 'INPUT_DECIMAL': {
      if (state.waitingForOperand) {
        return {
          ...state,
          display: '0.',
          waitingForOperand: false,
        }
      }

      if (!state.display.includes('.')) {
        return {
          ...state,
          display: state.display + '.',
        }
      }

      return state
    }

    default:
      return state
  }
}

// Apply a single operator to the current state
const applyOperator = (state: CalculatorState, operator: Operator | null): CalculatorState => {
  if (!operator || state.waitingForOperand) {
    return state
  }

  const current = parseFloat(state.display)
  if (isNaN(current)) {
    return { ...state, display: 'Error' }
  }

  const { previousValue } = state

  let result: number

  switch (operator) {
    case '+':
      result = (previousValue ?? 0) + current
      break
    case '-':
      result = (previousValue ?? 0) - current
      break
    case '×':
      result = (previousValue ?? 0) * current
      break
    case '÷':
      if (current === 0) {
        return { ...state, display: 'Error' }
      }
      result = (previousValue ?? 0) / current
      break
    case '%':
      result = (previousValue ?? 0) % current
      break
    default:
      return state
  }

  // Check for overflow/infinity
  if (!isFinite(result)) {
    return { ...state, display: 'Error' }
  }

  // Round to reasonable precision
  const roundedResult = Math.round(result * 1000000) / 1000000

  return {
    display: String(roundedResult),
    previousValue: roundedResult,
    operator: null,
    waitingForOperand: true,
    history: state.history,
  }
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