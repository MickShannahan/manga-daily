import { DailyScore } from "../Models/DailyScore"

interface Props {
  score: DailyScore
}

function getScoreTier(score: number) {
  if (score >= 1200) return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/40', grade: 'S' }
  if (score >= 800)  return { text: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/40',    grade: 'A' }
  if (score >= 400)  return { text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/40',   grade: 'B' }
  return               { text: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/40',     grade: 'C' }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function DailyScoreCard({ score }: Props) {
  const tier = getScoreTier(score.score)

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">

      {/* Date header */}
      <div className="px-5 py-2.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          {formatDate(score.date)}
        </span>
      </div>

      {/* Card body */}
      <div className="flex items-center gap-4 p-5">

        {/* Manga cover */}
        <div className="shrink-0 w-14 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700">
          {score.manga.image ? (
            <img
              src={score.manga.image}
              alt={score.manga.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-600 text-xl select-none">
              📕
            </div>
          )}
        </div>

        {/* Manga info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-900 dark:text-white text-base leading-snug truncate">
            {score.manga.title || '—'}
          </h3>
          {score.manga.japanTitle && (
            <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-0.5 truncate font-medium">
              {score.manga.japanTitle}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-1">
              {score.guesses.length} {score.guesses.length === 1 ? 'guess' : 'guesses'}
            </span>
            {score.guesses.slice(0, 4).map((g, i) => (
              <span
                key={i}
                className="inline-block text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 max-w-22.5 truncate"
              >
                {g}
              </span>
            ))}
            {score.guesses.length > 4 && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                +{score.guesses.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Score badge */}
        <div className={`shrink-0 flex flex-col items-center justify-center w-18 h-18 rounded-xl ${tier.bg} border ${tier.border}`}>
          <span className={`text-2xl font-black leading-none ${tier.text}`}>{tier.grade}</span>
          <span className={`text-sm font-bold mt-0.5 ${tier.text}`}>{score.score}</span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wide">pts</span>
        </div>

      </div>
    </div>
  )
}
