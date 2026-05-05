import { observer } from "mobx-react-lite";
import { Manga } from "../Models/Manga";
import CharacterCard from "./CharacterCard";

const MangaDetails = observer(({ manga }: { manga: Manga }) => {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">

        {/* Hero — image + title block */}
        <div className="flex flex-col sm:flex-row gap-6 p-6">
          <img
            src={manga?.image}
            alt={manga?.title}
            className="w-48 h-64 object-cover rounded-xl shadow-md self-start shrink-0"
          />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {manga?.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {manga?.articleIntro}
              </p>
            </div>

            {/* Meta badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Author', value: manga?.author },
                { label: 'Published', value: manga?.published },
                { label: 'Volumes', value: manga?.volumes },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{value}</p>
                </div>
              ))}
            </div>

            {/* Genre pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {manga?.genre?.map((g, index) => (
                <span
                  key={index}
                  className="bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mx-6" />

        {/* Plot */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Plot</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{manga?.plot}</p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mx-6" />

        {/* Characters */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Main Characters</h2>
          <div className="flex flex-wrap gap-2 justify-content-between">
            {manga?.mainCharacters?.map((character) => (
              <CharacterCard character={character}/>
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