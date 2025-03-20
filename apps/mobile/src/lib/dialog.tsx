import { cn } from "@follow/utils"
import type { Dispatch, FC, ReactElement, ReactNode, SetStateAction } from "react"
import {
  cloneElement,
  createContext,
  createElement,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated"
import RootSiblings from "react-native-root-siblings"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"
import { useColor } from "react-native-uikit-colors"

import { FullWindowOverlay } from "../components/common/FullWindowOverlay"
import { Overlay } from "../components/ui/overlay/Overlay"
import { Navigation } from "./navigation/Navigation"
import { NavigationInstanceContext } from "./navigation/NavigationInstanceContext"

export interface DialogProps<Ctx> {
  title?: string
  content: ReactNode
  variant?: "destructive" | "default"
  onClose?: (ctx: Ctx & DialogContextType) => void
  onConfirm?: (ctx: Ctx & DialogContextType) => void
  cancelText?: string
  confirmText?: string
  headerIcon?: ReactNode

  HeaderComponent?: FC<{
    title: string
    onClose: () => void
  }>

  id: string
}

interface ShowDialogOptions<Ctx> {
  override?: {
    onClose?: (ctx: Ctx & DialogContextType) => void
    onConfirm?: (ctx: Ctx & DialogContextType) => void
    cancelText?: string
    confirmText?: string
  }
}

const entering = SlideInUp.springify().damping(16.5).stiffness(100)
const exiting = SlideOutUp.duration(200)

type DialogContextType = {
  dismiss: () => void
  bizOnConfirm: (() => void) | null
  bizOnCancel: (() => void) | null
}

const DialogDynamicButtonActionContext = createContext<{
  onConfirm: (() => void) | null
  onCancel: (() => void) | null
}>({
  onConfirm: null,
  onCancel: null,
})

const SetDialogDynamicButtonActionContext = createContext<{
  setOnConfirm: Dispatch<SetStateAction<(() => void) | null>>
  setOnCancel: Dispatch<SetStateAction<(() => void) | null>>
}>({
  setOnConfirm: () => {},
  setOnCancel: () => {},
})

const DialogContext = createContext<DialogContextType | null>(null)
export type DialogComponent<Ctx = unknown> = FC<{ ctx: Ctx }> & Omit<DialogProps<Ctx>, "content">
class DialogStatic {
  useDialogContext = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useContext(DialogContext)
  }

  private currentStackedDialogs = new Set<string>()

  // Components
  DialogConfirm: FC<{ onPress: () => void }> = ({ onPress }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setOnConfirm } = useContext(SetDialogDynamicButtonActionContext)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setOnConfirm(() => {
        return onPress
      })
    }, [onPress, setOnConfirm])
    return null
  }

  DialogCancel: FC<{ onPress: () => void }> = ({ onPress }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setOnCancel } = useContext(SetDialogDynamicButtonActionContext)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { dismiss } = useContext(DialogContext)!

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      let timeout: NodeJS.Timeout
      setOnCancel(() => {
        return () => {
          dismiss()
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            onPress()
          }, 16)
        }
      })
      return () => {
        clearTimeout(timeout)
      }
    }, [onPress, setOnCancel, dismiss])
    return null
  }

  show<Ctx>(
    propsOrComponent: DialogProps<Ctx> | DialogComponent<Ctx>,
    options?: ShowDialogOptions<Ctx>,
  ) {
    const isExist = this.currentStackedDialogs.has(propsOrComponent.id)

    const override = options?.override
    if (isExist) {
      return
    }
    const props =
      "content" in propsOrComponent
        ? propsOrComponent
        : (propsOrComponent as unknown as DialogProps<Ctx>)

    const dismiss = () => this.destroy(props.id, siblings)

    const reactCtx: DialogContextType = {
      dismiss,
      get bizOnConfirm() {
        return () => {
          handleConfirm()
        }
      },
      get bizOnCancel() {
        return () => {
          handleClose()
        }
      },
    }

    const mergeCtx = (ctx: Ctx) => ({ ...ctx, ...reactCtx })

    const ctx = {} as Ctx
    const children =
      "content" in propsOrComponent
        ? propsOrComponent.content
        : createElement(propsOrComponent, {
            ctx,
          })

    const handleClose = () => {
      dismiss()
      setTimeout(() => {
        if (override?.onClose) {
          override.onClose(mergeCtx(ctx))
        } else {
          props.onClose?.(mergeCtx(ctx))
        }
      }, 16)
    }

    const handleConfirm = () => {
      if (override?.onConfirm) {
        override.onConfirm(mergeCtx(ctx))
      } else {
        props.onConfirm?.(mergeCtx(ctx))
        handleClose()
      }
    }

    const Header = props.HeaderComponent ? (
      createElement(props.HeaderComponent, {
        title: props.title ?? "",
        onClose: handleClose,
      })
    ) : props.title ? (
      <DefaultHeader title={props.title} headerIcon={props.headerIcon} />
    ) : null

    const siblings = new RootSiblings(
      (
        <SafeAreaProvider>
          <NavigationInstanceContext.Provider value={Navigation.rootNavigation}>
            <FullWindowOverlay>
              <Overlay onPress={handleClose} />
              <Animated.View
                className="bg-secondary-system-background absolute inset-x-0 -top-8 pt-8"
                entering={entering}
                exiting={exiting}
              >
                <SafeInsetTop />
                <DialogDynamicButtonActionProvider>
                  {Header}
                  <View className={cn("px-6 pb-4", Header ? "pt-4" : "pt-0")}>
                    <DialogContext.Provider value={reactCtx}>{children}</DialogContext.Provider>
                  </View>

                  <View className="flex-row gap-4 px-6 pb-4">
                    <DialogDynamicButtonAction
                      fallbackCaller={handleClose}
                      text={override?.cancelText ?? props.cancelText ?? "Cancel"}
                      type="cancel"
                      textClassName={cn(props.variant === "destructive" && "font-bold")}
                    />

                    <DialogDynamicButtonAction
                      fallbackCaller={handleConfirm}
                      text={override?.confirmText ?? props.confirmText ?? "Confirm"}
                      type="confirm"
                      className={props.variant === "destructive" ? "bg-red" : "bg-accent"}
                      textClassName={cn(
                        "text-white",
                        props.variant !== "destructive" && "font-bold",
                      )}
                    />
                  </View>
                </DialogDynamicButtonActionProvider>
              </Animated.View>
            </FullWindowOverlay>
          </NavigationInstanceContext.Provider>
        </SafeAreaProvider>
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

const DefaultHeader = (props: { title?: string; headerIcon?: ReactNode }) => {
  const label = useColor("label")
  if (!props.title) return null
  return (
    <View className="flex-row items-center gap-2 px-6">
      {isValidElement(props.headerIcon) &&
        props.headerIcon &&
        typeof props.headerIcon === "object" &&
        cloneElement(props.headerIcon as ReactElement, {
          color: label,
          height: 20,
          width: 20,
        })}
      <Text className="text-label text-lg font-semibold">{props.title}</Text>
    </View>
  )
}

const DialogDynamicButtonAction = (props: {
  type: "confirm" | "cancel"
  text: string
  fallbackCaller: () => void

  className?: string
  textClassName?: string
}) => {
  const { onConfirm, onCancel } = useContext(DialogDynamicButtonActionContext)
  const caller =
    {
      confirm: onConfirm,
      cancel: onCancel,
    }[props.type] || props.fallbackCaller

  return (
    <TouchableOpacity
      className={cn(
        "bg-system-fill flex-1 items-center justify-center rounded-full px-6 py-3",
        props.className,
      )}
      onPress={caller}
    >
      <Text className={cn("text-label text-base font-medium", props.textClassName)}>
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

const DialogDynamicButtonActionProvider = (props: { children: ReactNode }) => {
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null)
  const [onCancel, setOnCancel] = useState<(() => void) | null>(null)
  const ctx1 = useMemo(() => ({ onConfirm, onCancel }), [onConfirm, onCancel])
  const ctx2 = useMemo(() => ({ setOnConfirm, setOnCancel }), [setOnConfirm, setOnCancel])
  return (
    <DialogDynamicButtonActionContext.Provider value={ctx1}>
      <SetDialogDynamicButtonActionContext.Provider value={ctx2}>
        {props.children}
      </SetDialogDynamicButtonActionContext.Provider>
    </DialogDynamicButtonActionContext.Provider>
  )
}
