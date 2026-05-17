import { DataContract } from "./DataContract"
import { ScoreMangaSummary } from "./ScoreMangaSummary"

export class DailyScore extends DataContract {
  date: string
  score: number
  gaveUp: boolean
  guesses: string[]
  manga: ScoreMangaSummary

  constructor(data: any = {}) {
    super()
    this.date = data.date ?? ''
    this.score = data.score ?? 0
    this.gaveUp = data.gaveUp ?? false
    this.guesses = Array.isArray(data.guesses) ? data.guesses : []
    this.manga = data.manga instanceof ScoreMangaSummary
      ? data.manga
      : new ScoreMangaSummary(data.manga ?? {})
  }
}
