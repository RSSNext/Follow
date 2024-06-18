import { buildStorageNS } from "./ns"

export const levels = {
  view: "view",
  folder: "folder",
  feed: "feed",
  entry: "entry",
}

export const views = [
  {
    name: "Articles",
    icon: <i className="i-mingcute-news-fill" />,
    className: "text-amber-700",
    translation: "title,description",
  },
  {
    name: "Social Media",
    icon: <i className="i-mingcute-twitter-fill" />,
    className: "text-sky-600",
    wideMode: true,
    translation: "description",
  },
  {
    name: "Pictures",
    icon: <i className="i-mingcute-pic-fill" />,
    className: "text-green-600",
    gridMode: true,
    wideMode: true,
    translation: "title",
  },
  {
    name: "Videos",
    icon: <i className="i-mingcute-youtube-fill" />,
    className: "text-red-600",
    gridMode: true,
    wideMode: true,
    translation: "title",
  },
  {
    name: "Audios",
    icon: <i className="i-mingcute-headphone-fill" />,
    className: "text-purple-600",
    translation: "title",
  },
  {
    name: "Notifications",
    icon: <i className="i-mingcute-notification-fill" />,
    className: "text-yellow-600",
    translation: "title",
  },
]

export const settingTabs = [
  {
    name: "General",
    path: "",
    className: "i-mingcute-settings-7-line",
  },
  {
    name: "Actions",
    path: "actions",
    className: "i-mingcute-bling-line",
  },
  {
    name: "Profile",
    path: "profile",
    className: "i-mingcute-user-setting-line",
  },
]

////
export const APP_NAME = "Follow"
/// Feed
export const FEED_COLLECTION_LIST = "collections"
/// Local storage keys
export const QUERY_PERSIST_KEY = buildStorageNS("REACT_QUERY_OFFLINE_CACHE")
