export function buildSeoMetaTags(configs: {
  openGraph: {
    title: string
    description?: string
    image?: string | null
  }
}) {
  const { openGraph } = configs
  const title = `${openGraph.title} | Follow`
  return [
    `<meta property="og:title" content="${title}" />`,
    openGraph.description
      ? `<meta property="og:description" content="${openGraph.description}" />`
      : "",
    openGraph.image ? `<meta property="og:image" content="${openGraph.image}" />` : "",
    // Twitter
    `<meta property="twitter:card" content="summary_large_image" />`,
    `<meta property="twitter:title" content="${title}" />`,
    openGraph.description
      ? `<meta property="twitter:description" content="${openGraph.description}" />`
      : "",
    openGraph.image ? `<meta property="twitter:image" content="${openGraph.image}" />` : "",
  ].join("\n")
}
