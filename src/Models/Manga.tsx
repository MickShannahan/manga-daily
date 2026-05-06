


import { Character } from './Character'
import { DataContract } from './DataContract'

function parseDate(value: any): string {
  if (!value) return ''
  if (typeof value === 'object' && value.year) return String(value.year)
  if (value instanceof Date) return isNaN(value.getTime()) ? '' : String(value.getFullYear())
  const str = String(value)
  const yearMatch = str.match(/\b(1\d{3}|2\d{3})\b/)
  return yearMatch ? yearMatch[1] : str
}

export class Manga extends DataContract {
  title: string
  japanTitle: string
  author: string
  illustrator: string
  image: string
  genre: string[]
  articleLink: string
  articleIntro: string
  publishStartDate: string
  publishEndDate: string
  publisher: string
  englishPublisher:  string
  imprint: string
  plot: string
  urlTitle: string
  volumes: string
  mainCharacters: Character[]


  constructor(data: any = {}){
    super()
    this.title = data.title ?? ''
    this.japanTitle = data.japanTitle ?? ''
    this.author = data.author ?? ''
    this.illustrator = data.illustrator ?? ''
    this.genre = Array.isArray(data.genre) ? data.genre : typeof data.genre == 'string' ? data.genre.split(', ') : ['']
    this.image = data.image ?? ''
    this.articleLink = data.articleLink ?? ''
    this.articleIntro = data.articleIntro ?? ''
    this.publishStartDate = parseDate(data.publishStartDate)
    this.publishEndDate = parseDate(data.publishEndDate)
    this.publisher = data.publisher ?? ''
    this.englishPublisher = data.englishPublisher ?? ''
    this.imprint = data.imprint ?? ''
    this.plot = data.plot ?? ''
    this.urlTitle = data.urlTitle ?? ''
    this.volumes = data.volumes ?? ''
    this.mainCharacters = data.mainCharacters ?? [new Character({})]
  }

}