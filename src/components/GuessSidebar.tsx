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
  }, [AppState.guesses.length])

  const scoreColor = AppState.score > 1000
    ? 'text-green-400'
    : AppState.score > 500
      ? 'text-yellow-400'
      : 'text-red-400'

  const displayScore = useRollingNumber(AppState.score)

  return (
    <aside className="fixed bottom-0 right-0 h-[calc(100vh-4rem)] bg-black w-72 flex flex-col overflow-hidden z-50">

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

      <div className="px-4 pt-3 pb-2 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Guesses</h2>
      </div>

      {/* Scrollable guess list */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1 min-h-0">
        {AppState.guesses.length === 0 && (
          <p className="text-gray-600 text-xs italic">No guesses yet</p>
        )}
        {AppState.guesses.map((guess, i) => {
          const isCorrect = guess.toLowerCase() === AppState.activeManga?.title?.toLowerCase()
          return (
            <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${isCorrect ? 'bg-green-900/40' : 'bg-gray-800'}`}>
              <span className={`text-sm truncate ${isCorrect ? 'text-green-300' : 'text-gray-300'}`}>{guess}</span>
              {!AppState.gameOver && (
                <button
                  onClick={() => AppState.guesses.splice(i, 1)}
                  className="text-gray-600 hover:text-red-400 ml-2 text-xs shrink-0"
                  title="Remove guess"
                >
                  ✕
                </button>
              )}
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
            {input.trim() && (
              <p className="text-gray-500 text-xs mt-1 text-right">
                -{10 + input.trim().length} pts
              </p>
            )}
          </>
        )}
      </div>
    </aside>
  )
})

export default GuessSidebar
