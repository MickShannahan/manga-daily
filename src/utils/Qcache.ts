// Simple localStorage cache with expiry
class QCache {
  constructor(prefix = "mwapi_") {
    this.prefix = prefix
  }
  get(key) {
    const cached = localStorage.getItem(this.prefix + key)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return data
      }
    }
    return null
  }
  set(key, data) {
    console.log('💾', key, data)
    localStorage.setItem(this.prefix + key, JSON.stringify({ data, timestamp: Date.now() }))
  }
  clear() {
    // Remove all localStorage items with this.prefix
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    }
  }
}

export { QCache }