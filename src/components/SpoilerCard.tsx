import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { AppState } from '../AppState'
import { renderSegments } from '../utils/renderSegments'

interface Row {
  label: string
  value: string
}

interface Props {
  title: string
  rows?: Row[]
  lines?: string[]
  penalty: number
  eventLabel: string
}

function scramble(text: string) {
  return text.replace(/[^\s]/g, '█')
}

function renderValue(text: string, isRevealed: boolean, guesses: string[]) {
  if (isRevealed) return <>{text}</>
  return renderSegments(text, guesses) ?? <span className="tracking-tighter">{scramble(text)}</span>
}

const SpoilerCard = observer(({ title, rows, lines, penalty, eventLabel }: Props) => {
  const [revealed, setRevealed] = useState(false)
  const isRevealed = revealed || AppState.revealAll

  function handleClick() {
    if (isRevealed) return
    AppState.deductPoints(penalty, eventLabel)
    setRevealed(true)
  }

  return (
    <div
      className="relative group bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 cursor-pointer select-none"
      onClick={handleClick}
    >
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{title}</p>
      {lines ? (
        <div className="space-y-0.5">
          {lines.filter(Boolean).map((line, i) => (
            <p key={i} className={`text-sm font-medium text-gray-800 dark:text-gray-100 ${!isRevealed ? 'tracking-tighter' : ''}`}>
              {renderValue(line, isRevealed, AppState.guesses)}
            </p>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {(rows ?? []).filter(r => r.value).map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-2 text-sm">
              <span className="text-gray-400 shrink-0">{label}</span>
              <span className={`font-medium text-gray-800 dark:text-gray-100 text-right ${!isRevealed ? 'tracking-tighter' : ''}`}>
                {renderValue(value, isRevealed, AppState.guesses)}
              </span>
            </div>
          ))}
        </div>
      )}
      {!isRevealed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg z-10">
          <span className="bg-gray-900 border border-gray-700 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
            -{penalty} pts
          </span>
        </div>
      )}
    </div>
  )
})

export default SpoilerCard
