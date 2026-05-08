import { observer } from "mobx-react-lite"
import { AppState } from "../AppState"
import DailyScoreCard from "../components/DailyScoreCard"

const ScoreCardPage = observer(() => {
  const totalPlayed = AppState.dailyScores.length
  const avgScore = totalPlayed > 0
    ? Math.round(AppState.dailyScores.reduce((sum, s) => sum + s.score, 0) / totalPlayed)
    : 0

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Score Card
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            Your daily manga challenge history
          </p>
        </div>

        {/* Summary stats */}
        {totalPlayed > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 px-5 py-4 shadow-sm">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                Days Played
              </p>
              <p className="text-3xl font-black text-zinc-900 dark:text-white">{totalPlayed}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 px-5 py-4 shadow-sm">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                Avg Score
              </p>
              <p className="text-3xl font-black text-zinc-900 dark:text-white">{avgScore}</p>
            </div>
          </div>
        )}

        {/* Score cards */}
        {AppState.dailyScores.length === 0 ? (
          <div className="text-center py-24 text-zinc-400 dark:text-zinc-600">
            <div className="text-6xl mb-4 select-none">📚</div>
            <p className="text-lg font-semibold">No scores yet</p>
            <p className="text-sm mt-1">Play the daily challenge to see your history here!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {AppState.dailyScores.map((dailyScore, index) => (
              <DailyScoreCard key={index} score={dailyScore} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
})

export default ScoreCardPage
