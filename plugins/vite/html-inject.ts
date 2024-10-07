import type { PluginOption } from "vite"

import type { env as EnvType } from "../../packages/shared/src/env"

export function htmlInjectPlugin(env: typeof EnvType): PluginOption {
  return {
    name: "html-transform",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(
        "<!-- FOLLOW VITE BUILD INJECT -->",
        `<script id="env_injection" type="module">
      ${function injectEnv(env: any) {
        for (const key in env) {
          if (env[key] === undefined) continue
          globalThis["__followEnv"] ??= {}
          globalThis["__followEnv"][key] = env[key]
        }
      }.toString()}
      injectEnv(${JSON.stringify({
        VITE_API_URL: env.VITE_API_URL,
        VITE_WEB_URL: env.VITE_WEB_URL,
        VITE_IMGPROXY_URL: env.VITE_IMGPROXY_URL,
      })})
      </script>`,
      )
    },
  }
}
