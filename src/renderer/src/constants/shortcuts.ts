import { COPY_MAP } from "@renderer/constants"

export const shortcuts = {
  feeds: {
    add: {
      name: "Add Subscription",
      key: "Meta+T",
    },
    switchToView: {
      name: "Switch to View",
      key: "1, 2, 3, 4, 5, 6",
    },
    switchBetweenViews: {
      name: "Switch Between Views",
      key: "Tab, Left, Right",
    },
  },
  layout: {
    toggleSidebar: {
      name: "Show/Hide Feed Sidebar",
      key: "Meta+B",
    },
  },
  entries: {
    refetch: {
      name: "Refetch",
      key: "R",
    },
    previous: {
      name: "Previous Entry",
      key: "K, Up",
    },
    next: {
      name: "Next Entry",
      key: "J, Down",
    },
    markAllAsRead: {
      name: "Mark All as Read",
      key: "Shift+Meta+A",
    },
    toggleUnreadOnly: {
      name: "Toggle Unread Only",
      key: "U",
    },
  },
  entry: {
    toggleRead: {
      name: "Toggle Read",
      key: "M",
    },
    toggleStarred: {
      name: "Toggle Starred",
      key: "S",
    },
    openInBrowser: {
      name: COPY_MAP.OpenInBrowser(),
      key: "B",
      extra: "Double Click",
    },
    tts: {
      name: "Play TTS",
      key: "Shift+Meta+V",
    },
    copyLink: {
      name: "Copy Link",
      key: "Shift+Meta+C",
    },
    tip: {
      name: "Tip Power",
      key: "Shift+Meta+T",
    },
    share: {
      name: "Share",
      key: "Meta+Alt+S",
    },
    scrollUp: {
      name: "Scroll Up",
      key: "PageUp",
    },
    scrollDown: {
      name: "Scroll Down",
      key: "PageDown",
    },
  },

  audio: {
    "play/pause": {
      name: "Play/Pause (When the audio player is open)",
      key: "Space",
    },
  },
} as const
