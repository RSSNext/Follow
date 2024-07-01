import { getStorageNS } from "./ns"

export const levels = {
  view: "view",
  folder: "folder",
  feed: "feed",
  entry: "entry",
}

export const views = [
  {
    name: "Articles",
    icon: <i className="i-mgc-paper-cute-fi" />,
    className: "text-orange-600",
    translation: "title,description",
  },
  {
    name: "Social Media",
    icon: <i className="i-mgc-twitter-cute-fi" />,
    className: "text-sky-600",
    wideMode: true,
    translation: "description",
  },
  {
    name: "Pictures",
    icon: <i className="i-mgc-pic-cute-fi" />,
    className: "text-green-600",
    gridMode: true,
    wideMode: true,
    translation: "title",
  },
  {
    name: "Videos",
    icon: <i className="i-mgc-video-cute-fi" />,
    className: "text-red-600",
    gridMode: true,
    wideMode: true,
    translation: "title",
  },
  {
    name: "Audios",
    icon: <i className="i-mgc-mic-cute-fi" />,
    className: "text-purple-600",
    translation: "title",
  },
  {
    name: "Notifications",
    icon: <i className="i-mgc-announcement-cute-fi" />,
    className: "text-yellow-600",
    translation: "title",
  },
]

export const settingTabs = [
  {
    name: "General",
    path: "",
    className: "i-mgc-settings-7-cute-re",
  },
  {
    name: "Actions",
    path: "actions",
    className: "i-mgc-magic-2-cute-re",
  },
  {
    name: "Shortcuts",
    path: "shortcuts",
    className: "i-mgc-hotkey-cute-re",
  },
  {
    name: "Profile",
    path: "profile",
    className: "i-mgc-user-setting-cute-re",
  },
]

/// App
export const APP_NAME = "Follow"
/// Feed
export const FEED_COLLECTION_LIST = "collections"
/// Local storage keys
export const QUERY_PERSIST_KEY = getStorageNS("REACT_QUERY_OFFLINE_CACHE")

/// Route Keys
export const ROUTE_FEED_PENDING = "pending"
