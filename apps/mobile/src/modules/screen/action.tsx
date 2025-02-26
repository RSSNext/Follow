import { cn } from "@follow/utils"
import { router } from "expo-router"
import type { PropsWithChildren } from "react"
import { TouchableOpacity, View } from "react-native"

import { setGeneralSetting, useGeneralSettingKey } from "@/src/atoms/settings/general"
import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { UIBarButton } from "@/src/components/ui/button/UIBarButton"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { CheckCircleCuteReIcon } from "@/src/icons/check_circle_cute_re"
import { RoundCuteFiIcon } from "@/src/icons/round_cute_fi"
import { RoundCuteReIcon } from "@/src/icons/round_cute_re"
import { Dialog } from "@/src/lib/dialog"
import { useWhoami } from "@/src/store/user/hooks"
import { accentColor, useColor } from "@/src/theme/colors"

import { AddFeedDialog } from "../dialogs/AddFeedDialog"
import { MarkAllAsReadDialog } from "../dialogs/MarkAllAsReadDialog"

const ActionGroup = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return <View className={cn("flex flex-row items-center gap-2", className)}>{children}</View>
}

export function HomeLeftAction() {
  const user = useWhoami()
  if (!user) return null
  return (
    <ActionGroup className="ml-2">
      <TouchableOpacity onPress={() => router.push("/profile")}>
        <UserAvatar image={user.image} name={user.name!} size={28} className="rounded-full" />
      </TouchableOpacity>
    </ActionGroup>
  )
}

export function HomeSharedRightAction(props: PropsWithChildren) {
  return (
    <ActionGroup>
      {props.children}

      <UIBarButton
        label="Mark All as Read"
        normalIcon={<CheckCircleCuteReIcon height={24} width={24} color={accentColor} />}
        onPress={() => {
          Dialog.show(MarkAllAsReadDialog)
        }}
      />
    </ActionGroup>
  )
}

interface HeaderActionButtonProps {
  variant?: "primary" | "secondary"
}

const useButtonVariant = ({ variant = "primary" }: HeaderActionButtonProps) => {
  const label = useColor("label")
  const size = 24
  const color = variant === "primary" ? accentColor : label
  return { size, color }
}
export const UnreadOnlyActionButton = ({ variant = "primary" }: HeaderActionButtonProps) => {
  const unreadOnly = useGeneralSettingKey("unreadOnly")
  const { size, color } = useButtonVariant({ variant })
  return (
    <UIBarButton
      label={unreadOnly ? "Show All" : "Show Unread Only"}
      normalIcon={<RoundCuteReIcon height={size} width={size} color={color} />}
      selectedIcon={<RoundCuteFiIcon height={size} width={size} color={color} />}
      onPress={() => {
        setGeneralSetting("unreadOnly", !unreadOnly)
      }}
      selected={unreadOnly}
      overlay={false}
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
