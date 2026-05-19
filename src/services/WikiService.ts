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

  async anonymizeTextBody(text: string) {
    const res = await api.post('api/wiki/anonymize', { text, characterLimit: 700, model: 'grok-4-1-fast-non-reasoning' })
    logger.log('🦧💬', res.data)
    return res.data
  }

  /** GET — returns the cached anonymized article from DB, or null if not found. */
  async getCachedArticle(articleUrl: string): Promise<Record<string, unknown> | null> {
    try {
      const res = await api.get(`api/wiki/articles/${encodeURIComponent(articleUrl)}`)
      if (!res.data?.cached) return null
      logger.log('📦 cache hit', articleUrl)
      return res.data as Record<string, unknown>
    } catch {
      return null
    }
  }

  /** POST — saves the anonymized article to the DB for future cache hits. */
  async cacheArticle(title: string, articleUrl: string, data: object): Promise<void> {
    try {
      await api.post('api/wiki/articles', { title, articleUrl, data: JSON.stringify(data) })
      logger.log('📦 cached', articleUrl)
    } catch (err) {
      logger.log('⚠️ Failed to cache article', articleUrl, err)
    }
  }
}

export const wikiService = new WikiService()