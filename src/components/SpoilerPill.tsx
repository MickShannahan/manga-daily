import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { AppState } from '../AppState'

interface Props {
  label: string
  className?: string
  penalty?: number
}

const SpoilerPill = observer(({ label, className = '', penalty = 0 }: Props) => {
  const [revealed, setRevealed] = useState(false)
  const isRevealed = revealed || AppState.revealAll

  const isGuessed = !isRevealed && AppState.guesses.some(
    g => label?.toLowerCase().includes(g.toLowerCase())
  )

  const scrambled = label?.replace(/[^\s]/g, '█') ?? '████'

  function handleClick() {
    if (isRevealed || isGuessed) return
    AppState.deductPoints(penalty)
    setRevealed(true)
  }

  const costLabel = `-${penalty} pts`

  return (
    <span className="relative group inline-block" onClick={handleClick}>
      <span
        className={`cursor-pointer select-none text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200 ${className} ${
          !isRevealed && !isGuessed ? 'opacity-50' : ''
        }`}
      >
        {isRevealed || isGuessed ? label : <span className="tracking-tighter">{scrambled}</span>}
      </span>
      {!isRevealed && !isGuessed && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 z-10">
          <span className="text-yellow-400 text-xs font-bold">
            {costLabel}
          </span>
        </span>
      )}
    </span>
  )
})

export default SpoilerPill

