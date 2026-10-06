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
  const baseStyles =
    'calculator-button rounded-md h-14 flex items-center justify-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]'

  const variantStyles = {
    number:
      'bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--code-bg)] dark:hover:bg-[--bg]',
    operator:
      'bg-[var(--accent)] text-white hover:bg-[#c855ff] dark:hover:bg-[#d0a0ff]',
    function:
      'bg-[var(--border)] text-[var(--text)] hover:bg-[var(--code-bg)] dark:hover:bg-[--code-bg]',
    equals:
      'bg-[var(--accent)] text-white hover:bg-[#c855ff] dark:hover:bg-[#d0a0ff]',
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