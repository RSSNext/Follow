const OpenInBrowser = (_t?: any) =>
  window.electron ? "Open in browser" : "Open in new tab"

export const COPY_MAP = {
  OpenInBrowser,
}
