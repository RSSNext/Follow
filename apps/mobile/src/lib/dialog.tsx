import type { FC, ReactNode } from "react"
import { createContext, createElement, useContext } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated"
import RootSiblings from "react-native-root-siblings"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { getColor } from "react-native-uikit-colors"

import { FullWindowOverlay } from "../components/common/FullWindowOverlay"
import { Overlay } from "../components/ui/overlay/Overlay"
import { accentColor } from "../theme/colors"

export interface DialogProps<Ctx> {
  title?: string
  content: ReactNode
  variant?: "destructive" | "default"
  onClose?: (ctx: Ctx & DialogContextType) => void
  onConfirm?: (ctx: Ctx & DialogContextType) => void
  cancelText?: string
  confirmText?: string

  id: string
}

const entering = SlideInUp.springify().damping(15).stiffness(100)
const exiting = SlideOutUp.duration(200)

type DialogContextType = {
  dismiss: () => void
}
const DialogContext = createContext<DialogContextType | null>(null)
export type DialogComponent<Ctx = unknown> = FC<DialogContextType & { ctx: Ctx }> &
  Omit<DialogProps<Ctx>, "content">
class DialogStatic {
  useDialogContext = () => {
    return useContext(DialogContext)
  }

  private currentStackedDialogs = new Set<string>()
  show<Ctx>(propsOrComponent: DialogProps<Ctx> | DialogComponent<Ctx>) {
    const isExist = this.currentStackedDialogs.has(propsOrComponent.id)
    if (isExist) {
      return
    }
    const props =
      "content" in propsOrComponent
        ? propsOrComponent
        : (propsOrComponent as unknown as DialogProps<Ctx>)

    const dismiss = () => this.destroy(props.id, siblings)

    const reactCtx = { dismiss }

    const mergeCtx = (ctx: Ctx) => ({ ...ctx, ...reactCtx })

    const ctx = {} as Ctx
    const children =
      "content" in propsOrComponent
        ? propsOrComponent.content
        : createElement(propsOrComponent, {
            dismiss,
            ctx,
          })

    const handleClose = () => {
      dismiss()
      setTimeout(() => {
        props.onClose?.(mergeCtx(ctx))
      }, 16)
    }
    const siblings = new RootSiblings(
      (
        <FullWindowOverlay>
          <Overlay onPress={handleClose} />
          <Animated.View
            className="bg-secondary-system-background absolute inset-x-0 -top-8 pt-8"
            entering={entering}
            exiting={exiting}
          >
            <SafeInsetTop />
            <DialogContext.Provider value={reactCtx}>{children}</DialogContext.Provider>

            <View className="flex-row gap-4 px-6 pb-4">
              <TouchableOpacity
                className="bg-system-fill flex-1 items-center justify-center rounded-full px-6 py-3"
                onPress={handleClose}
              >
                <Text className="text-label text-base font-medium">
                  {props.cancelText ?? "Cancel"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 items-center justify-center rounded-full bg-accent px-6 py-3"
                style={{
                  backgroundColor: props.variant === "destructive" ? getColor("red") : accentColor,
                }}
                onPress={() => {
                  props.onConfirm?.(mergeCtx(ctx))
                }}
              >
                <Text className="text-label text-base font-semibold">
                  {props.confirmText ?? "Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </FullWindowOverlay>
      ),
    )

    this.currentStackedDialogs.add(props.id)
    return siblings
  }

  destroy(id: string, siblings: RootSiblings) {
    this.currentStackedDialogs.delete(id)
    siblings.destroy()
  }
}

const SafeInsetTop = () => {
  const insets = useSafeAreaInsets()
  return <View style={{ height: insets.top }} />
}
export const Dialog = new DialogStatic()
