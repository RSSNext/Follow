export interface GeneralSettings {
  appLaunchOnStartup: boolean
  language: string
  dataPersist: boolean
  sendAnonymousData: boolean
  unreadOnly: boolean
  scrollMarkUnread: boolean
  hoverMarkUnread: boolean
  renderMarkUnread: boolean
  groupByDate: boolean
  jumpOutLinkWarn: boolean
  // TTS
  voice: string
}

export interface UISettings {
  entryColWidth: number
  feedColWidth: number
  opaqueSidebar: boolean
  sidebarShowUnreadCount: boolean
  hideExtraBadge: boolean
  uiTextSize: number
  showDockBadge: boolean
  modalOverlay: boolean
  modalDraggable: boolean
  modalOpaque: boolean
  reduceMotion: boolean
  usePointerCursor: boolean | null
  uiFontFamily: string
  readerFontFamily: string
  readerRenderInlineStyle: boolean
  codeHighlightThemeLight: string
  codeHighlightThemeDark: string
  guessCodeLanguage: boolean
  hideRecentReader: boolean

  // view
  pictureViewMasonry: boolean
  pictureViewFilterNoImage: boolean
  wideMode: boolean
}

export interface IntegrationSettings {
  // eagle
  enableEagle: boolean

  // readwise
  enableReadwise: boolean
  readwiseToken: string

  // instapaper
  enableInstapaper: boolean
  instapaperUsername: string
  instapaperPassword: string

  // omnivore
  enableOmnivore: boolean
  omnivoreEndpoint: string
  omnivoreToken: string

  // obsidian
  enableObsidian: boolean
  obsidianVaultPath: string
}
