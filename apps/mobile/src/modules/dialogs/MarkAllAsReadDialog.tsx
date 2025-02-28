import { Text, View } from "react-native"

import { CheckCircleCuteReIcon } from "@/src/icons/check_circle_cute_re"
import type { DialogComponent } from "@/src/lib/dialog"
import { Dialog } from "@/src/lib/dialog"
import { unreadSyncService } from "@/src/store/unread/store"

import { useSelectedView } from "../screen/atoms"

export const MarkAllAsReadDialog: DialogComponent = () => {
  const selectedView = useSelectedView()
  const ctx = Dialog.useDialogContext()
  return (
    <View>
      <Text className="text-label">Do you want to mark all items as read?</Text>
      <Dialog.DialogConfirm
        onPress={() => {
          ctx?.dismiss()

          if (typeof selectedView === "number") {
            unreadSyncService.markViewAsRead(selectedView)
          }
        }}
      />
    </View>
  )
}

MarkAllAsReadDialog.title = "Mark All as Read"
MarkAllAsReadDialog.id = "mark-all-as-read"

MarkAllAsReadDialog.title = "Mark All as Read"
MarkAllAsReadDialog.headerIcon = <CheckCircleCuteReIcon />
