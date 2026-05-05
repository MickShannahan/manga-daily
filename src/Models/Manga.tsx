


import { Character } from './Character'
import { DataContract } from './DataContract'

export class Manga extends DataContract {
  title: string
  author: string
  image: string
  genre: string[]
  articleLink: string
  articleIntro: string
  published: string
  plot: string
  urlTitle: string
  volumes: string
  mainCharacters: Character[]


  constructor(data: any = {}){
    super()
    this.title = data.title ?? ''
    this.author = data.author ?? ''
    this.genre = Array.isArray(data.genre) ? data.genre : typeof data.genre == 'string' ? data.genre.split(', ') : ['']
    this.image = data.image ?? ''
    this.articleLink = data.articleLink ?? ''
    this.articleIntro = data.articleIntro ?? ''
    this.published = data.published ?? ''
    this.plot = data.plot ?? ''
    this.urlTitle = data.urlTitle ?? ''
    this.volumes = data.volumes ?? ''
    this.mainCharacters = data.mainCharacters ?? [new Character({})]
  }

}