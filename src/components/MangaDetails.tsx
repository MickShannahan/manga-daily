import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Manga } from "../Models/Manga";
import CharacterCard from "./CharacterCard";
import SpoilerText from "./SpoilerText";
import SpoilerImage from "./SpoilerImage";
import SpoilerPill from "./SpoilerPill";
import MangaDetailsSkeleton from "./MangaDetailsSkeleton";
import SpoilerCard from "./SpoilerCard";

type LoadState = 'loading' | 'fading-out' | 'loaded'

const MangaDetails = observer(({ manga }: { manga: Manga }) => {
  const [loadState, setLoadState] = useState<LoadState>('loading')

  useEffect(() => {
    if (manga?.title && loadState === 'loading') {
      setLoadState('fading-out')
      const id = setTimeout(() => setLoadState('loaded'), 500)
      return () => clearTimeout(id)
    }
  }, [manga?.title])

  if (loadState !== 'loaded') {
    return (
      <div className={`transition-opacity duration-500 ${
        loadState === 'fading-out' ? 'opacity-0' : 'opacity-100'
      }`}>
        <MangaDetailsSkeleton />
      </div>
    )
  }

  return (
    <section className="mx-auto p-6 animate-fade-in">
      <div className=" ">

        {/* Hero — image + title block */}
        <div className="flex flex-col sm:flex-row gap-6 p-6">
          <SpoilerImage
            src={manga?.image}
            alt={manga?.title}
            className="w-64 h-auto rounded-xl shadow-md self-start"
            isGiveUp
          />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                <SpoilerText text={manga?.title} isGiveUp label="Title" />
              </h1>
              <h2 className="font-jp">
                <SpoilerText text={manga?.japanTitle} isGiveUp label="Japanese Title" />
              </h2>
              {/* Genre pills */}
              <div className="flex flex-wrap gap-2 my-3">
                {manga?.genre?.map((g, index) => (
                  <SpoilerPill
                    key={index}
                    label={g}
                    penalty={50}
                    className="bg-pink-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <SpoilerText text={manga?.articleIntro} penalty={550} block label="Intro" />
              </div>
            </div>

            {/* Combined cards */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              {(() => {
                const samePerson = manga?.author && manga?.author === manga?.illustrator
                return (
                  <SpoilerCard
                    title="Credits"
                    penalty={250}
                    eventLabel="Credits"
                    rows={samePerson
                      ? [{ label: 'Author & Illustrator', value: manga?.author }]
                      : [
                          { label: 'Author', value: manga?.author },
                          { label: 'Illustrator', value: manga?.illustrator },
                        ]
                    }
                  />
                )
              })()}
              <SpoilerCard
                title="Publishing"
                penalty={150}
                eventLabel="Publishing"
                lines={(() => {
                  const volumes = manga?.volumes ? `${manga.volumes} volumes` : null
                  const start = manga?.publishStartDate || null
                  const end = manga?.publishEndDate || null
                  const dateRange = start && end ? `${start} to ${end}` : start || end || null
                  const publisher = manga?.publisher
                  const engPublisher = manga?.englishPublisher
                  const imprint = manga?.imprint
                  const publisherLine = [engPublisher ?? publisher , imprint, volumes].filter(Boolean).join(' · ')
                  return [dateRange, publisherLine].filter(Boolean)
                })()}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mx-6" />

        {/* Plot */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Plot</h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
            <SpoilerText text={manga?.plot} penalty={550} block label="Plot" />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mx-6" />

        {/* Characters */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Main Characters</h2>
          <div className="flex flex-wrap gap-2 justify-between">
            {manga?.mainCharacters?.map((character, index) => (
              <CharacterCard key={index} character={character} penalty={Math.max(0, 650 - index * 50)} label={`Character ${index + 1}`} />
            ))}
          </div>
        </div>

        {/* Footer link */}
        <div className="px-6 pb-6">
          <a
            href={manga?.articleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200"
          >
            Read Full Article →
          </a>
        </div>

      </div>
    </section>
  );
});

export default MangaDetails;

