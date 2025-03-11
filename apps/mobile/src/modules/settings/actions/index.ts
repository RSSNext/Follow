export const filterFieldOptions = [
  {
    label: "Subscription View",
    value: "view",
    type: "view",
  },
  {
    label: "Feed Title",
    value: "title",
  },
  {
    label: "Feed Category",
    value: "category",
  },
  {
    label: "Site URL",
    value: "site_url",
  },
  {
    label: "Feed URL",
    value: "feed_url",
  },
  {
    label: "Entry Title",
    value: "entry_title",
  },
  {
    label: "Entry Content",
    value: "entry_content",
  },
  {
    label: "Entry URL",
    value: "entry_url",
  },
  {
    label: "Entry Author",
    value: "entry_author",
  },
  {
    label: "Entry Media Length",
    value: "entry_media_length",
    type: "number",
  },
]

export const filterOperatorOptions = [
  {
    label: "contains",
    value: "contains",
    types: ["text"],
  },
  {
    label: "does not contain",
    value: "not_contains",
    types: ["text"],
  },
  {
    label: "is equal to",
    value: "eq",
    types: ["number", "text", "view"],
  },
  {
    label: "is not equal to",
    value: "not_eq",
    types: ["number", "text", "view"],
  },
  {
    label: "is greater than",
    value: "gt",
    types: ["number"],
  },
  {
    label: "is less than",
    value: "lt",
    types: ["number"],
  },
  {
    label: "matches regex",
    value: "regex",
    types: ["text"],
  },
]
