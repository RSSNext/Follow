import { createSetting } from "@renderer/atoms/settings/helper"
import {
  setIntegrationSetting,
  useIntegrationSettingValue,
} from "@renderer/atoms/settings/integration"
import { Divider } from "@renderer/components/ui/divider"
import {
  SimpleIconsEagle,
  SimpleIconsInstapaper,
  SimpleIconsReadwise,
} from "@renderer/components/ui/platform-icon/icons"
import { useTranslation } from "react-i18next"

import { SettingsTitle } from "../title"

const { defineSettingItem, SettingBuilder } = createSetting(
  useIntegrationSettingValue,
  setIntegrationSetting,
)
export const SettingIntegration = () => {
  const { t } = useTranslation()
  return (
    <>
      <SettingsTitle />
      <div className="mt-4">
        <SettingBuilder
          settings={[
            {
              type: "title",
              value: (
                <span className="flex items-center gap-2 font-bold">
                  <SimpleIconsEagle />
                  {t("settings:integration.eagle.title")}
                </span>
              ),
            },
            defineSettingItem("enableEagle", {
              label: t("settings:integration.eagle.enable.label"),
              description: t("settings:integration.eagle.enable.description"),
            }),
            {
              type: "title",
              value: (
                <span className="flex items-center gap-2 font-bold">
                  <SimpleIconsReadwise />
                  {t("settings:integration.readwise.title")}
                </span>
              ),
            },
            defineSettingItem("enableReadwise", {
              label: t("settings:integration.readwise.enable.label"),
              description: t("settings:integration.readwise.enable.description"),
            }),
            defineSettingItem("readwiseToken", {
              label: t("settings:integration.readwise.token.label"),
              vertical: true,
              type: "password",
              description: (
                <>
                  {t("settings:integration.readwise.token.description")}{" "}
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
                  {t("settings:integration.instapaper.title")}
                </span>
              ),
            },
            defineSettingItem("enableInstapaper", {
              label: t("settings:integration.instapaper.enable.label"),
              description: t("settings:integration.instapaper.enable.description"),
            }),
            defineSettingItem("instapaperUsername", {
              label: t("settings:integration.instapaper.username.label"),
              componentProps: {
                labelClassName: "w-[150px]",
              },
            }),
            defineSettingItem("instapaperPassword", {
              label: t("settings:integration.instapaper.password.label"),
              type: "password",
              componentProps: {
                labelClassName: "w-[150px]",
              },
            }),

            BottomTip,
          ]}
        />
      </div>
    </>
  )
}

const BottomTip = () => {
  const { t } = useTranslation()
  return (
    <div className="mt-6">
      <Divider />
      <p className="opacity-60">
        <small>{t("settings:integration.tip")}</small>
      </p>
    </div>
  )
}
