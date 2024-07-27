/* eslint-disable @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks */
import {
  setUISetting,
  useUISettingSelector,
} from "@renderer/atoms/settings/ui"
import { StyledButton } from "@renderer/components/ui/button"
import { Input } from "@renderer/components/ui/input"
import { useModalStack } from "@renderer/components/ui/modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { tipcClient } from "@renderer/lib/client"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useMemo, useRef } from "react"

const FALLBACK_FONT = "Default"
const DEFAULT_FONT = "SN Pro"
const CUSTOM_FONT = "Custom"
const useFontDataElectron = () => {
  const { data } = useQuery({
    queryFn: () => tipcClient?.getSystemFonts(),
    queryKey: ["systemFonts"],
  })

  return [FALLBACK_FONT].concat(data || []).map((font) => ({
    label: font,
    value: font,
  }))
}

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

const useFontData = window.electron ? useFontDataElectron : useFontDataWeb
export const ContentFontSelector = () => {
  const data = useFontData()
  const readerFontFamily = useUISettingSelector(
    (state) => state.readerFontFamily || DEFAULT_FONT,
  )
  const setCustom = usePresentCustomFontDialog("readerFontFamily")

  const isCustomFont = useMemo(
    () =>
      readerFontFamily !== "inherit" &&
      data.find((d) => d.value === readerFontFamily) === undefined,
    [data, readerFontFamily],
  )

  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">Content Font</span>
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
        <SelectContent className="h-64">
          {isCustomFont && (
            <SelectItem value={readerFontFamily}>{readerFontFamily}</SelectItem>
          )}
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
  // filter out the fallback font
  const data = useFontData().slice(1)
  const uiFont = useUISettingSelector((state) => state.uiFontFamily)
  const setCustom = usePresentCustomFontDialog("uiFontFamily")
  const isCustomFont = useMemo(
    () =>

      data.find((d) => d.value === uiFont) === undefined,
    [data, uiFont],
  )

  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">UI Font</span>
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
        <SelectContent className="h-64">
          {isCustomFont && (
            <SelectItem value={uiFont}>{uiFont}</SelectItem>
          )}
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

const usePresentCustomFontDialog = (
  setKey: "uiFontFamily" | "readerFontFamily",
) => {
  const { present } = useModalStack()

  return useCallback(() => {
    present({
      title: "Custom Font",
      content: function Content({ dismiss }) {
        const inputRef = useRef<HTMLInputElement>(null)

        return (
          <div className="flex flex-col gap-2">
            <Input ref={inputRef} />

            <div className="flex justify-end">
              <StyledButton
                onClick={() => {
                  const value = inputRef.current?.value
                  if (value) {
                    setUISetting(setKey, value)
                    dismiss()
                  }
                }}
              >
                Save
              </StyledButton>
            </div>
          </div>
        )
      },
    })
  }, [present, setKey])
}
