import { COPY_MAP } from "@renderer/constants"

export const shortcuts = {
  feeds: {
    add: {
      name: "settings.shortcuts.keys.feeds.add",
      key: "Meta+T",
    },
    switchToView: {
      name: "settings.shortcuts.keys.feeds.switchToView",
      key: "1, 2, 3, 4, 5, 6",
    },
    switchBetweenViews: {
      name: "settings.shortcuts.keys.feeds.switchBetweenViews",
      key: "Tab, Left, Right",
    },
  },
  layout: {
    toggleSidebar: {
      name: "settings.shortcuts.keys.layout.toggleSidebar",
      key: "Meta+B",
    },
    showShortcuts: {
      name: "Show Shortcuts",
      key: "H",
    },
  },
  entries: {
    refetch: {
      name: "settings.shortcuts.keys.entries.refetch",
      key: "R",
    },
    previous: {
      name: "settings.shortcuts.keys.entries.previous",
      key: "K, Up",
    },
    next: {
      name: "settings.shortcuts.keys.entries.next",
      key: "J, Down",
    },
    markAllAsRead: {
      name: "settings.shortcuts.keys.entries.markAllAsRead",
      key: "Shift+Meta+A",
    },
    toggleUnreadOnly: {
      name: "settings.shortcuts.keys.entries.toggleUnreadOnly",
      key: "U",
    },
  },
  entry: {
    toggleRead: {
      name: "settings.shortcuts.keys.entry.toggleRead",
      key: "M",
    },
    toggleStarred: {
      name: "settings.shortcuts.keys.entry.toggleStarred",
      key: "S",
    },
    openInBrowser: {
      name: COPY_MAP.OpenInBrowser(),
      key: "B",
      extra: "Double Click",
    },
    tts: {
      name: "settings.shortcuts.keys.entry.tts",
      key: "Shift+Meta+V",
    },
    copyLink: {
      name: "settings.shortcuts.keys.entry.copyLink",
      key: "Shift+Meta+C",
    },
    tip: {
      name: "settings.shortcuts.keys.entry.tip",
      key: "Shift+Meta+T",
    },
    share: {
      name: "settings.shortcuts.keys.entry.share",
      key: "Meta+Alt+S",
    },
    scrollUp: {
      name: "settings.shortcuts.keys.entry.scrollUp",
      key: "PageUp",
    },
    scrollDown: {
      name: "settings.shortcuts.keys.entry.scrollDown",
      key: "PageDown",
    },
  },
  audio: {
    "play/pause": {
      name: "settings.shortcuts.keys.audio.playPause",
      key: "Space",
    },
  },
} as const
