import { getStorageNS } from "@follow/utils/ns"
import { repository } from "@pkg"
import { createElement } from "react"
import { toast } from "sonner"

import { appLog } from "~/lib/log"

import { waitAppReady } from "../queue"

const appVersionKey = getStorageNS("app_version")

export const doMigration = () => {
  const lastVersion = localStorage.getItem(appVersionKey)

  if (lastVersion && lastVersion !== APP_VERSION) {
    appLog(`Upgrade from ${lastVersion} to ${APP_VERSION}`)

    waitAppReady(() => {
      toast.success(
        // `App is upgraded to ${APP_VERSION}, enjoy the new features! 🎉`,
        createElement("div", {
          children: [
            "App is upgraded to ",
            createElement(
              "a",
              {
                href: `${repository.url}/releases/tag/${APP_VERSION}`,
                target: "_blank",
                className: "underline",
              },
              createElement("strong", {
                children: APP_VERSION,
              }),
            ),
            ", enjoy the new features! 🎉",
          ],
        }),
      )
    }, 1000)

    // NOTE: Add migration logic here
  }
  localStorage.setItem(appVersionKey, APP_VERSION)
}
