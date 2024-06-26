import * as Dialog from "@radix-ui/react-dialog"
import { stopPropagation } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import { useUIStore } from "@renderer/store"
import { m, useAnimationControls, useDragControls } from "framer-motion"
import { useSetAtom } from "jotai"
import type { PointerEventHandler, SyntheticEvent } from "react"
import {
  createElement,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { useShallow } from "zustand/react/shallow"

import { Divider } from "../../divider"
import { modalMontionConfig } from "./constants"
import type {
  CurrentModalContentProps,
  ModalContentPropsInternal,
} from "./context"
import { CurrentModalContext, modalStackAtom } from "./context"
import type { ModalProps } from "./types"

const DialogOverlay = ({
  onClick,
  zIndex,
}: {
  onClick?: () => void
  zIndex?: number
}) => (
  <Dialog.Overlay asChild>
    <m.div
      onClick={onClick}
      className="fixed inset-0 z-[11] bg-zinc-50/80 dark:bg-neutral-900/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ zIndex }}
    />
  </Dialog.Overlay>
)

export const ModalInternal: Component<{
  item: ModalProps & { id: string }
  index: number

  isTop: boolean
  onClose?: (open: boolean) => void
}> = memo(function Modal({
  item,
  index,
  onClose: onPropsClose,
  children,
  isTop,
}) {
  const setStack = useSetAtom(modalStackAtom)
  const close = useEventCallback(() => {
    setStack((p) => p.filter((modal) => modal.id !== item.id))
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

  const { opaque, overlay: defaultOverlay } = useUIStore(
    useShallow((state) => ({
      overlay: state.modalOverlay,
      opaque: state.modalOpaque,
    })),
  )

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
    overlay = defaultOverlay,
    draggable = false,
  } = item
  const modalStyle = useMemo(() => ({ zIndex: 99 + index }), [index])
  const dismiss = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      close()
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
  const ModalProps: ModalContentPropsInternal = useMemo(
    () => ({
      dismiss: close,
    }),
    [close],
  )

  const ModalContextProps = useMemo<CurrentModalContentProps>(
    () => ({
      ...ModalProps,
      ref: modalContentRef,
    }),
    [ModalProps],
  )
  const finalChildren = (
    <CurrentModalContext.Provider value={ModalContextProps}>
      {children ?? createElement(content, ModalProps)}
    </CurrentModalContext.Provider>
  )

  const edgeElementRef = useRef<HTMLDivElement>(null)

  if (CustomModalComponent) {
    return (
      <Wrapper>
        <Dialog.Root open onOpenChange={onClose}>
          <Dialog.Portal>
            {overlay && <DialogOverlay zIndex={19} />}

            <Dialog.DialogTitle className="sr-only">{title}</Dialog.DialogTitle>
            <Dialog.Content asChild>
              <div
                className={cn(
                  "fixed inset-0 z-20 overflow-auto",
                  modalContainerClassName,
                )}
                onClick={clickOutsideToDismiss ? dismiss : undefined}
              >
                <div
                  className={cn("contents", modalClassName)}
                  onClick={stopPropagation}
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
          {overlay && <DialogOverlay zIndex={19 + index} />}

          <Dialog.Content asChild>
            <div
              ref={edgeElementRef}
              className={cn(
                "center fixed inset-0 z-20 flex",
                modalContainerClassName,
              )}
              onClick={clickOutsideToDismiss ? dismiss : noticeModal}
            >
              <m.div
                style={modalStyle}
                {...modalMontionConfig}
                animate={animateController}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-lg",
                  opaque ?
                    "bg-zinc-50 dark:bg-neutral-900" :
                    "bg-zinc-50/80 backdrop-blur-sm dark:bg-neutral-900/80",
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
                  <Dialog.DialogClose className="center p-2" onClick={close}>
                    <i className="i-mgc-close-cute-re" />
                  </Dialog.DialogClose>
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
})
