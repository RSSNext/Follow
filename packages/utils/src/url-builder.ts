import { WEB_URL } from "@follow/shared/constants"

class UrlBuilderStatic {
  private join(path: string, query?: Record<string, string>) {
    const nextUrl = new URL(WEB_URL)
    nextUrl.pathname = path
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        nextUrl.searchParams.set(key, value)
      }
    }
    return nextUrl.toString()
  }
  shareFeed(id: string, view?: number) {
    return this.join(`share/feeds/${id}`, view ? { view: view.toString() } : undefined)
  }
  shareList(id: string, view?: number) {
    return this.join(`share/lists/${id}`, view ? { view: view.toString() } : undefined)
  }

  profile(id: string) {
    return this.join(`profile/${id}`)
  }
}

export const UrlBuilder = new UrlBuilderStatic()
