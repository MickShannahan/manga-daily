import { makeAutoObservable } from "mobx";


export const AppState = makeAutoObservable({
  activeManga: {} as any,
  guesses: [] as string[],
  score: 1500,
  gameOver: false,
  revealAll: false,

  deductPoints(amount: number) {
    if (this.gameOver) return
    this.score = Math.max(0, this.score - amount)
    if (this.score === 0) {
      this.revealAll = true
      this.gameOver = true
    }
  },

  giveUp() {
    this.score = 0
    this.revealAll = true
    this.gameOver = true
  },

  submitGuess(guess: string) {
    if (this.gameOver) return
    if (this.guesses.includes(guess)) return
    const isCorrect = guess.toLowerCase() === this.activeManga?.title?.toLowerCase()
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
  }
})