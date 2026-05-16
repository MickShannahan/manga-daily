import { makeAutoObservable } from "mobx";
import { normalizeGuess } from "./utils/normalize";
import { DailyScore } from "./Models/DailyScore";
import { getDaysFromLaunch } from "./utils/dateUtils";

export type GameEvent =
  | { type: 'guess'; text: string; correct: boolean }
  | { type: 'reveal'; label: string; cost: number }

const SCORE_KEY_PREFIX = 'manga-daily:score:'

function loadScoresFromStorage(): DailyScore[] {
  const scores: DailyScore[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(SCORE_KEY_PREFIX)) continue
    try {
      const raw = localStorage.getItem(key)
      if (raw) scores.push(new DailyScore(JSON.parse(raw)))
    } catch {
      // ignore corrupt entries
    }
  }
  return scores.sort((a, b) => b.date.localeCompare(a.date))
}

export const AppState = makeAutoObservable({
  activeManga: {} as any,
  guesses: [] as string[],
  events: [] as GameEvent[],
  score: 1500,
  gameOver: false,
  revealAll: false,
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
    localStorage.setItem(`${SCORE_KEY_PREFIX}${score.date}`, JSON.stringify(score))
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
    this.activeManga = {}
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