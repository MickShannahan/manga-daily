import { observer } from "mobx-react-lite"
import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { useEffect } from "react"
import MangaDetails from "../components/MangaDetails"
import { wikiService } from "../services/WikiService"
import { Manga } from "../Models/Manga"
import { Character } from "../Models/Character"
import GuessSidebar from "../components/GuessSidebar"
import { useParams } from "react-router"
import { formatDateKey, getMangaForDay, parseDateKey } from "../utils/dateUtils"
import { DailyScore } from "../Models/DailyScore"
import { ScoreMangaSummary } from "../Models/ScoreMangaSummary"

async function loadMangaForDate(date: Date) {
  const title = getMangaForDay(date)
  const mangaData = await wikiService.getArticle(title, Manga.toContract())
  const anonymousPlot = await wikiService.anonymizeTextBody(mangaData.plot)
  const anonymousDetails = await wikiService.anonymizeTextBody(mangaData.articleIntro)
  mangaData.articleIntro = anonymousDetails.text
  mangaData.plot = anonymousPlot.text
  // logger.log('📕', mangaData)

  const originalCharacters = (mangaData.mainCharacters ?? []).slice(0, 5)
  const characterLinks: string[] = originalCharacters
    .map(char => char.articleLink?.slice(char.articleLink.lastIndexOf('/') + 1))
    .filter(l => l)
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

const HomePage = observer(() => {
  const { date } = useParams<{ date?: string }>()

  const gameDate = date ? parseDateKey(date) : new Date()
  const dateKey = formatDateKey(gameDate)

  // On mount (or when navigating to a different day): restore completed state or start fresh
  useEffect(() => {
    const saved = AppState.dailyScores.find(s => s.date === dateKey)
    if (saved) {
      AppState.restoreFromScore(saved)
    } else {
      AppState.resetGame()
    }
    loadMangaForDate(gameDate)
  }, [dateKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // When the game ends, save the score.
  // AppState.gameOver is a MobX observable; observer() makes this re-run when it changes.
  useEffect(() => {
    if (!AppState.gameOver || !AppState.isLiveSession) return
    const summary = new ScoreMangaSummary({
      title: AppState.activeManga.title,
      japanTitle: AppState.activeManga.japanTitle,
      image: AppState.activeManga.image,
    })
    AppState.saveScore(new DailyScore({
      date: dateKey,
      score: AppState.score,
      gaveUp: AppState.playerGaveUp,
      guesses: [...AppState.guesses],
      manga: summary,
    }))
  }, [AppState.gameOver, dateKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] min-h-screen">
      <div className="min-w-0 mx-auto w-full px-2 lg:px-5 max-w-[100ch]">
        <MangaDetails key={dateKey} manga={AppState.activeManga}/>
      </div>
      <div>
        <GuessSidebar />
      </div>
    </div>
  )
})

export default HomePage