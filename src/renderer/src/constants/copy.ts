const OpenInBrowser = (_t?: any) =>
  window.electron ? "keys.entry.openInBrowser" : "keys.entry.openInNewTab"

export const COPY_MAP = {
  OpenInBrowser,
}
