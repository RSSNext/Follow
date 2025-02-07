import { Portal } from "@gorhom/portal"
import { requireNativeView } from "expo"
import * as React from "react"
import { TouchableOpacity, View } from "react-native"

import { BugCuteReIcon } from "@/src/icons/bug_cute_re"
import type { EntryModel } from "@/src/store/entry/types"

import { prepareWebView, SharedWebViewModule } from "."
import { htmlUrl } from "./constants"

const NativeView: React.ComponentType<{
  onContentHeightChange?: (e: { nativeEvent: { height: number } }) => void
  url: string
}> = requireNativeView("FOSharedWebView")

type EntryContentWebViewProps = {
  entry: EntryModel
}

export function EntryContentWebView(props: EntryContentWebViewProps) {
  const [contentHeight, setContentHeight] = React.useState(0)

  const { entry } = props

  const [mode, setMode] = React.useState<"normal" | "debug">("normal")

  React.useEffect(() => {
    if (mode === "debug") {
      SharedWebViewModule.load("http://localhost:5173/")
    } else {
      prepareWebView()
    }
  }, [mode])

  return (
    <>
      <View
        style={{ height: contentHeight, transform: [{ translateY: 0 }] }}
        onLayout={() => {
          SharedWebViewModule.evaluateJavaScript(
            `setEntry(JSON.parse(${JSON.stringify(JSON.stringify(entry))}))`,
          )
        }}
      >
        <NativeView
          onContentHeightChange={(e) => {
            setContentHeight(e.nativeEvent.height)
          }}
          url={htmlUrl}
        />
      </View>

      <View className="bg-red h-24" />
      {__DEV__ && (
        <Portal>
          <View className="absolute left-4 flex-row gap-4 bottom-safe-offset-2">
            <TouchableOpacity
              className="bg-yellow flex size-12 items-center justify-center rounded-full"
              onPress={() => {
                setMode((prev) => (prev === "normal" ? "debug" : "normal"))
              }}
            >
              <BugCuteReIcon />
            </TouchableOpacity>

            {/* <TouchableOpacity
              className="bg-yellow flex size-12 items-center justify-center rounded-full"
              onPress={() => {}}
            >
              <Refresh2CuteReIcon />
            </TouchableOpacity> */}
          </View>
        </Portal>
      )}
    </>
  )
}
