import { observer } from "mobx-react-lite"
import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { mangaList } from "../utils/mangalist"
import { useEffect, useState } from "react"
import { observable } from "mobx"
import MangaDetails from "../components/MangaDetails"
import { wikiService } from "../services/WikiService"
import { Manga } from "../Models/Manga"
import { Character } from "../Models/Character"
import GuessSidebar from "../components/GuessSidebar"

const HomePage = observer(__ => {


  useEffect(()=>{
    getDailyManga()
  }, [/**on mount */])

  async function getDailyManga(){
    const title = mangaList[102]
    const mangaData = await wikiService.getArticle(title, Manga.toContract())
    const anonymousPlot = await wikiService.anonymizeTextBody(mangaData.plot)
    const anonymousDetails = await wikiService.anonymizeTextBody(mangaData.articleIntro)
    mangaData.articleIntro = anonymousDetails.text
    mangaData.plot = anonymousPlot.text
    // logger.log('📕', mangaData)

    const originalCharacters = (mangaData.mainCharacters ?? []).slice(0, 5)
    const characterLinks: string[] = originalCharacters.map(char => char.articleLink?.slice(char.articleLink.lastIndexOf('/')+1)).filter(l => l)
    const characterData = await Promise.all(
      characterLinks.map((char, i) =>
        wikiService.getArticle(char, Character.toContract()).catch(err => {
          logger.log('⚠️ Failed to fetch character:', char, err)
          return originalCharacters[i]
        })
      )
    )
    mangaData.mainCharacters = characterData.map(c => new Character(c))

    AppState.activeManga = new Manga(mangaData)
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] min-h-screen">
      <div className="min-w-0 mx-auto w-full px-2 lg:px-5 max-w-[100ch]">
        <MangaDetails manga={AppState.activeManga}/>
      </div>
      <div>
        <GuessSidebar />
      </div>
    </div>
  )
})

export default HomePage