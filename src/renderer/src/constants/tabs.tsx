import { FeedViewType } from "@renderer/lib/enum"

export const views = [
  {
    name: "Articles",
    icon: <i className="i-mgc-paper-cute-fi" />,
    className: "text-orange-600",
    translation: "title,description",
    view: FeedViewType.Articles,
  },
  {
    name: "Social Media",
    icon: <i className="i-mgc-twitter-cute-fi" />,
    className: "text-sky-600",
    wideMode: true,
    translation: "description",
    view: FeedViewType.SocialMedia,
  },
  {
    name: "Pictures",
    icon: <i className="i-mgc-pic-cute-fi" />,
    className: "text-green-600",
    gridMode: true,
    wideMode: true,
    translation: "title",
    view: FeedViewType.Pictures,
  },
  {
    name: "Videos",
    icon: <i className="i-mgc-video-cute-fi" />,
    className: "text-red-600",
    gridMode: true,
    wideMode: true,
    translation: "title",
    view: FeedViewType.Videos,
  },
  {
    name: "Audios",
    icon: <i className="i-mgc-mic-cute-fi" />,
    className: "text-purple-600",
    translation: "title",
    view: FeedViewType.Audios,
  },
  {
    name: "Notifications",
    icon: <i className="i-mgc-announcement-cute-fi" />,
    className: "text-yellow-600",
    translation: "title",
    view: FeedViewType.Notifications,
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
