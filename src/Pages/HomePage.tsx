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
    test()
  }, [/**on mount */])

  async function test(){
    const title = mangaList[3]
    const mangaData = await wikiService.getArticle(title, Manga.toContract())
    logger.log('📕', mangaData)

    const characterLinks: string[] = (mangaData.mainCharacters ?? []).slice(0, 5).map(char => char.articleLink?.slice(char.articleLink.lastIndexOf('/'))).filter(l => l)
    const characterData = await Promise.all(
      characterLinks.map(char => wikiService.getArticle(char, Character.toContract()))
    )
    mangaData.mainCharacters = characterData.map(c => new Character(c))

    AppState.activeManga = new Manga(mangaData)
  }

  return (
    <section className="@container">
      <div className="mx-auto px-2 @lg:px-5 @md:max-w-6xl pr-72">
        <MangaDetails manga={AppState.activeManga}/>
        <button onClick={test} className="bg-sky-500 hover:bg-sky-700">Test API</button>
      </div>
      <GuessSidebar />
    </section>
  )
})

export default HomePage