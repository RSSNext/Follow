export interface Hydable {
  hydrate: () => Promise<void>
}
