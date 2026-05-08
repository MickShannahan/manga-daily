import { DataContract } from "./DataContract"

export class ScoreMangaSummary extends DataContract {
  title: string
  japanTitle: string
  image: string

  constructor(data: any = {}) {
    super()
    this.title = data.title ?? ''
    this.japanTitle = data.japanTitle ?? ''
    this.image = data.image ?? ''
  }
}
