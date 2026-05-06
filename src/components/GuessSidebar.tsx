import { observer } from 'mobx-react-lite'
import { useState, useRef, useEffect } from 'react'
import { AppState } from '../AppState'
import { useRollingNumber } from '../utils/useRollingNumber'

const GuessSidebar = observer(() => {
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    const trimmed = input.trim()
    if (!trimmed) return
    AppState.submitGuess(trimmed)
    setInput('')
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  })

  const scoreColor = AppState.score > 1000
    ? 'text-green-400'
    : AppState.score > 500
      ? 'text-yellow-400'
      : 'text-red-400'

  const displayScore = useRollingNumber(AppState.score)

  return (
    <aside className="bg-black w-full flex flex-col overflow-hidden z-40 h-96 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16">

      {/* Score */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-700">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Daily Score</p>
        <p className={`text-3xl font-bold tabular-nums ${scoreColor}`}>
          {displayScore.toLocaleString()}
        </p>
        {AppState.gameOver && (
          <p className="text-xs mt-1 font-semibold text-indigo-400">
            {AppState.score === 0 && AppState.revealAll ? '💀 Gave up' : '🎉 Correct! Score locked in.'}
          </p>
        )}
      </div>


      {/* Scrollable event list */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1 min-h-0">
        {AppState.events.length === 0 && (
          <p className="text-gray-600 text-xs italic">No activity yet</p>
        )}
        {AppState.events.map((event, i) => {
          if (event.type === 'guess') {
            return (
              <div key={i} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${event.correct ? 'bg-green-900/40' : 'bg-gray-900'}`}>
                <span className={`text-[10px] font-bold uppercase shrink-0 pe-1.5 mt-1  rounded ${event.correct ? 'bg-green-700 text-green-100' : ' text-indigo-400'}`}>
                  Guess
                </span>
                <span className={`text-sm truncate ${event.correct ? 'text-green-300' : 'text-gray-300'}`}>{event.text}</span>
                {event.correct && <span className="text-green-400 text-xs ml-auto shrink-0">✓</span>}
              </div>
            )
          }
          return (
            <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-gray-900">
              <span className="text-[10px] font-bold uppercase shrink-0 pe-1.5 mt-1 rounded  text-amber-300">
                Reveal
              </span>
              <span className="text-sm truncate text-gray-300">{event.label}</span>
              <span className="text-red-400 text-xs ml-auto shrink-0 tabular-nums">-{event.cost}</span>
            </div>
          )
        })}
      </div>

      {/* Input pinned to bottom */}
      <div className="px-3 pb-3 pt-2 border-t border-gray-700">
        {AppState.gameOver ? (
          <p className="text-gray-600 text-xs italic text-center py-1">Game over</p>
        ) : (
          <>
            <p className="text-gray-600 text-xs mb-1.5">
              Cost: 10 + 1 per character
            </p>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a guess + Enter"
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-600"
            />
          </>
        )}
      </div>
    </aside>
  )
})

export default GuessSidebar
