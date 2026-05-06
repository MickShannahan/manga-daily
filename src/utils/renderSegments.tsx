import { normalizeGuess } from './normalize'

export function renderSegments(text: string, guesses: string[]) {
  if (!text) return null
  if (!guesses.length) return <span className="tracking-tighter">{text.replace(/[^\s]/g, '█')}</span>

  const escaped = guesses.map(g => normalizeGuess(g).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi')
  const normalizedText = normalizeGuess(text)
  const parts: string[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(normalizedText)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    parts.push(text.slice(match.index, match.index + match[0].length))
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))

  const normalizedGuesses = guesses.map(normalizeGuess)

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = normalizedGuesses.some(g => normalizeGuess(part) === g)
        return isMatch
          ? <span key={i}>{part}</span>
          : <span key={i} className="tracking-tighter">{part.replace(/[^\s]/g, '█')}</span>
      })}
    </>
  )
}
