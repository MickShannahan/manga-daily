import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { AppState } from '../AppState'
import { renderSegments } from '../utils/renderSegments'

interface Props {
  text: string
  className?: string
  penalty?: number
  isGiveUp?: boolean
  block?: boolean
  label?: string
}

const SpoilerText = observer(({ text, className = '', penalty = 0, isGiveUp = false, block = false, label: revealLabel }: Props) => {
  const [revealed, setRevealed] = useState(false)
  const isRevealed = revealed || AppState.revealAll

  function handleClick() {
    if (isRevealed) return
    if (isGiveUp) {
      AppState.giveUp()
    } else {
      AppState.deductPoints(penalty, revealLabel)
    }
    setRevealed(true)
  }

  const label = isGiveUp ? 'Reveal Answer' : `-${penalty} pts`
  const Wrapper = block ? 'div' : 'span'

  return (
    <Wrapper className={`relative group ${block ? 'block w-full' : 'inline'}`} onClick={handleClick}>
      <span
        className={`${className} transition-all duration-300 ${
          !isRevealed ? 'cursor-pointer select-none text-gray-800 dark:text-gray-200' : ''
        }`}
      >
        {isRevealed ? text : renderSegments(text, AppState.guesses)}
      </span>
      {!isRevealed && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded z-10">
          <span className="bg-gray-900 border border-gray-700 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
            {label}
          </span>
        </span>
      )}
    </Wrapper>
  )
})

export default SpoilerText

