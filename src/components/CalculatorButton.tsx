type ButtonVariant = 'number' | 'operator' | 'function' | 'equals'

type ButtonProps = {
  variant: ButtonVariant
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string
  span?: number
}

export const CalculatorButton = ({
  variant,
  label,
  onClick,
  disabled,
  className,
  span,
}: ButtonProps) => {
  const baseStyles = 'calculator-button flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantStyles = {
    number: 'bg-white dark:bg-[--bg] text-[--text] hover:bg-gray-100 dark:hover:bg-[--text-h]',
    operator: 'bg-[--accent] text-white hover:bg-[#c855ff] dark:hover:bg-[#d0a0ff]',
    function: 'bg-[--border] text-[--text] hover:bg-gray-100 dark:hover:bg-[--code-bg]',
    equals: 'bg-[--accent] text-white hover:bg-[#c855ff] dark:hover:bg-[#d0a0ff]',
  }

  const isDisabled = disabled === true

  const columnSpan = span !== undefined ? `grid-column: span ${span};` : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className || ''}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={label}
      style={{ gridColumn: columnSpan }}
    >
      {label}
    </button>
  )
}