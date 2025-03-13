import { FeedViewType } from "@follow/constants"
import { getLocales } from "expo-localization"

import feeds from "./feeds.json"
import englishFeeds from "./feeds-english.json"

export type PresetFeedConfig = {
  title: string
  feedId: string
  url: string
  view: FeedViewType
}

export const englishPresetFeeds: PresetFeedConfig[] = englishFeeds.map((feed) => ({
  view: FeedViewType.Articles,
  ...feed,
}))

export const otherPresetFeeds: PresetFeedConfig[] = feeds
  // .filter((feed) => feed.language === "Chinese")
  .map((feed) => ({
    view: FeedViewType.Articles,
    ...feed,
  }))

const locales = getLocales()
// `getLocales` guaranteed to contain at least 1 element.
const languageTag = locales[0]?.languageTag || "en-US"
const isEnglishUser = languageTag.startsWith("en")

export const presetFeeds = isEnglishUser ? englishPresetFeeds : otherPresetFeeds
