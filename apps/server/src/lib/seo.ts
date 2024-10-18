export function buildSeoMetaTags(configs: {
  openGraph: {
    title: string
    description?: string
    image?: string | null
  }
}) {
  const { openGraph } = configs
  return [
    `<meta property="og:title" content="${openGraph.title}" />`,
    openGraph.description
      ? `<meta property="og:description" content="${openGraph.description}" />`
      : "",
    openGraph.image ? `<meta property="og:image" content="${openGraph.image}" />` : "",
    // Twitter
    `<meta property="twitter:card" content="summary_large_image" />`,
    `<meta property="twitter:title" content="${openGraph.title}" />`,
    openGraph.description
      ? `<meta property="twitter:description" content="${openGraph.description}" />`
      : "",
    openGraph.image ? `<meta property="twitter:image" content="${openGraph.image}" />` : "",
  ]
}
