import { clsx } from "@follow/utils"
import { Portal } from "@gorhom/portal"
import { requireNativeView } from "expo"
import * as React from "react"
import { ActivityIndicator, TouchableOpacity, View } from "react-native"

import { BugCuteReIcon } from "@/src/icons/bug_cute_re"
import type { EntryModel } from "@/src/store/entry/types"

import { prepareEntryRenderWebView, SharedWebViewModule } from "."
import { htmlUrl } from "./constants"

const NativeView: React.ComponentType<{
  onContentHeightChange?: (e: { nativeEvent: { height: number } }) => void
  url?: string
}> = requireNativeView("FOSharedWebView")

type EntryContentWebViewProps = {
  entry: EntryModel
}

export const setWebViewEntry = (entry: EntryModel) => {
  SharedWebViewModule.evaluateJavaScript(
    `setEntry(JSON.parse(${JSON.stringify(JSON.stringify(entry))}))`,
  )
}

export function EntryContentWebView(props: EntryContentWebViewProps) {
  const [contentHeight, setContentHeight] = React.useState(0)

  const { entry } = props

  const [mode, setMode] = React.useState<"normal" | "debug">("normal")
  React.useEffect(() => {
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
        {!entry.content && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator />
          </View>
        )}
      </Portal>
      {__DEV__ && (
        <Portal>
          <View className="absolute left-4 flex-row gap-4 bottom-safe-offset-2">
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
