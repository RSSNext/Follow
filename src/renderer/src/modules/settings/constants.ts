import type { SettingPageConfig } from "./utils"

function getSettings() {
  const map = import.meta.glob("../../pages/settings/\\(settings\\)/*", { eager: true })

  const settings = [] as {
    name: I18nKeysForSettings
    iconName: string
    path: string
    Component: () => JSX.Element
    priority: number
    loader: () => SettingPageConfig
  }[]
  for (const path in map) {
    const p = path.split("/").pop()?.replace(".tsx", "").replace("(settings)", "")!

    if (p === "index" || p === "layout") continue

    const Module = map[path] as {
      Component: () => JSX.Element
      loader: () => SettingPageConfig
    }

    if (!Module.loader) continue
    settings.push({
      ...Module.loader(),
      Component: Module.Component,
      loader: Module.loader,
      path: p,
    })
  }

  return settings.sort((a, b) => a.priority - b.priority)
}

export const settings = /* #__PURE__ */ getSettings()
