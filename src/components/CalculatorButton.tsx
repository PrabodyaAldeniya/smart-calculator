type ButtonVariant = 'number' | 'operator' | 'function' | 'equals' | 'mode-toggle' | 'ac' | 'history'

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
    'calculator-button rounded-md flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]'

  const variantStyles = {
    number:
      'bg-[var(--bg)] text-[var(--text)]',
    operator:
      'bg-[var(--accent)] text-white',
    function:
      'bg-[var(--border)] text-[var(--text)]',
    equals:
      'bg-[var(--accent)] text-white',
    'mode-toggle':
      'bg-[var(--border)] text-[var(--text)]',
    ac:
      'bg-[var(--card-bg)] text-[var(--accent)]',
    history:
      'transparent text-[var(--text-h)/60]',
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