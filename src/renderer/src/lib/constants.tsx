export const levels = {
  view: "view",
  folder: "folder",
  feed: "feed",
  entry: "entry",
};

export const views = [
  {
    name: "Articles",
    icon: <i className="i-mingcute-news-fill" />,
    className: "text-amber-700",
  },
  {
    name: "Social Media",
    icon: <i className="i-mingcute-twitter-fill" />,
    className: "text-sky-600",
    wideMode: true,
  },
  {
    name: "Pictures",
    icon: <i className="i-mingcute-pic-fill" />,
    className: "text-green-600",
    gridMode: true,
    wideMode: true,
  },
  {
    name: "Videos",
    icon: <i className="i-mingcute-youtube-fill" />,
    className: "text-red-600",
    gridMode: true,
    wideMode: true,
  },
  {
    name: "Audios",
    icon: <i className="i-mingcute-headphone-fill" />,
    className: "text-purple-600",
  },
  {
    name: "Notifications",
    icon: <i className="i-mingcute-notification-fill" />,
    className: "text-yellow-600",
  },
];
