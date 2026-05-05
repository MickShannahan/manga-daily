import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { AppState } from '../AppState'

interface Props {
  src: string
  alt: string
  className?: string
  isGiveUp?: boolean
}

const SpoilerImage = observer(({ src, alt, className = '', isGiveUp = false }: Props) => {
  const [revealed, setRevealed] = useState(false)
  const isRevealed = revealed || AppState.revealAll

  function handleClick() {
    if (isRevealed) return
    if (isGiveUp) AppState.giveUp()
    setRevealed(true)
  }

  return (
    <div
      className={`relative group cursor-pointer shrink-0 overflow-hidden ${className}`}
      onClick={handleClick}
      title={!isRevealed ? (isGiveUp ? 'Reveal Answer — score resets to 0' : 'Click to reveal') : undefined}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${!isRevealed ? 'blur-3xl scale-110' : ''}`}
      />
      {!isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/60 transition-colors duration-200">
          <span className="bg-gray-900/80 border border-gray-700 text-yellow-400 text-sm font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isGiveUp ? 'Reveal Answer' : 'Click to reveal'}
          </span>
        </div>
      )}
    </div>
  )
})

export default SpoilerImage
