export const shortcuts = {
  feeds: {
    // previous: {
    //   name: "Previous Subscription",
    //   key: "P",
    // },
    // next: {
    //   name: "Next Subscription",
    //   key: "N",
    // },
    // toggleFolder: {
    //   name: "Toggle Folder",
    //   key: "X",
    // },
    add: {
      name: "Add Subscription",
      key: "Meta+T",
    },
    switchToView: {
      name: "Switch View",
      key: "1, 2, 3, 4, 5, 6",
    },
    switchBetweenViews: {
      name: "Switch Between Views",
      key: "Left, Right",
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
      key: "A",
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
      name: "Open in Browser",
      key: "B",
    },
    copyLink: {
      name: "Copy Link",
      key: "Meta+Shift+C",
    },
    tip: {
      name: "Tip Power",
      key: "Meta+Shift+T",
    },
  },
} as const
