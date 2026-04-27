import { observer } from "mobx-react-lite"
import { AppState } from "../AppState"
import { mangaWikiService } from "../services/MediaWikiApi"
import { logger } from "../utils/Logger"
import { mangaList } from "../utils/mangalist"
import { useEffect, useState } from "react"
import { observable } from "mobx"
import MangaDetails from "../components/MangaDetails"

const HomePage = observer(__ => {


  useEffect(()=>{
    test()
  }, [/**on mount */])

  async function test(){
    const title = mangaList[0]
    const manga = await mangaWikiService.getMangaDetails(title)
    logger.log('📕',manga)
    AppState.activeManga = manga
  }

  return (
    <section className="@container">
      <section className="mx-auto px-2 @lg:px-5 @md:max-w-6xl border-x-1 border-x-amber-50">
      <MangaDetails manga={AppState.activeManga}/>
      

      <button onClick={test} className="bg-sky-500 hover:bg-sky-700">Test API</button>
      </section>
    </section>
  )
})

export default HomePage