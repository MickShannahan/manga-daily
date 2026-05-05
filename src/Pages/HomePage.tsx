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

const HomePage = observer(__ => {


  useEffect(()=>{
    test()
  }, [/**on mount */])

  async function test(){
    const title = mangaList[1]
    const mangaData = await wikiService.getArticle(title, Manga.toContract())
    logger.log('📕', mangaData)

    const characterLinks: string[] = (mangaData.mainCharacters ?? []).slice(0, 5).map(char => char.articleLink.slice(char.articleLink.lastIndexOf('/')))
    const characterData = await Promise.all(
      characterLinks.map(char => wikiService.getArticle(char, Character.toContract()))
    )
    mangaData.mainCharacters = characterData.map(c => new Character(c))

    AppState.activeManga = new Manga(mangaData)
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