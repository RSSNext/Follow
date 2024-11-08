export const RSSHubCategoryOptions: {
  name: string
  value: string
}[] = [
  {
    name: "All",
    value: "all",
  },
  {
    name: "Social Media",
    value: "social-media",
  },
  {
    name: "New Media",
    value: "new-media",
  },
  {
    name: "News",
    value: "traditional-media",
  },
  {
    name: "BBS",
    value: "bbs",
  },
  {
    name: "Blog",
    value: "blog",
  },
  {
    name: "Programming",
    value: "programming",
  },
  {
    name: "Design",
    value: "design",
  },
  {
    name: "Live",
    value: "live",
  },
  {
    name: "Multimedia",
    value: "multimedia",
  },
  {
    name: "Picture",
    value: "picture",
  },
  {
    name: "ACG",
    value: "anime",
  },
  {
    name: "Application Updates",
    value: "program-update",
  },
  {
    name: "University",
    value: "university",
  },
  {
    name: "Forecast",
    value: "forecast",
  },
  {
    name: "Travel",
    value: "travel",
  },
  {
    name: "Shopping",
    value: "shopping",
  },
  {
    name: "Gaming",
    value: "game",
  },
  {
    name: "Reading",
    value: "reading",
  },
  {
    name: "Government",
    value: "government",
  },
  {
    name: "Study",
    value: "study",
  },
  {
    name: "Scientific Journal",
    value: "journal",
  },
  {
    name: "Finance",
    value: "finance",
  },
]

export const RSSHubCategoryMap: Record<string, string> = Object.fromEntries(
  RSSHubCategoryOptions.map((item) => [item.value, item.name]),
)
