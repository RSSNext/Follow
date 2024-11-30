export class LRUCache<K, V> {
  private capacity: number
  private cache: Map<K, V>
  private keys: K[]

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error("Capacity must be positive")
    }

    this.capacity = capacity
    this.cache = new Map()
    this.keys = []
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined
    }

    this.keys = this.keys.filter((k) => k !== key)
    this.keys.push(key)

    return this.cache.get(key)
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.set(key, value)
      this.keys = this.keys.filter((k) => k !== key)
      this.keys.push(key)
    } else {
      if (this.keys.length >= this.capacity) {
        const leastUsedKey = this.keys.shift()
        if (leastUsedKey !== undefined) {
          this.cache.delete(leastUsedKey)
        }
      }

      this.cache.set(key, value)
      this.keys.push(key)
    }
  }

  clear(): void {
    this.cache.clear()
    this.keys = []
  }

  size(): number {
    return this.cache.size
  }

  getKeys(): K[] {
    return [...this.keys]
  }
}
