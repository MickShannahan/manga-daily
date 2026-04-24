import { QCache } from '@/utils/QCache.js'
import { parseWikitextFields, parseMangaDetailsFromPage } from '@/utils/WikiParsers.js'

class MediaWikiAPI {
  constructor(apiUrl = "https://en.wikipedia.org/w/api.php") {
    this.apiUrl = apiUrl
    this.cache = new QCache()
  }

  async get(title) {
    const cacheKey = `get_${title}`
    const cached = this.cache.get(cacheKey)
    if (cached) return cached
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      prop: "links",
      titles: title,
      pllimit: "max",
      origin: "*"
    })
    let links = []
    let pageContinue = null
    do {
      if (pageContinue) params.set('plcontinue', pageContinue)
      const url = `${this.apiUrl}?${params.toString()}`
      const response = await fetch(url)
      const data = await response.json()
      const pages = data.query.pages
      for (const pageId in pages) {
        if (pages[pageId].links) {
          links = links.concat(pages[pageId].links.map(link => link.title))
        }
      }
      pageContinue = data.continue ? data.continue.plcontinue : undefined
    } while (pageContinue)
    this.cache.set(cacheKey, links)
    return links
  }

  async getMangaDetails(title) {
    const cacheKey = `details_${title}`
    const cached = this.cache.get(cacheKey)
    if (cached) return cached
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      prop: "revisions|extracts|pageimages",
      rvprop: "content",
      rvslots: "main",
      titles: title,
      exintro: "1",
      explaintext: "1",
      piprop: "original",
      origin: "*"
    })
    const url = `${this.apiUrl}?${params.toString()}`
    const response = await fetch(url)
    const data = await response.json()
    const pages = data.query.pages
    let details = null
    for (const pageId in pages) {
      details = parseMangaDetailsFromPage(pages[pageId])
      this.cache.set(cacheKey, details)
      break
    }
    return details
  }

  async getMangaDetailsBatch(titles) {
    const BATCH_SIZE = 50
    let allDetails = []
    const toFetch = []
    titles.forEach((title) => {
      const cached = this.getCachedDetails(title)
      if (cached) allDetails.push(cached)
      else toFetch.push(title)
    })
    console.log("📗 Cached", allDetails.length, allDetails)
    const totalBatches = Math.ceil(toFetch.length / BATCH_SIZE)
    console.log('🎂Batch Requests', totalBatches, toFetch.length)
    // Fetching batches
    for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
      const batchNum = Math.floor(i / BATCH_SIZE) + 1
      console.log('🍰', batchNum, i)
      const batch = toFetch.slice(i, i + BATCH_SIZE)
      const fetchedDetails = []
      // get what isn't cached
      const params = new URLSearchParams({
        action: "query",
        format: "json",
        prop: "revisions|extracts|pageimages",
        rvprop: "content",
        rvslots: "main",
        titles: batch.join('|'),
        exintro: "1",
        explaintext: "1",
        piprop: "original",
        origin: "*"
      })
      const batchFetchUrl = `${this.apiUrl}?${params.toString()}`
      const response = await fetch(batchFetchUrl)
      const data = await response.json()
      const pages = data.query.pages
      // save to list, and cache
      for (const pageId in pages) {
        const page = pages[pageId]
        const details = parseMangaDetailsFromPage(page)
        console.log('📕📄', details)
        this.cache.set(`details_${details.urlTitle}`, details)
        fetchedDetails.push(details)
      }
      allDetails = allDetails.concat(fetchedDetails)
    }
    return allDetails
  }

  getCachedDetails(title) {
    const details = this.cache.get(`details_${title}`)
    return details
  }

  // Filter out manga with missing required fields
  filterValidManga(detailsArray) {
  }
}


const mangaWikiService = new MediaWikiAPI()
export { mangaWikiService }