import { makeAutoObservable } from "mobx";
import { normalizeGuess } from "./utils/normalize";
import { DailyScore } from "./Models/DailyScore";
import { ScoreMangaSummary } from "./Models/ScoreMangaSummary";

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
  dailyScores: [
    new DailyScore({
      date: '2026-05-06',
      score: 1380,
      guesses: ['Naruto'],
      manga: new ScoreMangaSummary({ title: 'One Piece', japanTitle: 'ワンピース', image: '' }),
    }),
    new DailyScore({
      date: '2026-05-05',
      score: 870,
      guesses: ['Bleach', 'Dragon Ball', 'One Piece'],
      manga: new ScoreMangaSummary({ title: 'Fullmetal Alchemist', japanTitle: '鋼の錬金術師', image: '' }),
    }),
    new DailyScore({
      date: '2026-05-04',
      score: 420,
      guesses: ['Naruto', 'Bleach', 'Berserk', 'Attack on Titan', 'Death Note'],
      manga: new ScoreMangaSummary({ title: 'Vinland Saga', japanTitle: 'ヴィンランド・サガ', image: '' }),
    }),
    new DailyScore({
      date: '2026-05-03',
      score: 0,
      guesses: ['Naruto', 'One Piece', 'Bleach', 'Berserk'],
      manga: new ScoreMangaSummary({ title: 'Vagabond', japanTitle: 'バガボンド', image: '' }),
    }),
  ] as DailyScore[],

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