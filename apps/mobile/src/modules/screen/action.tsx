import { cn } from "@follow/utils"
import type { PropsWithChildren } from "react"
import { TouchableOpacity, View } from "react-native"

import { setGeneralSetting, useGeneralSettingKey } from "@/src/atoms/settings/general"
import { setUISetting, useUISettingKey } from "@/src/atoms/settings/ui"
import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { UIBarButton } from "@/src/components/ui/button/UIBarButton"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { CheckCircleCuteReIcon } from "@/src/icons/check_circle_cute_re"
import { PhotoAlbumCuteFiIcon } from "@/src/icons/photo_album_cute_fi"
import { PhotoAlbumCuteReIcon } from "@/src/icons/photo_album_cute_re"
import { RoundCuteFiIcon } from "@/src/icons/round_cute_fi"
import { RoundCuteReIcon } from "@/src/icons/round_cute_re"
import { Dialog } from "@/src/lib/dialog"
import { useWhoami } from "@/src/store/user/hooks"
import { accentColor, useColor } from "@/src/theme/colors"

import { AddFeedDialog } from "../dialogs/AddFeedDialog"
import { MarkAllAsReadDialog } from "../dialogs/MarkAllAsReadDialog"

const ActionGroup = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <View className={cn("flex flex-row items-center gap-2 px-[12px]", className)}>{children}</View>
  )
}

export function HomeLeftAction() {
  const user = useWhoami()
  if (!user) return null
  return (
    <ActionGroup>
      <TouchableOpacity>
        <UserAvatar image={user.image} name={user.name!} size={28} />
      </TouchableOpacity>
    </ActionGroup>
  )
}

export function HomeSharedRightAction(props: PropsWithChildren) {
  const unreadOnly = useGeneralSettingKey("unreadOnly")
  return (
    <ActionGroup className="-mr-2">
      {props.children}
      <UIBarButton
        label={unreadOnly ? "Show All" : "Show Unread Only"}
        normalIcon={<RoundCuteReIcon height={20} width={20} color={accentColor} />}
        selectedIcon={<RoundCuteFiIcon height={20} width={20} color={accentColor} />}
        onPress={() => {
          setGeneralSetting("unreadOnly", !unreadOnly)
        }}
        selected={unreadOnly}
        noOverlay
      />
      <UIBarButton
        label="Mark All as Read"
        normalIcon={<CheckCircleCuteReIcon height={20} width={20} color={accentColor} />}
        onPress={() => {
          Dialog.show(MarkAllAsReadDialog)
        }}
      />
    </ActionGroup>
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
export const AddFeedButton = () => {
  return (
    <>
      <UIBarButton
        label="Add Feed"
        normalIcon={<AddCuteReIcon color={accentColor} />}
        onPress={() => {
          Dialog.show(AddFeedDialog)
        }}
      />
    </>
  )
}
