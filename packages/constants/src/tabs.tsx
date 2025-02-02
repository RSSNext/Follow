import * as React from "react"

import { FeedViewType } from "./enums"

interface ViewDefinition {
  name: string
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
]
