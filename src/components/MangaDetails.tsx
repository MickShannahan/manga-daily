import { observer } from "mobx-react-lite";
import { Manga } from "../Models/Manga";
import CharacterCard from "./CharacterCard";
import SpoilerText from "./SpoilerText";
import SpoilerImage from "./SpoilerImage";
import SpoilerPill from "./SpoilerPill";

const MangaDetails = observer(({ manga }: { manga: Manga }) => {
  return (
    <section className=" mx-auto p-6">
      <div className=" ">

        {/* Hero — image + title block */}
        <div className="flex flex-col sm:flex-row gap-6 p-6">
          <SpoilerImage
            src={manga?.image}
            alt={manga?.title}
            className="w-64 h-96 rounded-xl shadow-md self-start"
            isGiveUp
          />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                <SpoilerText text={manga?.title} isGiveUp />
              </h1>
              <h2 className="font-jp">
                <SpoilerText text={manga?.japanTitle} isGiveUp />
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <SpoilerText text={manga?.articleIntro} block />
              </p>
            </div>

            {/* Meta badges */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { label: 'Author', value: manga?.author, penalty: 200 },
                { label: 'Published', value: manga?.published, penalty: 100 },
                { label: 'Volumes', value: manga?.volumes, penalty: 25 },
              ].map(({ label, value, penalty }) => (
                <div key={label} className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    <SpoilerText text={value} penalty={penalty} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mx-6" />

        {/* Plot */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Plot</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            <SpoilerText text={manga?.plot} penalty={550} block />
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mx-6" />

        {/* Characters */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Main Characters</h2>
          <div className="flex flex-wrap gap-2 justify-between">
            {manga?.mainCharacters?.map((character, index) => (
              <CharacterCard key={index} character={character} penalty={Math.max(0, 650 - index * 50)} />
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

