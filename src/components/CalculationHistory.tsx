import type { CalculationRecord } from '../types/calculator'

type HistoryItemProps = {
  record: CalculationRecord
  onDelete: () => void
}

type HistoryProps = {
  records: CalculationRecord[]
  onClear: () => void
  onDeleteLast: () => void
}

export const HistoryItem = ({ record }: HistoryItemProps) => {
  return (
    <div className="history-item flex justify-between items-center px-3 py-2 text-sm text-[--text-h]/60">
      <span className="flex-1 truncate">{record.expression}</span>
      <span className="text-[--accent] font-medium">{record.result}</span>
    </div>
  )
}

export const CalculationHistory = ({
  records,
  onClear,
  onDeleteLast,
}: HistoryProps) => {
  return (
    <div className="calculation-history">
      {records.length === 0 && (
        <p className="text-[--text-h]/60 text-center py-2">
          No calculations yet
        </p>
      )}
      <div className="history-list">
        {records.map((record, _index) => (
          <HistoryItem
            key={record.id}
            record={record}
            onDelete={() => onDeleteLast()}
          />
        ))}
      </div>
      <button
        className="history-clear text-[--accent]/60 text-sm hover:text-[--accent] mt-2"
        onClick={onClear}
        aria-label="Clear calculation history"
      >
        Clear All
      </button>
    </div>
  )
}