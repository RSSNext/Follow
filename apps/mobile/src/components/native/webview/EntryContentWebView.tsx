import { clsx } from "@follow/utils"
import { Portal } from "@gorhom/portal"
import { requireNativeView } from "expo"
import { useAtom } from "jotai"
import * as React from "react"
import { useEffect } from "react"
import type { ViewProps } from "react-native"
import { ActivityIndicator, TouchableOpacity, View } from "react-native"

import { useUISettingKey } from "@/src/atoms/settings/ui"
import { BugCuteReIcon } from "@/src/icons/bug_cute_re"
import type { EntryModel } from "@/src/store/entry/types"

import { sharedWebViewHeightAtom } from "./atom"
import { htmlUrl } from "./constants"
import { prepareEntryRenderWebView, SharedWebViewModule } from "./index"

const NativeView: React.ComponentType<
  ViewProps & {
    onContentHeightChange?: (e: { nativeEvent: { height: number } }) => void
    url?: string
  }
> = requireNativeView("FOSharedWebView")

type EntryContentWebViewProps = {
  entry: EntryModel
  noMedia?: boolean
  showReadability?: boolean
}

const setCodeTheme = (light: string, dark: string) => {
  SharedWebViewModule.evaluateJavaScript(
    `setCodeTheme(${JSON.stringify(light)}, ${JSON.stringify(dark)})`,
  )
}

const setWebViewEntry = (entry: EntryModel) => {
  SharedWebViewModule.evaluateJavaScript(
    `setEntry(JSON.parse(${JSON.stringify(JSON.stringify(entry))}))`,
  )
}
export { setWebViewEntry as preloadWebViewEntry }

const setNoMedia = (value: boolean) => {
  SharedWebViewModule.evaluateJavaScript(`setNoMedia(${value})`)
}

const setReaderRenderInlineStyle = (value: boolean) => {
  SharedWebViewModule.evaluateJavaScript(`setReaderRenderInlineStyle(${value})`)
}

const setShowReadability = (value: boolean) => {
  SharedWebViewModule.evaluateJavaScript(`setShowReadability(${value})`)
}

export function EntryContentWebView(props: EntryContentWebViewProps) {
  const [contentHeight, setContentHeight] = useAtom(sharedWebViewHeightAtom)

  const codeThemeLight = useUISettingKey("codeHighlightThemeLight")
  const codeThemeDark = useUISettingKey("codeHighlightThemeDark")
  const readerRenderInlineStyle = useUISettingKey("readerRenderInlineStyle")
  const { entry, noMedia, showReadability } = props

  const [mode, setMode] = React.useState<"normal" | "debug">("normal")

  useEffect(() => {
    setShowReadability(!!showReadability)
  }, [showReadability])

  useEffect(() => {
    setNoMedia(!!noMedia)
  }, [noMedia, mode])

  useEffect(() => {
    setReaderRenderInlineStyle(readerRenderInlineStyle)
  }, [readerRenderInlineStyle, mode])

  useEffect(() => {
    setCodeTheme(codeThemeLight, codeThemeDark)
  }, [codeThemeLight, codeThemeDark, mode])

  useEffect(() => {
    setWebViewEntry(entry)
  }, [entry])

  const onceRef = React.useRef(false)
  if (!onceRef.current) {
    onceRef.current = true
    prepareEntryRenderWebView()
  }

  return (
    <>
      <View
        key={mode}
        style={{ height: contentHeight, transform: [{ translateY: 0 }] }}
        onLayout={() => {
          setWebViewEntry(entry)
        }}
      >
        <NativeView
          onContentHeightChange={(e) => {
            setContentHeight(e.nativeEvent.height)
          }}
        />
      </View>

      <Portal>
        {(showReadability ? !entry.readabilityContent : !entry.content) && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator />
          </View>
        )}
      </Portal>
      {__DEV__ && (
        <Portal>
          <View className="bottom-safe-offset-2 absolute left-4 flex-row gap-4">
            <TouchableOpacity
              className={clsx(
                "flex size-12 items-center justify-center rounded-full",
                mode === "debug" ? "bg-yellow" : "bg-red",
              )}
              onPress={() => {
                const nextMode = mode === "debug" ? "normal" : "debug"
                setMode(nextMode)
                if (nextMode === "debug") {
                  SharedWebViewModule.load("http://localhost:5173/")
                } else {
                  SharedWebViewModule.load(htmlUrl)
                }
              }}
            >
              <BugCuteReIcon color="#fff" />
            </TouchableOpacity>
          </View>
        </Portal>
      )}
    </>
  )
}
