import type MarkdownIt from "markdown-it"
import type { RenderRule } from "markdown-it/lib/renderer.mjs"
import container from "markdown-it-container"
/** @copy vuejs/vitepress/src/node/markdown/plugins/containers.ts */
type ContainerArgs = [typeof container, string, { render: RenderRule }]

export function createContainer(
  klass: string,
  defaultTitle: string,
  getMd: () => MarkdownIt,
): ContainerArgs {
  return [
    container,
    klass,
    {
      render(tokens, idx, _options, env: { references?: any }) {
        const md = getMd()
        const token = tokens[idx]
        const info = token.info.trim().slice(klass.length).trim()
        const attrs = md.renderer.renderAttrs(token)
        if (token.nesting === 1) {
          const title = md.renderInline(info || defaultTitle, {
            references: env.references,
          })
          if (klass === "details") { return `<details class="${klass} custom-block"${attrs}><summary>${title}</summary>\n` }
          return `<div class="${klass} custom-block"${attrs}><p class="custom-block-title">${title}</p>\n`
        } else { return klass === "details" ? `</details>\n` : `</div>\n` }
      },
    },
  ]
}
