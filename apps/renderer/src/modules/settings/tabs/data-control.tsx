import { CarbonInfinitySymbol } from "@follow/components/icons/infinify.jsx"
import { Button, MotionButtonBase } from "@follow/components/ui/button/index.js"
import { Label } from "@follow/components/ui/label/index.jsx"
import { Slider } from "@follow/components/ui/slider/index.js"
import { env } from "@follow/shared/env"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { setGeneralSetting, useGeneralSettingValue } from "~/atoms/settings/general"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { isElectronBuild } from "~/constants"
import { exportDB } from "~/database"
import { initAnalytics } from "~/initialize/analytics"
import { tipcClient } from "~/lib/client"
import { queryClient } from "~/lib/query-client"
import { clearLocalPersistStoreData } from "~/store/utils/clear"

import { SettingActionItem, SettingDescription } from "../control"
import { createSetting } from "../helper/builder"
import { SettingItemGroup } from "../section"

const { defineSettingItem, SettingBuilder } = createSetting(
  useGeneralSettingValue,
  setGeneralSetting,
)
export const SettingDataControl = () => {
  const { t } = useTranslation("settings")
  const { present } = useModalStack()

  return (
    <div className="mt-4">
      <SettingBuilder
        settings={[
          {
            type: "title",
            value: t("general.privacy"),
          },
          defineSettingItem("sendAnonymousData", {
            label: t("general.send_anonymous_data.label"),
            description: t("general.send_anonymous_data.description"),
            onChange(value) {
              setGeneralSetting("sendAnonymousData", value)
              if (value) {
                initAnalytics()
              } else {
                window.analytics?.reset()
                delete window.analytics
              }
            },
          }),

          {
            type: "title",
            value: t("general.data"),
          },
          defineSettingItem("dataPersist", {
            label: t("general.data_persist.label"),
            description: t("general.data_persist.description"),
          }),

          {
            label: t("general.rebuild_database.label"),
            action: () => {
              present({
                title: t("general.rebuild_database.title"),
                clickOutsideToDismiss: true,
                content: () => (
                  <div className="text-sm">
                    <p>{t("general.rebuild_database.warning.line1")}</p>
                    <p>{t("general.rebuild_database.warning.line2")}</p>
                    <div className="mt-4 flex justify-end">
                      <Button
                        className="bg-red-500 px-3 text-white"
                        onClick={async () => {
                          await clearLocalPersistStoreData()
                          window.location.reload()
                        }}
                      >
                        {t("ok", { ns: "common" })}
                      </Button>
                    </div>
                  </div>
                ),
              })
            },
            description: t("general.rebuild_database.description"),
            buttonText: t("general.rebuild_database.button"),
          },
          {
            label: t("general.export_database.label"),
            description: t("general.export_database.description"),
            buttonText: t("general.export_database.button"),
            action: () => {
              exportDB()
            },
          },
          {
            label: t("general.export.label"),
            description: t("general.export.description"),
            buttonText: t("general.export.button"),
            action: () => {
              const link = document.createElement("a")
              link.href = `${env.VITE_API_URL}/subscriptions/export`
              link.download = "follow.opml"
              link.click()
            },
          },

          isElectronBuild && {
            type: "title",
            value: t("general.cache"),
          },
          isElectronBuild && AppCacheLimit,
          isElectronBuild && CleanCache,
          isElectronBuild && {
            type: "title",
            value: t("general.data_file.label"),
          },
          isElectronBuild && {
            label: t("general.log_file.label"),
            description: t("general.log_file.description"),
            buttonText: t("general.log_file.button"),
            action: () => {
              tipcClient?.revealLogFile()
            },
          },
        ]}
      />
    </div>
  )
}
const CleanCache = () => {
  const { t } = useTranslation("settings")

  return (
    <SettingItemGroup>
      <SettingActionItem
        label={
          <span className="flex items-center gap-1">
            {t("data_control.clean_cache.button")}
            <MotionButtonBase
              onClick={() => {
                tipcClient?.openCacheFolder()
              }}
              className="center flex"
            >
              <i className="i-mgc-folder-open-cute-re" />
            </MotionButtonBase>
          </span>
        }
        action={async () => {
          await tipcClient?.clearCache()
          queryClient.setQueryData(["app", "cache", "size"], 0)
        }}
        buttonText={t("data_control.clean_cache.button")}
      />
      <SettingDescription>{t("data_control.clean_cache.description")}</SettingDescription>
    </SettingItemGroup>
  )
}
const AppCacheLimit = () => {
  const { t } = useTranslation("settings")
  const { data: cacheSize, isLoading: isLoadingCacheSize } = useQuery({
    queryKey: ["app", "cache", "size"],
    queryFn: async () => {
      const byteSize = (await tipcClient?.getCacheSize()) ?? 0
      return Math.round(byteSize / 1024 / 1024)
    },
    refetchOnMount: "always",
  })
  const {
    data: cacheLimit,
    isLoading: isLoadingCacheLimit,
    refetch: refetchCacheLimit,
  } = useQuery({
    queryKey: ["app", "cache", "limit"],
    queryFn: async () => {
      const size = (await tipcClient?.getCacheLimit()) ?? 0
      return size
    },
  })

  const onChange = (value: number[]) => {
    tipcClient?.limitCacheSize(value[0])
    refetchCacheLimit()
  }

  if (isLoadingCacheSize || isLoadingCacheLimit) return null

  const InfinitySymbol = <CarbonInfinitySymbol />
  return (
    <SettingItemGroup>
      <div className={"mb-3 flex items-center justify-between gap-4"}>
        <Label className="center flex">
          {t("data_control.app_cache_limit.label")}

          <span className="center ml-2 flex shrink-0 gap-1 text-xs opacity-60">
            <span>({cacheSize}M</span> /{" "}
            <span className="center flex shrink-0">
              {cacheLimit ? `${cacheLimit}M` : InfinitySymbol})
            </span>
          </span>
        </Label>

        <div className="relative flex w-1/5 flex-col gap-1">
          <Slider
            min={0}
            max={500}
            step={100}
            defaultValue={[cacheLimit ?? 0]}
            onValueCommit={onChange}
          />
          <div className="absolute bottom-[-1.5em] text-base opacity-50">{InfinitySymbol}</div>
          <div className="absolute bottom-[-1.5em] right-0 text-xs opacity-50">500M</div>
        </div>
      </div>
      <SettingDescription>{t("data_control.app_cache_limit.description")}</SettingDescription>
    </SettingItemGroup>
  )
}
