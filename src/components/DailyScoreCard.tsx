import { useNavigate } from "react-router"
import { DailyScore } from "../Models/DailyScore"

interface Props {
  score: DailyScore
}

function getScoreTier(score: number) {
  if (score >= 1200) return { text: 'text-emerald-400', bg: 'bg-emerald-500/80', border: 'border-emerald-400/60', grade: 'S' }
  if (score >= 800)  return { text: 'text-blue-400',    bg: 'bg-blue-500/80',    border: 'border-blue-400/60',    grade: 'A' }
  if (score >= 400)  return { text: 'text-amber-400',   bg: 'bg-amber-500/80',   border: 'border-amber-400/60',   grade: 'B' }
  return               { text: 'text-red-400',     bg: 'bg-red-500/80',     border: 'border-red-400/60',     grade: 'C' }
}

function shortDate(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function DailyScoreCard({ score }: Props) {
  const tier = getScoreTier(score.score)
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/play/${score.date}`)}
      className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700 hover:shadow-lg hover:scale-[1.03] transition-all duration-200 group cursor-pointer">

      {/* Cover image */}
      {score.manga.image ? (
        <img
          src={score.manga.image}
          alt={score.manga.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-4xl select-none">
          📕
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50" />

      {/* Top row: date + grade badge */}
      <div className="absolute top-0 inset-x-0 flex items-start justify-between px-1.5 pt-1.5">
        <span className="text-[10px] font-bold text-white/80 leading-none drop-shadow">
          {shortDate(score.date)}
        </span>
        <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-md ${tier.bg} text-white border ${tier.border} leading-none shadow`}>
          {tier.grade}
        </span>
      </div>

      {/* Bottom: title + score */}
      <div className="absolute bottom-0 inset-x-0 px-2 pb-2">
        <p className="text-[11px] font-bold text-white leading-tight truncate drop-shadow">
          {score.manga.title || '—'}
        </p>
        <p className={`text-[10px] font-semibold ${tier.text} drop-shadow`}>
          {score.score} pts · {score.guesses.length} {score.guesses.length === 1 ? 'guess' : 'guesses'}
        </p>
      </div>

    </div>
  )
}
