import { Portal } from "@gorhom/portal"
import { router } from "expo-router"
import type { PropsWithChildren } from "react"
import { useRef, useState } from "react"
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native"
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { setUISetting, useUISettingKey } from "@/src/atoms/settings/ui"
import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { UIBarButton } from "@/src/components/ui/button/UIBarButton"
import { Overlay } from "@/src/components/ui/overlay/Overlay"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { LinkCuteReIcon } from "@/src/icons/link_cute_re"
import { PhotoAlbumCuteFiIcon } from "@/src/icons/photo_album_cute_fi"
import { PhotoAlbumCuteReIcon } from "@/src/icons/photo_album_cute_re"
import { useWhoami } from "@/src/store/user/hooks"
import { accentColor, useColor } from "@/src/theme/colors"

const useActionPadding = () => {
  const insets = useSafeAreaInsets()
  return { paddingLeft: insets.left + 12, paddingRight: insets.right + 12 }
}

export function HomeLeftAction() {
  const insets = useActionPadding()
  const user = useWhoami()
  if (!user) return null
  return (
    <TouchableOpacity className="flex-row items-center" style={{ paddingLeft: insets.paddingLeft }}>
      <UserAvatar image={user.image} name={user.name!} size={28} />
    </TouchableOpacity>
  )
}

export function HomeRightAction(props: PropsWithChildren) {
  const insets = useActionPadding()

  return (
    <View
      className="-mr-2 flex-row items-center gap-2"
      style={{ paddingRight: insets.paddingRight }}
    >
      {props.children}
      <AddFeedButton />
    </View>
  )
}

export function HideNoMediaActionButton({
  variant = "primary",
}: {
  variant?: "primary" | "secondary"
}) {
  const pictureViewFilterNoImage = useUISettingKey("pictureViewFilterNoImage")

  const label = useColor("label")
  const size = variant === "primary" ? 24 : 20
  const color = variant === "primary" ? accentColor : label
  return (
    <UIBarButton
      label="Hide No Media Item"
      normalIcon={<PhotoAlbumCuteReIcon height={size} width={size} color={color} />}
      selectedIcon={<PhotoAlbumCuteFiIcon height={size} width={size} color={color} />}
      onPress={() => {
        setUISetting("pictureViewFilterNoImage", !pictureViewFilterNoImage)
      }}
      selected={pictureViewFilterNoImage}
    />
  )
}
const AddFeedButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const label = useColor("label")
  const handleClose = () => setIsOpen(false)

  const valueRef = useRef("")
  const handleAdd = () => {
    handleClose()

    const value = valueRef.current
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
    <>
      <UIBarButton
        label="Add Feed"
        normalIcon={<AddCuteReIcon color={accentColor} />}
        onPress={() => setIsOpen((s) => !s)}
      />

      <Portal>
        {isOpen && (
          <>
            <Overlay onPress={handleClose} />

            <Animated.View
              className="bg-secondary-system-background absolute inset-x-0 -top-8 pt-8"
              entering={SlideInUp.springify().damping(15).stiffness(100)}
              exiting={SlideOutUp.duration(200)}
            >
              <SafeAreaView className="bg-secondary-system-background">
                <View className="mt-4 px-6 py-4">
                  <View className="flex-row items-center gap-2">
                    <LinkCuteReIcon color={label} height={20} width={20} />
                    <Text className="text-label text-base font-medium">
                      Enter Feed URL or RSSHub URL
                    </Text>
                  </View>
                  <TextInput
                    onChangeText={(text) => (valueRef.current = text)}
                    autoFocus
                    enterKeyHint="done"
                    cursorColor={accentColor}
                    selectionColor={accentColor}
                    onSubmitEditing={handleAdd}
                    className="bg-system-background dark:bg-secondary-system-fill/30 text-text my-3 rounded-xl"
                    placeholder="https:// or rsshub://"
                  />
                </View>

                <View className="flex-row gap-4 px-6 pb-4">
                  <TouchableOpacity
                    className="bg-system-fill flex-1 items-center justify-center rounded-full px-6 py-3"
                    onPress={handleClose}
                  >
                    <Text className="text-label text-base font-medium">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 items-center justify-center rounded-full bg-accent px-6 py-3"
                    onPress={handleAdd}
                  >
                    <Text className="text-label text-base font-semibold">Add</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </Animated.View>
          </>
        )}
      </Portal>
    </>
  )
}
