import { useState } from 'react'
import { observer } from "mobx-react-lite";
import type { Character } from "../Models/Character";
import { AppState } from '../AppState';
import { renderSegments } from '../utils/renderSegments';

const PLACEHOLDER = 'https://placehold.co/300x400?text=No+Image'

const CharacterCard = observer(({character, penalty = 0, label}: {character: Character, penalty?: number, label?: string})=>{
  const [revealed, setRevealed] = useState(false)
  const isRevealed = revealed || AppState.revealAll

  function handleClick() {
    if (isRevealed) return
    AppState.deductPoints(penalty, label)
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
          {isRevealed ? character.name : renderSegments(character.name, AppState.guesses)}
        </p>
        {character.altName && (
          <p className="text-gray-400 text-xs truncate mt-0.5">
            {isRevealed ? character.altName : renderSegments(character.altName, AppState.guesses)}
          </p>
        )}
      </div>
    </section>
  )
})

export default CharacterCard