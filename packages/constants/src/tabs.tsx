import * as React from "react"

import { FeedViewType } from "./enums"
import type { t } from "./internal/i18n"

export type I18nKeys = OmitStringType<Parameters<typeof t>[0]>
interface ViewDefinition {
  name: I18nKeys
  icon: React.JSX.Element
  className: string
  peerClassName: string
  translation: string
  view: FeedViewType
  wideMode?: boolean
  gridMode?: boolean
}
export const views: ViewDefinition[] = [
  {
    name: "feed_view_type.articles",
    icon: <i className="i-mgc-paper-cute-fi" />,
    className: "text-accent",
    peerClassName: "peer-checked:text-accent dark:peer-checked:text-accent",
    translation: "title,description",
    view: FeedViewType.Articles,
  },
  {
    name: "feed_view_type.social_media",
    icon: <i className="i-mgc-twitter-cute-fi" />,
    className: "text-sky-600 dark:text-sky-500",
    peerClassName: "peer-checked:text-sky-600 peer-checked:dark:text-sky-500",
    wideMode: true,
    translation: "content",
    view: FeedViewType.SocialMedia,
  },
  {
    name: "feed_view_type.pictures",
    icon: <i className="i-mgc-pic-cute-fi" />,
    className: "text-green-600 dark:text-green-500",
    peerClassName: "peer-checked:text-green-600 peer-checked:dark:text-green-500",
    gridMode: true,
    wideMode: true,
    translation: "title",
    view: FeedViewType.Pictures,
  },
  {
    name: "feed_view_type.videos",
    icon: <i className="i-mgc-video-cute-fi" />,
    className: "text-red-600 dark:text-red-500",
    peerClassName: "peer-checked:text-red-600 peer-checked:dark:text-red-500",
    gridMode: true,
    wideMode: true,
    translation: "title",
    view: FeedViewType.Videos,
  },
  {
    name: "feed_view_type.audios",
    icon: <i className="i-mgc-mic-cute-fi" />,
    className: "text-purple-600 dark:text-purple-500",
    peerClassName: "peer-checked:text-purple-600 peer-checked:dark:text-purple-500",
    translation: "title",
    view: FeedViewType.Audios,
  },
  {
    name: "feed_view_type.notifications",
    icon: <i className="i-mgc-announcement-cute-fi" />,
    className: "text-yellow-600 dark:text-yellow-500",
    peerClassName: "peer-checked:text-yellow-600 peer-checked:dark:text-yellow-500",
    translation: "title",
    view: FeedViewType.Notifications,
  },
]
