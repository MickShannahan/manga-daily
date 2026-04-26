import { mangaWikiService } from "../services/MediaWikiApi"
import { logger } from "../utils/Logger"
import { mangaList } from "../utils/mangalist"

export default function HomePage(){

  async function test(){
    const title = mangaList[0]
    const manga = await mangaWikiService.getMangaDetails(title)
    logger.log('📕',manga)
  }

  return (
    <section className="@container">
      <section className="mx-auto px-2 @lg:px-5 @md:max-w-4xl border-x-1 border-x-amber-50">
      <div>This is the homepage</div>

      <button onClick={test} className="bg-sky-500 hover:bg-sky-700">Test API</button>
      </section>
    </section>
  )
}