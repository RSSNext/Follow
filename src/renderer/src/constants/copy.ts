const OpenInBrowser = (_t?: any) =>
  window.electron ? "Open in Browser" : "Open in New Tab"

export const COPY_MAP = {
  OpenInBrowser,
}
