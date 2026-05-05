


export abstract class DataContract {
  toContract(): Record<string, unknown> {
    return Object.fromEntries(
      Object.keys(this).map(key => {
        const value = (this as any)[key]

        if (Array.isArray(value)) {
          const first = value[0]
          if (first instanceof DataContract) {
            return [key, { type: 'array', items: first.toContract() }]
          }
          return [key, { type: 'array', items: typeof first ?? 'unknown' }]
        }

        if (value instanceof DataContract) {
          return [key, { type: 'object', contract: value.toContract() }]
        }

        return [key, typeof value]
      })
    )
  }

  static toContract(): Record<string, unknown> {
    const instance = new (this as any)({})
    return instance.toContract()
  }
}