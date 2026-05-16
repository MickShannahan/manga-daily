import { useNavigate } from 'react-router'
import { isToday, parseDateKey } from '../utils/dateUtils'

interface Props {
  dateKey: string
}

function formatDate(dateKey: string) {
  const date = new Date(dateKey + 'T12:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function UnplayedDayCard({ dateKey }: Props) {
  const navigate = useNavigate()
  const today = isToday(parseDateKey(dateKey))

  return (
    <div className={`bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm overflow-hidden ${today ? 'border-indigo-400/60 dark:border-indigo-500/40 ring-1 ring-indigo-400/30' : 'border-zinc-200 dark:border-zinc-800'}`}>

      {/* Date header */}
      <div className="px-5 py-2.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          {formatDate(dateKey)}
        </span>
        {today && (
          <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
            Today
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex items-center gap-4 p-5">

        {/* Anonymous cover placeholder */}
        <div className="shrink-0 w-14 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700 flex items-center justify-center">
          <span className="text-2xl text-zinc-300 dark:text-zinc-600 select-none">?</span>
        </div>

        {/* Anonymous info */}
        <div className="flex-1 min-w-0">
          <div className="h-4 w-32 rounded bg-zinc-100 dark:bg-zinc-800 mb-2" />
          <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-800 mb-4" />
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Not yet played</p>
        </div>

        {/* Play button */}
        <button
          onClick={() => navigate(`/play/${dateKey}`)}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
            today
              ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          {today ? "Play Today's Game" : 'Play'}
        </button>

      </div>
    </div>
  )
}
