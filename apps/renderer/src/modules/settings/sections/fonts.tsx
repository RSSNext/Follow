/* eslint-disable @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks */
import { IN_ELECTRON } from "@follow/shared/constants"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo, useRef } from "react"
import * as React from "react"
import { useTranslation } from "react-i18next"

import { setUISetting, useUISettingSelector } from "~/atoms/settings/ui"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useModalStack } from "~/components/ui/modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { tipcClient } from "~/lib/client"
import { nextFrame } from "~/lib/dom"
import { getStorageNS } from "~/lib/ns"

const FALLBACK_FONT = "Default (UI Font)"
const DEFAULT_FONT = "SN Pro"
const CUSTOM_FONT = "Custom"
const useFontDataElectron = () => {
  const { data } = useQuery({
    queryFn: () => tipcClient?.getSystemFonts(),
    queryKey: ["systemFonts"],
  })

  return [{ label: FALLBACK_FONT, value: "inherit" }].concat(
    (data || []).map((font) => ({
      label: font,
      value: font,
    })),
  )
}

// eslint-disable-next-line @eslint-react/hooks-extra/no-redundant-custom-hook
const useFontDataWeb = () => [
  { label: FALLBACK_FONT, value: "inherit" },
  { label: "System UI", value: "system-ui" },
  ...["Arial", "PingFang SC", "Microsoft YaHei", "SF Pro"].map((font) => ({
    label: font,

    value: font,
  })),
  {
    label: "Custom",
    value: CUSTOM_FONT,
  },
]

const useFontData = IN_ELECTRON ? useFontDataElectron : useFontDataWeb
export const ContentFontSelector = () => {
  const { t } = useTranslation("settings")
  const data = useFontData()
  const readerFontFamily = useUISettingSelector((state) => state.readerFontFamily || DEFAULT_FONT)
  const setCustom = usePresentCustomFontDialog("readerFontFamily")

  const isCustomFont = useMemo(
    () =>
      readerFontFamily !== "inherit" &&
      data.find((d) => d.value === readerFontFamily) === undefined,
    [data, readerFontFamily],
  )

  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">{t("appearance.content_font")}</span>
      <Select
        defaultValue={FALLBACK_FONT}
        value={readerFontFamily}
        onValueChange={(value) => {
          if (value === CUSTOM_FONT) {
            setCustom()
            return
          }

          setUISetting("readerFontFamily", value)
        }}
      >
        <SelectTrigger size="sm" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {isCustomFont && <SelectItem value={readerFontFamily}>{readerFontFamily}</SelectItem>}
          {data.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const UIFontSelector = () => {
  const { t } = useTranslation("settings")
  // filter out the fallback font
  const data = useFontData()
    .slice(1)
    .filter((d) => d.value !== DEFAULT_FONT)
  const uiFont = useUISettingSelector((state) => state.uiFontFamily)
  const setCustom = usePresentCustomFontDialog("uiFontFamily")
  const isCustomFont = useMemo(
    () => uiFont !== DEFAULT_FONT && data.find((d) => d.value === uiFont) === undefined,
    [data, uiFont],
  )

  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">{t("appearance.ui_font")}</span>
      <Select
        defaultValue={FALLBACK_FONT}
        value={uiFont}
        onValueChange={(value) => {
          if (value === CUSTOM_FONT) {
            setCustom()
            return
          }

          setUISetting("uiFontFamily", value)
        }}
      >
        <SelectTrigger size="sm" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {isCustomFont && <SelectItem value={uiFont}>{uiFont}</SelectItem>}
          <SelectItem value={DEFAULT_FONT}>{DEFAULT_FONT}</SelectItem>
          {data.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const usePresentCustomFontDialog = (setKey: "uiFontFamily" | "readerFontFamily") => {
  const HISTORY_KEY = getStorageNS("customFonts")
  const { present } = useModalStack()
  const { t } = useTranslation("settings")

  return useCallback(() => {
    present({
      title: t("appearance.custom_font"),
      clickOutsideToDismiss: true,
      content: function Content({ dismiss, setClickOutSideToDismiss }) {
        const inputRef = useRef<HTMLInputElement>(null)

        useEffect(() => {
          nextFrame(() => inputRef.current?.focus())
        }, [inputRef])

        const save: React.FormEventHandler = (e) => {
          e.preventDefault()
          const value = inputRef.current?.value
          if (value) {
            setUISetting(setKey, value)
            localStorage.setItem(HISTORY_KEY, value)
            dismiss()
          }
        }
        return (
          <form className="flex flex-col gap-2" onSubmit={save}>
            <Input
              defaultValue={localStorage.getItem(HISTORY_KEY) || ""}
              ref={inputRef}
              onChange={() => {
                setClickOutSideToDismiss(false)
              }}
            />

            <div className="flex justify-end">
              <Button type="submit">{t("appearance.save")}</Button>
            </div>
          </form>
        )
      },
    })
  }, [HISTORY_KEY, present, setKey, t])
}
