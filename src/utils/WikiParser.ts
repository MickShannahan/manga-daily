// WikiParsers.js
// Utility functions for parsing manga details from Wikipedia wikitext and API page objects

function parseWikitextFields(content) {
  let author = null, published = null, volumes = null, image = null, plot = null, mainCharacters = [], sales = null, genre = null, demographic = null
  // Author (stop at first |, newline, or <ref)
  const matchAuthor = content.match(/\|\s*author\s*=([^\n\r|<]*)/i)
  if (matchAuthor) author = matchAuthor[1].trim()
  // Published/First (stop at first |, newline, or <ref)
  const matchPublished = content.match(/\|\s*(published|first)\s*=([^\n\r|<]*)/i)
  if (matchPublished) published = matchPublished[2].trim()
  // Volumes
  const matchVolumes = content.match(/\|\s*volumes\s*=([^\n\r]*)/i)
  if (matchVolumes) volumes = matchVolumes[1].trim()
  // Sales
  const matchSales = content.match(/\|\s*sales\s*=([^\n\r]*)/i)
  if (matchSales) sales = matchSales[1].trim()
  // Genre
  const matchGenre = content.match(/\|\s*genre\s*=([^\n\r]*)/i)
  if (matchGenre) genre = matchGenre[1].trim()
  // Demographic
  const matchDemographic = content.match(/\|\s*demographic\s*=([^\n\r]*)/i)
  if (matchDemographic) demographic = matchDemographic[1].trim()
  // Image (cover)
  const matchImage = content.match(/\|\s*image\s*=([^\n\r]*)/i)
  if (matchImage) {
    const imgName = matchImage[1].trim().replace(/\s/g, '_')
    image = `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(imgName)}`
  }
  // Plot extraction: look for 'Plot', 'Plot Synopsis', or 'Synopsis' section (robust to subheadings)
  const plotSectionRegex = /\n+==+\s*(Plot|Plot Synopsis|Synopsis)\s*==+\n+([\s\S]*?)(?=\n+==+[^=]|\n+$)/i
  const plotSection = content.match(plotSectionRegex)
  if (plotSection && plotSection[2]) {
    // Get the first non-empty paragraph after the section header
    const paragraphs = plotSection[2].split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
    if (paragraphs.length > 0) plot = paragraphs[0]
  }
  // Characters extraction (same as before)
  const matchChars = content.match(/\|\s*(?:main_characters|characters)\s*=([^\n\r]*)/i)
  if (matchChars) {
    mainCharacters = matchChars[1].split(/,|\band\b|\/|;|\n/).map(s => s.trim()).filter(Boolean)
  }
  if (mainCharacters.length === 0) {
    const charSection = content.split(/==+\s*Characters?\s*==+/i)[1]
    if (charSection) {
      const listMatch = charSection.match(/\n\*+\s*([^\n]+)/g)
      if (listMatch) {
        mainCharacters = listMatch.map(item => item.replace(/^\n\*+\s*/, '').trim())
      } else {
        const paraMatch = charSection.match(/\n([^\n][^\n]+)\n/)
        if (paraMatch) mainCharacters = [paraMatch[1].trim()]
      }
    }
  }
  return { author, published, volumes, image, plot, mainCharacters, sales, genre, demographic }
}

function parseMangaDetailsFromPage(page) {
  const title = page.title
  const wikiTitle = title
  let { author, published, volumes, image, plot, mainCharacters, sales, genre, demographic } = {}
  const content = page.revisions?.[0]?.slots?.main['*']
  let articleIntro = null
  if (content) {
    ({ author, published, volumes, image, plot, mainCharacters, sales, genre, demographic } = parseWikitextFields(content))
  } else {
    author = published = volumes = image = plot = null
    mainCharacters = []
    genre = demographic = null
  }
  // Clean all string fields
  author = cleanWikiText(author)
  published = cleanWikiText(published)
  volumes = cleanWikiText(volumes)
  image = cleanWikiText(image)
  plot = cleanWikiText(plot)
  sales = cleanWikiText(sales)
  genre = cleanWikiText(genre)
  demographic = cleanWikiText(demographic)
  articleIntro = page.extract ? cleanWikiText(page.extract.trim()) : null
  if (!plot && page.extract) {
    plot = cleanWikiText(page.extract.trim())
  }
  // If plot and articleIntro are identical, set plot to null
  if (plot && articleIntro && plot === articleIntro) {
    plot = null
  }
  if (!image && page.original?.source) image = page.original.source
  // Clean mainCharacters array
  if (Array.isArray(mainCharacters)) {
    mainCharacters = mainCharacters.map(cleanWikiText).filter(Boolean)
  }
  const link = wikiTitle.replace(/ /g, '_')
  const details = {
    title: cleanWikiText(wikiTitle),
    author,
    published,
    volumes,
    image,
    plot,
    mainCharacters,
    sales,
    genre,
    demographic,
    articleIntro,
    urlTitle: link,
    articleLink: `https://en.wikipedia.org/wiki/${link}`
  }
  return details
}

// Utility to clean wiki markup from extracted text
function cleanWikiText(text) {
  if (!text) return ''
  // Remove comments
  text = text.replace(/<!--([\s\S]*?)-->/g, '')
  // Remove templates {{...}}
  text = text.replace(/\{\{[^{}]*\}\}/g, '')
  // Remove nested templates (basic)
  while (/\{\{[^{}]*\}\}/.test(text)) {
    text = text.replace(/\{\{[^{}]*\}\}/g, '')
  }
  // Replace links [[Page|Display]] or [[Page]] with Display or Page
  text = text.replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, '$2')
  // Remove any remaining brackets
  text = text.replace(/[[]\{\}]/g, '')
  // Remove file/image links
  text = text.replace(/File:[^\s]+/g, '')
  // Remove multiple spaces/newlines
  text = text.replace(/\s{2,}/g, ' ')
  text = text.replace(/\n+/g, ' ')
  return text.trim()
}

export { parseWikitextFields, parseMangaDetailsFromPage, cleanWikiText }