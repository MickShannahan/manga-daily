


export class Manga{
  title: string
  author: string
  image: string
  genre: string
  articleLink: string
  articleIntro: string
  published: string
  plot: string
  urlTitle: string
  volumes: string
  mainCharacters: string[]


  constructor(data: any){
    this.title = data.title
    this.author = data.author
    this.genre = data.genre
    this.image = data.image
    this.articleLink = data.articleLink
    this.articleIntro = data.articleIntro
    this.published = data.published
    this.plot = data.plot
    this.urlTitle = data.urlTitle
    this.volumes = data.volumes
    this.mainCharacters = data.mainCharacters
  }
}