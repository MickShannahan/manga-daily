import { makeAutoObservable } from "mobx";
import { normalizeGuess } from "./utils/normalize";
import { DailyScore } from "./Models/DailyScore";
import { getDaysFromLaunch } from "./utils/dateUtils";
import { ScoreMangaSummary } from "./Models/ScoreMangaSummary";

export type GameEvent =
  | { type: 'guess'; text: string; correct: boolean }
  | { type: 'reveal'; label: string; cost: number }

const SCORES_KEY = 'manga-daily:scores'

type StoredScoresMap = Record<string, {
  title: string
  japanTitle: string
  image: string
  score: number
  gaveUp: boolean
  guesses: string[]
}>

function loadScoresFromStorage(): DailyScore[] {
  try {
    const raw = localStorage.getItem(SCORES_KEY)
    if (!raw) return []
    const map: StoredScoresMap = JSON.parse(raw)
    return Object.entries(map)
      .map(([date, data]) => new DailyScore({
        date,
        ...data,
        manga: new ScoreMangaSummary({ title: data.title, japanTitle: data.japanTitle, image: data.image }),
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

export const AppState = makeAutoObservable({
  activeManga: {} as any,
  guesses: [] as string[],
  events: [] as GameEvent[],
  score: 1500,
  gameOver: false,
  revealAll: false,
  playerGaveUp: false,
  isLiveSession: false,
  dailyScores: loadScoresFromStorage() as DailyScore[],

  get completedDateKeys(): Set<string> {
    return new Set(this.dailyScores.map((s: DailyScore) => s.date))
  },

  get allDays(): Array<{ dateKey: string; score?: DailyScore }> {
    const days = getDaysFromLaunch()
    return days.map(dateKey => ({
      dateKey,
      score: this.dailyScores.find((s: DailyScore) => s.date === dateKey),
    }))
  },

  saveScore(score: DailyScore) {
    try {
      const raw = localStorage.getItem(SCORES_KEY)
      const map: StoredScoresMap = raw ? JSON.parse(raw) : {}
      map[score.date] = {
        title: score.manga.title,
        japanTitle: score.manga.japanTitle,
        image: score.manga.image,
        score: score.score,
        gaveUp: score.gaveUp,
        guesses: score.guesses,
      }
      localStorage.setItem(SCORES_KEY, JSON.stringify(map))
    } catch { /* ignore */ }
    const existing = this.dailyScores.findIndex((s: DailyScore) => s.date === score.date)
    if (existing >= 0) {
      this.dailyScores[existing] = score
    } else {
      this.dailyScores.push(score)
      this.dailyScores.sort((a: DailyScore, b: DailyScore) => b.date.localeCompare(a.date))
    }
  },

  resetGame() {
    this.guesses = []
    this.events = []
    this.score = 1500
    this.gameOver = false
    this.revealAll = false
    this.playerGaveUp = false
    this.isLiveSession = true
    this.activeManga = {}
  },

  restoreFromScore(saved: DailyScore) {
    this.guesses = [...saved.guesses]
    this.events = saved.guesses.map((g, i) => {
      const isLast = i === saved.guesses.length - 1
      const wonOnThis = isLast && saved.score > 0 && !saved.gaveUp
      return { type: 'guess' as const, text: g, correct: wonOnThis }
    })
    this.score = saved.score
    this.playerGaveUp = saved.gaveUp
    this.isLiveSession = false
    this.gameOver = true
    this.revealAll = true
    // activeManga intentionally not cleared — keep showing current manga while new fetch runs
  },

  deductPoints(amount: number, label?: string) {
    if (this.gameOver) return
    this.score = Math.max(0, this.score - amount)
    if (label) this.events.push({ type: 'reveal', label, cost: amount })
    if (this.score === 0) {
      this.revealAll = true
      this.gameOver = true
    }
  },

  giveUp() {
    if (this.gameOver) return
    this.events.push({ type: 'reveal', label: 'Answer', cost: this.score })
    this.score = 0
    this.playerGaveUp = true
    this.revealAll = true
    this.gameOver = true
  },

  submitGuess(guess: string) {
    if (this.gameOver) return
    if (this.guesses.includes(guess)) return
    const isCorrect = normalizeGuess(guess) === normalizeGuess(this.activeManga?.title ?? '')
    if (!isCorrect) {
      this.score = Math.max(0, this.score - (10 + guess.length))
      if (this.score === 0) {
        this.revealAll = true
        this.gameOver = true
      }
    } else {
      this.revealAll = true
      this.gameOver = true
    }
    this.guesses.push(guess)
    this.events.push({ type: 'guess', text: guess, correct: isCorrect })
  }
})