import { Divider } from "@follow/components/ui/divider/index.js"
import {
  SimpleIconsEagle,
  SimpleIconsInstapaper,
  SimpleIconsObsidian,
  SimpleIconsOmnivore,
  SimpleIconsReadwise,
} from "@follow/components/ui/platform-icon/icons.js"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { setIntegrationSetting, useIntegrationSettingValue } from "~/atoms/settings/integration"

import { createSetting } from "../helper/builder"
import { useSetSettingCanSync } from "../modal/hooks"

const { defineSettingItem, SettingBuilder } = createSetting(
  useIntegrationSettingValue,
  setIntegrationSetting,
)
export const SettingIntegration = () => {
  const { t } = useTranslation("settings")
  const setSync = useSetSettingCanSync()
  useEffect(() => {
    setSync(false)
    return () => {
      setSync(true)
    }
  }, [setSync])
  return (
    <div className="mt-4">
      <SettingBuilder
        settings={[
          {
            type: "title",
            value: (
              <span className="flex items-center gap-2 font-bold">
                <SimpleIconsEagle />
                {t("integration.eagle.title")}
              </span>
            ),
          },
          defineSettingItem("enableEagle", {
            label: t("integration.eagle.enable.label"),
            description: t("integration.eagle.enable.description"),
          }),
          {
            type: "title",
            value: (
              <span className="flex items-center gap-2 font-bold">
                <SimpleIconsReadwise />
                {t("integration.readwise.title")}
              </span>
            ),
          },
          defineSettingItem("enableReadwise", {
            label: t("integration.readwise.enable.label"),
            description: t("integration.readwise.enable.description"),
          }),
          defineSettingItem("readwiseToken", {
            label: t("integration.readwise.token.label"),
            vertical: true,
            type: "password",
            description: (
              <>
                {t("integration.readwise.token.description")}{" "}
                <a
                  target="_blank"
                  className="underline"
                  rel="noreferrer noopener"
                  href="https://readwise.io/access_token"
                >
                  readwise.io/access_token
                </a>
                .
              </>
            ),
          }),
          {
            type: "title",
            value: (
              <span className="flex items-center gap-2 font-bold">
                <SimpleIconsInstapaper />
                {t("integration.instapaper.title")}
              </span>
            ),
          },
          defineSettingItem("enableInstapaper", {
            label: t("integration.instapaper.enable.label"),
            description: t("integration.instapaper.enable.description"),
          }),
          defineSettingItem("instapaperUsername", {
            label: t("integration.instapaper.username.label"),
            componentProps: {
              labelClassName: "w-[150px]",
            },
          }),
          defineSettingItem("instapaperPassword", {
            label: t("integration.instapaper.password.label"),
            type: "password",
            componentProps: {
              labelClassName: "w-[150px]",
            },
          }),
          {
            type: "title",
            value: (
              <span className="flex items-center gap-2 font-bold">
                <SimpleIconsOmnivore />
                {t("integration.omnivore.title")}
              </span>
            ),
          },
          defineSettingItem("enableOmnivore", {
            label: t("integration.omnivore.enable.label"),
            description: t("integration.omnivore.enable.description"),
          }),
          defineSettingItem("omnivoreEndpoint", {
            label: t("integration.omnivore.endpoint.label"),
            vertical: true,
            description: (
              <>
                {t("integration.omnivore.endpoint.description")}{" "}
                <a
                  target="_blank"
                  className="underline"
                  rel="noreferrer noopener"
                  href="https://api-prod.omnivore.app/api/graphql"
                >
                  https://api-prod.omnivore.app/api/graphql
                </a>
                .
              </>
            ),
          }),
          defineSettingItem("omnivoreToken", {
            label: t("integration.omnivore.token.label"),
            vertical: true,
            type: "password",
            description: (
              <>
                {t("integration.omnivore.token.description")}{" "}
                <a
                  target="_blank"
                  className="underline"
                  rel="noreferrer noopener"
                  href="https://omnivore.app/settings/api"
                >
                  omnivore.app/settings/api
                </a>
                .
              </>
            ),
          }),
          {
            type: "title",
            value: (
              <span className="flex items-center gap-2 font-bold">
                <SimpleIconsObsidian />
                {t("integration.obsidian.title")}
              </span>
            ),
          },
          defineSettingItem("enableObsidian", {
            label: t("integration.obsidian.enable.label"),
            description: t("integration.obsidian.enable.description"),
          }),
          defineSettingItem("obsidianVaultPath", {
            label: t("integration.obsidian.vaultPath.label"),
            vertical: true,
            description: t("integration.obsidian.vaultPath.description"),
          }),

          BottomTip,
        ]}
      />
    </div>
  )
}

const BottomTip = () => {
  const { t } = useTranslation("settings")
  return (
    <div className="mt-6">
      <Divider />
      <p className="opacity-60">
        <small>{t("integration.tip")}</small>
      </p>
    </div>
  )
}
