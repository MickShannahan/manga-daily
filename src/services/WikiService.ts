import axios from "axios"
import { logger } from "../utils/Logger"

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

class WikiService{

  async getArticle(article: string, contract: object){
    const res = await api.post(`api/wiki/${article}`, {contract})
    logger.log('🦧', res.data)
    return res.data
  }

}

export const wikiService = new WikiService()