import axios from "axios"
import { logger } from "../utils/Logger"

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

class WikiService{

  async getArticle(article: string, contract: object){
    const res = await api.post(`api/wiki/article/${article}`, {contract})
    logger.log('🦧', res.data)
    return res.data
  }

  async anonymizeTextBody(text : string){
    const res = await api.post(`api/wiki/anonymize`, {text, characterLimit :  700, model: 'grok-4-1-fast-non-reasoning'})
    logger.log('🦧💬', res.data)
    return res.data
  }
}

export const wikiService = new WikiService()