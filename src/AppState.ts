import { makeAutoObservable } from "mobx";
import { normalizeGuess } from "./utils/normalize";

export type GameEvent =
  | { type: 'guess'; text: string; correct: boolean }
  | { type: 'reveal'; label: string; cost: number }

export const AppState = makeAutoObservable({
  activeManga: {} as any,
  guesses: [] as string[],
  events: [] as GameEvent[],
  score: 1500,
  gameOver: false,
  revealAll: false,

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