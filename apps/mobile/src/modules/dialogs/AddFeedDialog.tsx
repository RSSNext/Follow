import { router } from "expo-router"
import { Text, TextInput, View } from "react-native"
import { useColor } from "react-native-uikit-colors"

import { LinkCuteReIcon } from "@/src/icons/link_cute_re"
import type { DialogComponent } from "@/src/lib/dialog"
import { accentColor } from "@/src/theme/colors"

export const AddFeedDialog: DialogComponent<{
  url: string
}> = ({ dismiss, ctx }) => {
  const label = useColor("label")

  const handleAdd = () => {
    dismiss()
    const value = ctx.url
    if (!value) return
    router.push({
      pathname: "/follow",
      params: {
        url: value,
        type: "url",
      },
    })
  }

  return (
    <View>
      <View className="flex-row items-center gap-2">
        <LinkCuteReIcon color={label} height={20} width={20} />
        <Text className="text-label text-base font-medium">Enter Feed URL or RSSHub URL</Text>
      </View>
      <TextInput
        onChangeText={(text) => (ctx.url = text)}
        autoFocus
        enterKeyHint="done"
        cursorColor={accentColor}
        selectionColor={accentColor}
        onSubmitEditing={handleAdd}
        className="bg-system-background text-text my-3 rounded-xl p-2 px-4"
        placeholder="https:// or rsshub://"
      />
    </View>
  )
}

AddFeedDialog.confirmText = "Add"
AddFeedDialog.cancelText = "Cancel"

AddFeedDialog.onConfirm = (ctx) => {
  const value = ctx.url
  if (!value) return
  ctx.dismiss()

  setTimeout(() => {
    router.push({
      pathname: "/follow",
      params: {
        url: value,
        type: "url",
      },
    })
  }, 16)
}
AddFeedDialog.id = "add-feed-dialog"
