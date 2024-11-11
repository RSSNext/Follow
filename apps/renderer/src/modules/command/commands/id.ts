export const COMMAND_ID = {
  entry: {
    Tip: "entry:tip",
    star: "entry:star",
    unstar: "entry:unstar",
    delete: "entry:delete",
    copyLink: "entry:copy-link",
    copyTitle: "entry:copy-title",
    openInBrowser: "entry:open-in-browser",
    viewSourceContent: "entry:view-source-content",
    viewEntryContent: "entry:view-entry-content",
    share: "entry:share",
    read: "entry:read",
    unread: "entry:unread",
  },
  integration: {
    saveToEagle: "integration:save-to-eagle",
    saveToReadwise: "integration:save-to-readwise",
    saveToInstapaper: "integration:save-to-instapaper",
    saveToOmnivore: "integration:save-to-omnivore",
    saveToObsidian: "integration:save-to-obsidian",
    saveToOutline: "integration:save-to-outline",
  },
  list: {
    edit: "list:edit",
    unfollow: "list:unfollow",
    navigateTo: "list:navigate-to",
    openInBrowser: "list:open-in-browser",
    copyUrl: "list:copy-url",
    copyId: "list:copy-id",
  },
  theme: {
    toAuto: "follow:change-color-mode-to-auto",
    toDark: "follow:change-color-mode-to-dark",
    toLight: "follow:change-color-mode-to-light",
  },
} as const

// Helper type to extract all command IDs
type ExtractCommandIds<T> = {
  [K in keyof T]: T[K][keyof T[K]]
}[keyof T]

// Define CommandId as a union of all command ID strings
export type CommandId = ExtractCommandIds<typeof COMMAND_ID>
