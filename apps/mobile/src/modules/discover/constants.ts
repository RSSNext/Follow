export enum SearchType {
  Feed = "feed",
  List = "list",
  User = "user",
  RSSHub = "rsshub",
}

export const SearchTabs = [
  { name: "Feed", value: SearchType.Feed },
  { name: "List", value: SearchType.List },
  { name: "User", value: SearchType.User },
  { name: "RSSHub", value: SearchType.RSSHub },
]
