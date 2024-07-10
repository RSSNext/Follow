export type RendererHandlers = {
  invalidateQuery: (key: (string | number | undefined)[]) => void
  updateDownloaded: () => void
}
