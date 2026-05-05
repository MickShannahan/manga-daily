import { useState } from 'react'
import { observer } from "mobx-react-lite";
import type { Character } from "../Models/Character";
import { AppState } from '../AppState';

const PLACEHOLDER = 'https://placehold.co/300x400?text=No+Image'

function scrambleWithGuesses(text: string, guesses: string[]) {
  if (!text) return null
  if (!guesses.length) return <span className="tracking-tighter">{text.replace(/[^\s]/g, '█')}</span>
  const escaped = guesses.map(g => g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = text.split(pattern)
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = guesses.some(g => part.toLowerCase() === g.toLowerCase())
        return isMatch
          ? <span key={i}>{part}</span>
          : <span key={i} className="tracking-tighter">{part.replace(/[^\s]/g, '█')}</span>
      })}
    </>
  )
}

const CharacterCard = observer(({character, penalty = 0}: {character: Character, penalty?: number})=>{
  const [revealed, setRevealed] = useState(false)
  const isRevealed = revealed || AppState.revealAll

  function handleClick() {
    if (isRevealed) return
    AppState.deductPoints(penalty)
    setRevealed(true)
  }

  return(
    <section
      className="w-[19%] rounded-xl overflow-hidden bg-gray-900 shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-transform duration-200 cursor-pointer group"
      onClick={handleClick}
      title={!isRevealed ? `Click to reveal (-${penalty} pts)` : undefined}
    >
      <div className="relative">
        <img
          src={character.image || PLACEHOLDER}
          alt={character.name}
          className={`w-full h-[240px] object-cover object-top bg-mauve-50 transition-all duration-500 ${!isRevealed ? 'blur-xl scale-105' : ''}`}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER }}
        />
        {!isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/60 transition-colors duration-200">
            <span className="bg-gray-900/80 border border-gray-700 text-yellow-400 text-sm font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              -{penalty} pts
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-white font-semibold text-sm truncate">
          {isRevealed ? character.name : scrambleWithGuesses(character.name, AppState.guesses)}
        </p>
        {character.altName && (
          <p className="text-gray-400 text-xs truncate mt-0.5">
            {isRevealed ? character.altName : scrambleWithGuesses(character.altName, AppState.guesses)}
          </p>
        )}
      </div>
    </section>
  )
})

export default CharacterCard