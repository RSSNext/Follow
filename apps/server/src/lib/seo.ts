import serialize from "serialize-javascript"

function escapeHtml(unsafe?: string | null) {
  if (!unsafe) {
    return unsafe
  }

  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
    .replaceAll("/", "&#x2F;")
}

export function buildSeoMetaTags(configs: {
  openGraph: {
    title: string
    description?: string
    image?: string | null
  }
}) {
  const openGraph = {
    title: escapeHtml(configs.openGraph.title),
    description: escapeHtml(configs.openGraph.description),
    image: escapeHtml(configs.openGraph.image),
  }
  const title = `${openGraph.title} | Follow`
  return [
    `<meta property="og:title" content="${serialize(title)}" />`,
    openGraph.description
      ? `<meta property="og:description" content="${serialize(openGraph.description)}" />`
      : "",
    openGraph.image ? `<meta property="og:image" content="${serialize(openGraph.image)}" />` : "",
    // Twitter
    `<meta property="twitter:card" content="summary_large_image" />`,
    `<meta property="twitter:title" content="${serialize(title)}" />`,
    openGraph.description
      ? `<meta property="twitter:description" content="${serialize(openGraph.description)}" />`
      : "",
    openGraph.image
      ? `<meta property="twitter:image" content="${serialize(openGraph.image)}" />`
      : "",
  ].join("\n")
}
