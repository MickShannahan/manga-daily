const MangaDetailsSkeleton = () => {
  return (
    <section className="mx-auto p-6 animate-pulse">
      <div>

        {/* Hero */}
        <div className="flex flex-col sm:flex-row gap-6 p-6">
          {/* Cover image */}
          <div className="w-64 h-96 rounded-xl bg-gray-300 dark:bg-gray-700 shrink-0" />

          <div className="flex flex-col justify-between w-full">
            <div>
              {/* Title */}
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3" />
              {/* Japan title */}
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4" />

              {/* Genre pills */}
              <div className="flex flex-wrap gap-2 my-3">
                {[80, 100, 70, 90].map((w, i) => (
                  <div key={i} className={`h-6 bg-gray-300 dark:bg-gray-700 rounded-full`} style={{ width: w }} />
                ))}
              </div>

              {/* Intro lines */}
              <div className="space-y-2 mt-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6" />
              </div>
            </div>

            {/* Meta badges */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {['Author', 'Published', 'Volumes'].map(label => (
                <div key={label} className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16 mb-2" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mx-6" />

        {/* Plot */}
        <div className="p-6">
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16 mb-4" />
          <div className="space-y-2">
            {[100, 95, 90, 85, 70].map((w, i) => (
              <div key={i} className="h-3 bg-gray-300 dark:bg-gray-700 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mx-6" />

        {/* Characters */}
        <div className="p-6">
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-36 mb-4" />
          <div className="flex flex-wrap gap-2 justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-36 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className="h-44 bg-gray-300 dark:bg-gray-700" />
                <div className="p-2 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default MangaDetailsSkeleton
