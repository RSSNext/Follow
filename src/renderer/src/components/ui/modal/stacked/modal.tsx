import * as Dialog from "@radix-ui/react-dialog"
import { useUISettingKey } from "@renderer/atoms/settings/ui"
import { AppErrorBoundary } from "@renderer/components/common/AppErrorBoundary"
import { m } from "@renderer/components/common/Motion"
import { ErrorComponentType } from "@renderer/components/errors"
import { nextFrame, stopPropagation } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import { useAnimationControls, useDragControls } from "framer-motion"
import { produce } from "immer"
import { useSetAtom } from "jotai"
import type { PointerEventHandler, SyntheticEvent } from "react"
import {
  createElement,
  forwardRef,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"

import { Divider } from "../../divider"
import { modalStackAtom } from "./atom"
import { MODAL_STACK_Z_INDEX, modalMontionConfig } from "./constants"
import type { CurrentModalContentProps, ModalActionsInternal } from "./context"
import { CurrentModalContext } from "./context"
import type { ModalProps } from "./types"

export const ModalInternal: Component<{
  item: ModalProps & { id: string }
  index: number

  isTop: boolean
  onClose?: (open: boolean) => void
}> = memo(
  forwardRef(function Modal(
    { item, index, onClose: onPropsClose, children, isTop },
    ref: any,
  ) {
    const {
      CustomModalComponent,
      modalClassName,
      content,
      title,
      clickOutsideToDismiss,
      modalContainerClassName,
      wrapper: Wrapper = Fragment,
      max,
      icon,
      canClose = true,

      draggable = false,
    } = item

    const setStack = useSetAtom(modalStackAtom)

    const [currentIsClosing, setCurrentIsClosing] = useState(false)

    const close = useEventCallback((forceClose = false) => {
      if (!canClose && !forceClose) return
      setCurrentIsClosing(true)
      nextFrame(() => {
        setStack((p) => p.filter((modal) => modal.id !== item.id))
      })
      onPropsClose?.(false)
    })

    const onClose = useCallback(
      (open: boolean): void => {
        if (!open) {
          close()
        }
      },
      [close],
    )

    const opaque = useUISettingKey("modalOpaque")

    const zIndexStyle = useMemo(
      () => ({ zIndex: MODAL_STACK_Z_INDEX + index + 1 }),
      [index],
    )
    const dismiss = useCallback(
      (e: SyntheticEvent) => {
        e.stopPropagation()

        close(true)
      },
      [close],
    )

    const animateController = useAnimationControls()
    useEffect(() => {
      requestAnimationFrame(() => {
        animateController.start(modalMontionConfig.animate)
      })
    }, [animateController])
    const noticeModal = useCallback(() => {
      animateController
        .start({
          scale: 1.05,
          transition: {
            duration: 0.06,
          },
        })
        .then(() => {
          animateController.start({
            scale: 1,
          })
        })
    }, [animateController])

    const dragController = useDragControls()
    const handleDrag: PointerEventHandler<HTMLDivElement> = useCallback(
      (e) => {
        if (draggable) {
          dragController.start(e)
        }
      },
      [dragController, draggable],
    )

    useEffect(() => {
      if (isTop) return
      animateController.start({
        scale: 0.96,
        y: 10,
      })
      return () => {
        try {
          animateController.stop()
          animateController.start({
            scale: 1,
            y: 0,
          })
        } catch {
          /* empty */
        }
      }
    }, [isTop])

    const modalContentRef = useRef<HTMLDivElement>(null)
    const ModalProps: ModalActionsInternal = useMemo(
      () => ({
        dismiss: close,
        setClickOutSideToDismiss: (v) => {
          setStack((state) => produce(state, (draft) => {
            const model = draft.find((modal) => modal.id === item.id)
            if (!model) return
            if (model.clickOutsideToDismiss === v) return
            model.clickOutsideToDismiss = v
          }))
        },
      }),
      [close, item.id, setStack],
    )

    const ModalContextProps = useMemo<CurrentModalContentProps>(
      () => ({
        ...ModalProps,
        ref: modalContentRef,
      }),
      [ModalProps],
    )
    const finalChildren = useMemo(
      () => (
        <CurrentModalContext.Provider value={ModalContextProps}>
          <AppErrorBoundary errorType={ErrorComponentType.Modal}>
            {children ?? createElement(content, ModalProps)}
          </AppErrorBoundary>
        </CurrentModalContext.Provider>
      ),
      [ModalContextProps, ModalProps, children, content],
    )

    useEffect(() => {
      if (currentIsClosing) {
        // Radix dialog will block pointer events
        document.body.style.pointerEvents = "auto"
      }
    }, [currentIsClosing])

    const edgeElementRef = useRef<HTMLDivElement>(null)

    if (CustomModalComponent) {
      return (
        <Wrapper>
          <Dialog.Root open onOpenChange={onClose}>
            <Dialog.Portal>
              <Dialog.DialogTitle className="sr-only">
                {title}
              </Dialog.DialogTitle>
              <Dialog.Content asChild>
                <div
                  className={cn(
                    "fixed inset-0 z-20 overflow-auto",
                    currentIsClosing && "!pointer-events-none",
                    modalContainerClassName,
                  )}
                  onClick={
                    clickOutsideToDismiss && canClose ? dismiss : undefined
                  }
                  style={zIndexStyle}
                >
                  <div
                    className={cn("contents", modalClassName)}
                    onClick={stopPropagation}
                    ref={ref}
                  >
                    <CustomModalComponent>{finalChildren}</CustomModalComponent>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </Wrapper>
      )
    }

    return (
      <Wrapper>
        <Dialog.Root open onOpenChange={onClose}>
          <Dialog.Portal>
            <Dialog.Content asChild>
              <div
                ref={edgeElementRef}
                style={zIndexStyle}
                className={cn(
                  "center fixed inset-0 z-20 flex",
                  currentIsClosing && "!pointer-events-none",
                  modalContainerClassName,
                )}
                onClick={
                  clickOutsideToDismiss && canClose ? dismiss : noticeModal
                }
              >
                <m.div
                  ref={ref}
                  style={zIndexStyle}
                  {...modalMontionConfig}
                  animate={animateController}
                  className={cn(
                    "relative flex flex-col overflow-hidden rounded-lg",
                    opaque ?
                      "bg-theme-modal-background-opaque" :
                      "bg-theme-modal-background backdrop-blur-sm",
                    "shadow-modal p-2",
                    max ?
                      "h-[90vh] w-[90vw]" :
                      "max-h-[70vh] min-w-[300px] max-w-[90vw] lg:max-h-[calc(100vh-20rem)] lg:max-w-[70vw]",

                    "border border-slate-200 dark:border-neutral-800",
                    modalClassName,
                  )}
                  onClick={stopPropagation}
                  drag
                  dragControls={dragController}
                  dragElastic={0}
                  dragListener={false}
                  dragMomentum={false}
                  dragConstraints={edgeElementRef}
                  whileDrag={{
                    cursor: "grabbing",
                  }}
                >
                  <div
                    className="relative flex items-center"
                    onPointerDownCapture={handleDrag}
                  >
                    <Dialog.Title className="flex shrink-0 grow items-center gap-2 px-4 py-1 text-lg font-semibold">
                      {icon && <span className="size-4">{icon}</span>}

                      <span>{title}</span>
                    </Dialog.Title>
                    {canClose && (
                      <Dialog.DialogClose
                        className="center p-2"
                        tabIndex={1}
                        onClick={close}
                      >
                        <i className="i-mgc-close-cute-re" />
                      </Dialog.DialogClose>
                    )}
                  </div>
                  <Divider className="my-2 shrink-0 border-slate-200 opacity-80 dark:border-neutral-800" />

                  <div className="min-h-0 shrink grow overflow-auto px-4 py-2">
                    {finalChildren}
                  </div>
                </m.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Wrapper>
    )
  }),
)
