import {
  setGeneralSetting,
  useGeneralSettingSelector,
  useGeneralSettingValue,
} from "@renderer/atoms/settings/general"
import { createSetting } from "@renderer/atoms/settings/helper"
import {
  createDefaultSettings,
  setUISetting,
  useUISettingSelector,
} from "@renderer/atoms/settings/ui"
import { Button } from "@renderer/components/ui/button"
import { useModalStack } from "@renderer/components/ui/modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { currentSupportedLanguages, fallbackLanguage } from "@renderer/i18n"
import { initPostHog } from "@renderer/initialize/posthog"
import { tipcClient } from "@renderer/lib/client"
import { clearLocalPersistStoreData } from "@renderer/store/utils/clear"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { SettingsTitle } from "../title"

const { defineSettingItem, SettingBuilder } = createSetting(
  useGeneralSettingValue,
  setGeneralSetting,
)
export const SettingGeneral = () => {
  const { t } = useTranslation("settings")
  useEffect(() => {
    tipcClient?.getLoginItemSettings().then((settings) => {
      setGeneralSetting("appLaunchOnStartup", settings.openAtLogin)
    })
  }, [])

  const saveLoginSetting = useCallback((checked: boolean) => {
    tipcClient?.setLoginItemSettings(checked)

    setGeneralSetting("appLaunchOnStartup", checked)
  }, [])

  const { present } = useModalStack()

  return (
    <>
      <SettingsTitle />
      <div className="mt-4">
        <SettingBuilder
          settings={[
            {
              type: "title",
              value: t("settings:general.app"),
            },

            defineSettingItem("appLaunchOnStartup", {
              label: t("settings:general.launch_at_login"),
              disabled: !tipcClient,
              onChange(value) {
                saveLoginSetting(value)
              },
            }),
            LanguageSelector,
            {
              type: "title",
              value: t("settings:general.timeline"),
            },
            defineSettingItem("unreadOnly", {
              label: t("settings:general.show_unread_on_launch.label"),
              description: t("settings:general.show_unread_on_launch.description"),
            }),
            defineSettingItem("groupByDate", {
              label: t("settings:general.group_by_date.label"),
              description: t("settings:general.group_by_date.description"),
            }),

            { type: "title", value: "unread" },

            defineSettingItem("scrollMarkUnread", {
              label: t("settings:general.mark_as_read.scroll.label"),
              description: t("settings:general.mark_as_read.scroll.description"),
            }),
            defineSettingItem("hoverMarkUnread", {
              label: t("settings:general.mark_as_read.hover.label"),
              description: t("settings:general.mark_as_read.hover.description"),
            }),
            defineSettingItem("renderMarkUnread", {
              label: t("settings:general.mark_as_read.render.label"),
              description: t("settings:general.mark_as_read.render.description"),
            }),

            { type: "title", value: "TTS", disabled: !window.electron },

            window.electron && VoiceSelector,

            // { type: "title", value: "Secure" },
            // defineSettingItem("jumpOutLinkWarn", {
            //   label: "Warn when opening external links",
            //   description: "When you open an untrusted external link, you need to make sure that you open the link.",
            // }),
            {
              type: "title",
              value: t("settings:general.privacy_data"),
            },

            defineSettingItem("dataPersist", {
              label: t("settings:general.data_persist.label"),
              description: t("settings:general.data_persist.description"),
            }),

            defineSettingItem("sendAnonymousData", {
              label: t("settings:general.send_anonymous_data.label"),
              description: t("settings:general.send_anonymous_data.description"),
              onChange(value) {
                setGeneralSetting("sendAnonymousData", value)
                if (value) {
                  initPostHog()
                } else {
                  window.posthog?.reset()
                  delete window.posthog
                }
              },
            }),
            {
              label: t("settings:general.rebuild_database.label"),
              action: async () => {
                present({
                  title: t("settings:general.rebuild_database.title"),
                  clickOutsideToDismiss: true,
                  content: () => (
                    <div className="text-sm">
                      <p>{t("settings:general.rebuild_database.warning.line1")}</p>
                      <p>{t("settings:general.rebuild_database.warning.line2")}</p>
                      <div className="mt-4 flex justify-end">
                        <Button
                          className="px-3 text-red-500"
                          variant="ghost"
                          onClick={async () => {
                            await clearLocalPersistStoreData()
                            window.location.reload()
                          }}
                        >
                          Yes
                        </Button>
                      </div>
                    </div>
                  ),
                })
              },
              description: t("settings:general.rebuild_database.description"),
              buttonText: t("settings:general.rebuild_database.button"),
            },
          ]}
        />
      </div>
    </>
  )
}

export const VoiceSelector = () => {
  const { t } = useTranslation()

  const { data } = useQuery({
    queryFn: () => tipcClient?.getVoices(),
    queryKey: ["voices"],
  })
  const voice = useUISettingSelector((state) => state.voice)

  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">{t("settings:general.voices")}</span>
      <Select
        defaultValue={createDefaultSettings().voice}
        value={voice}
        onValueChange={(value) => {
          setUISetting("voice", value)
        }}
      >
        <SelectTrigger size="sm" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="h-64">
          {data?.map((item) => (
            <SelectItem key={item.ShortName} value={item.ShortName}>
              {item.FriendlyName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation()
  const { t: langT } = useTranslation("lang")
  const language = useGeneralSettingSelector((state) => state.language)

  const finalRenderLanguage = currentSupportedLanguages.includes(language)
    ? language
    : fallbackLanguage
  return (
    <div className="mb-3 mt-4 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">{t("settings:general.language")}</span>
      <Select
        defaultValue={finalRenderLanguage}
        value={finalRenderLanguage}
        onValueChange={(value) => {
          setGeneralSetting("language", value as string)
          i18n.changeLanguage(value as string)
        }}
      >
        <SelectTrigger size="sm" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {currentSupportedLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {langT(`langs.${lang}` as any)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
