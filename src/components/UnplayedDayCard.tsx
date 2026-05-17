import { useNavigate } from 'react-router'
import { isToday, parseDateKey } from '../utils/dateUtils'

interface Props {
  dateKey: string
}

function shortDate(dateKey: string) {
  const date = new Date(dateKey + 'T12:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function UnplayedDayCard({ dateKey }: Props) {
  const navigate = useNavigate()
  const today = isToday(parseDateKey(dateKey))

  return (
    <button
      onClick={() => navigate(`/play/${dateKey}`)}
      className={`relative aspect-[2/3] rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-200 ${
        today
          ? 'bg-indigo-950 ring-2 ring-indigo-400/70'
          : 'bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700'
      }`}
    >
      {/* Top: date + today badge */}
      <div className="absolute top-0 inset-x-0 flex items-start justify-between px-1.5 pt-1.5">
        <span className={`text-[10px] font-bold leading-none ${
          today ? 'text-indigo-300' : 'text-zinc-400 dark:text-zinc-500'
        }`}>
          {shortDate(dateKey)}
        </span>
        {today && (
          <span className="text-[9px] font-black px-1 py-0.5 rounded bg-indigo-500/80 text-white leading-none">
            TODAY
          </span>
        )}
      </div>

      {/* Center: mystery mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-3xl font-black select-none ${
          today ? 'text-indigo-400/60' : 'text-zinc-300 dark:text-zinc-600'
        }`}>?</span>
      </div>

      {/* Bottom: play label */}
      <div className="absolute bottom-0 inset-x-0 px-2 pb-2">
        <span className={`text-[11px] font-bold ${
          today ? 'text-indigo-300' : 'text-zinc-400 dark:text-zinc-500'
        }`}>
          {today ? 'Play Today' : 'Play'}
        </span>
      </div>
    </button>
  )
}
