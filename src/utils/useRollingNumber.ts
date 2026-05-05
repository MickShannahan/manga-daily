import { useEffect, useRef, useState } from 'react'

export function useRollingNumber(target: number, duration = 600): number {
  const [display, setDisplay] = useState(target)
  const animRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const fromRef = useRef(target)

  useEffect(() => {
    const from = fromRef.current
    if (from === target) return

    if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    startRef.current = null

    function step(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (target - from) * eased))
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = target
      }
    }

    animRef.current = requestAnimationFrame(step)
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    }
  }, [target, duration])

  return display
}
