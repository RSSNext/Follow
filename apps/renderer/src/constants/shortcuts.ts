import { COPY_MAP } from "~/constants"

export const shortcuts = {
  feeds: {
    add: {
      name: "keys.feeds.add",
      key: "Meta+T",
    },
    switchToView: {
      name: "keys.feeds.switchToView",
      key: "1, 2, 3, 4, 5, 6",
    },
    switchBetweenViews: {
      name: "keys.feeds.switchBetweenViews",
      key: "Tab, Left, Right",
    },
  },
  layout: {
    toggleSidebar: {
      name: "keys.layout.toggleSidebar",
      key: "Meta+B",
    },
    showShortcuts: {
      name: "keys.layout.showShortcuts",
      key: "H",
    },
  },
  entries: {
    refetch: {
      name: "keys.entries.refetch",
      key: "R",
    },
    previous: {
      name: "keys.entries.previous",
      key: "K, Up",
    },
    next: {
      name: "keys.entries.next",
      key: "J, Down",
    },
    markAllAsRead: {
      name: "keys.entries.markAllAsRead",
      key: "Shift+Meta+A",
    },
    toggleUnreadOnly: {
      name: "keys.entries.toggleUnreadOnly",
      key: "U",
    },
  },
  entry: {
    toggleRead: {
      name: "keys.entry.toggleRead",
      key: "M",
    },
    toggleStarred: {
      name: "keys.entry.toggleStarred",
      key: "S",
    },
    openInBrowser: {
      name: COPY_MAP.OpenInBrowser(),
      key: "B",
      extra: "Double Click",
    },
    tts: {
      name: "keys.entry.tts",
      key: "Shift+Meta+V",
    },
    copyLink: {
      name: "keys.entry.copyLink",
      key: "Shift+Meta+C",
    },
    tip: {
      name: "keys.entry.tip",
      key: "Shift+Meta+T",
    },
    share: {
      name: "keys.entry.share",
      key: "Meta+Alt+S",
    },
    scrollUp: {
      name: "keys.entry.scrollUp",
      key: "PageUp",
    },
    scrollDown: {
      name: "keys.entry.scrollDown",
      key: "PageDown",
    },
  },
  audio: {
    "play/pause": {
      name: "keys.audio.playPause",
      key: "Space",
    },
  },
} as const
