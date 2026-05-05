import { DataContract } from "./DataContract"



export class Character extends DataContract{
  name: string
  altName: string
  image: string
  articleLink: string
  
  constructor(data: any = {}){
    super()
    this.name = data.name ?? ''
    this.altName = data.altName ?? ''
    this.image = data.image ?? ''
    this.articleLink = data.articleLink ?? ''
  }
}