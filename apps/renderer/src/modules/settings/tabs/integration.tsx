import { Divider } from "@follow/components/ui/divider/index.js"
import {
  SimpleIconsEagle,
  SimpleIconsInstapaper,
  SimpleIconsObsidian,
  SimpleIconsOutline,
  SimpleIconsReadeck,
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
          {
            type: "title",
            value: (
              <span className="flex items-center gap-2 font-bold">
                <SimpleIconsOutline />
                {t("integration.outline.title")}
              </span>
            ),
          },
          defineSettingItem("enableOutline", {
            label: t("integration.outline.enable.label"),
            description: t("integration.outline.enable.description"),
          }),
          defineSettingItem("outlineEndpoint", {
            label: t("integration.outline.endpoint.label"),
            vertical: true,
            description: t("integration.outline.endpoint.description"),
          }),
          defineSettingItem("outlineToken", {
            label: t("integration.outline.token.label"),
            vertical: true,
            type: "password",
            description: t("integration.outline.token.description"),
          }),
          defineSettingItem("outlineCollection", {
            label: t("integration.outline.collection.label"),
            vertical: true,
            description: t("integration.outline.collection.description"),
          }),
          {
            type: "title",
            value: (
              <span className="flex items-center gap-2 font-bold">
                <SimpleIconsReadeck />
                {t("integration.readeck.title")}
              </span>
            ),
          },
          defineSettingItem("enableReadeck", {
            label: t("integration.readeck.enable.label"),
            description: t("integration.readeck.enable.description"),
          }),
          defineSettingItem("readeckEndpoint", {
            label: t("integration.readeck.endpoint.label"),
            vertical: true,
            description: t("integration.readeck.endpoint.description"),
          }),
          defineSettingItem("readeckToken", {
            label: t("integration.readeck.token.label"),
            vertical: true,
            type: "password",
            description: t("integration.readeck.token.description"),
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
