import * as Dialog from "@radix-ui/react-dialog"
import type { BoundingBox } from "framer-motion"
import { useAnimationControls, useDragControls } from "framer-motion"
import { produce } from "immer"
import { useSetAtom } from "jotai"
import { Resizable } from "re-resizable"
import type { PointerEventHandler, PropsWithChildren, SyntheticEvent } from "react"
import {
  createElement,
  forwardRef,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"

import { useUISettingKey } from "~/atoms/settings/ui"
import { AppErrorBoundary } from "~/components/common/AppErrorBoundary"
import { SafeFragment } from "~/components/common/Fragment"
import { m } from "~/components/common/Motion"
import { ErrorComponentType } from "~/components/errors/enum"
import { resizableOnly } from "~/components/ui/modal"
import { ElECTRON_CUSTOM_TITLEBAR_HEIGHT, isElectronBuild } from "~/constants"
import { useSwitchHotKeyScope } from "~/hooks/common"
import { nextFrame, stopPropagation } from "~/lib/dom"
import { cn, getOS } from "~/lib/utils"

import { Divider } from "../../divider"
import { RootPortalProvider } from "../../portal/provider"
import { EllipsisHorizontalTextWithTooltip } from "../../typography"
import { modalStackAtom } from "./atom"
import { MODAL_STACK_Z_INDEX, modalMontionConfig } from "./constants"
import type { CurrentModalContentProps, ModalActionsInternal } from "./context"
import { CurrentModalContext } from "./context"
import { useResizeableModal } from "./hooks"
import type { ModalProps } from "./types"

const DragBar = isElectronBuild ? (
  <span className="drag-region fixed left-0 right-36 top-0 h-8" />
) : null
export const ModalInternal = memo(
  forwardRef<
    HTMLDivElement,
    {
      item: ModalProps & { id: string }
      index: number

      isTop: boolean
      onClose?: (open: boolean) => void
    } & PropsWithChildren
  >(function Modal({ item, index, onClose: onPropsClose, children, isTop }, ref) {
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
      resizeable = false,
      resizeDefaultSize,
      modal = true,
      autoFocus = true,
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

    const zIndexStyle = useMemo(() => ({ zIndex: MODAL_STACK_Z_INDEX + index + 1 }), [index])
    const dismiss = useCallback(
      (e: SyntheticEvent) => {
        e.stopPropagation()

        close(true)
      },
      [close],
    )

    const modalElementRef = useRef<HTMLDivElement>(null)

    const {
      handlePointDown: handleResizeEnable,
      isResizeable,
      resizeableStyle,
    } = useResizeableModal(modalElementRef, {
      enableResizeable: resizeable,
    })
    const animateController = useAnimationControls()
    useEffect(() => {
      nextFrame(() => {
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
          setStack((state) =>
            produce(state, (draft) => {
              const model = draft.find((modal) => modal.id === item.id)
              if (!model) return
              if (model.clickOutsideToDismiss === v) return
              model.clickOutsideToDismiss = v
            }),
          )
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

    const edgeElementRef = useRef<HTMLDivElement>(null)

    const finalChildren = useMemo(
      () => (
        <AppErrorBoundary errorType={ErrorComponentType.Modal}>
          <RootPortalProvider value={edgeElementRef.current as HTMLElement}>
            {children ?? createElement(content, ModalProps)}
          </RootPortalProvider>
        </AppErrorBoundary>
      ),
      [ModalProps, children, content],
    )

    useEffect(() => {
      if (currentIsClosing) {
        // Radix dialog will block pointer events
        document.body.style.pointerEvents = "auto"
      }
    }, [currentIsClosing])

    const switchHotkeyScope = useSwitchHotKeyScope()
    useEffect(() => {
      switchHotkeyScope("Modal")
      return () => {
        switchHotkeyScope("Home")
      }
    }, [switchHotkeyScope])

    const modalStyle = useMemo(
      () => ({ ...zIndexStyle, ...resizeableStyle }),
      [resizeableStyle, zIndexStyle],
    )
    const isSelectingRef = useRef(false)
    const handleSelectStart = useCallback(() => {
      isSelectingRef.current = true
    }, [])
    const handleDetectSelectEnd = useCallback(() => {
      nextFrame(() => {
        if (isSelectingRef.current) {
          isSelectingRef.current = false
        }
      })
    }, [])

    const handleClickOutsideToDismiss = useCallback(
      (e: SyntheticEvent) => {
        if (isSelectingRef.current) return
        const fn = modal ? (clickOutsideToDismiss && canClose ? dismiss : noticeModal) : undefined
        fn?.(e)
      },
      [canClose, clickOutsideToDismiss, dismiss, modal, noticeModal],
    )

    const openAutoFocus = useCallback(
      (event: Event) => {
        if (!autoFocus) {
          event.preventDefault()
        }
      },
      [autoFocus],
    )

    const measureDragConstraints = useCallback((constraints: BoundingBox) => {
      if (getOS() === "Windows") {
        return {
          ...constraints,
          top: constraints.top + ElECTRON_CUSTOM_TITLEBAR_HEIGHT,
        }
      }
      return constraints
    }, [])

    useImperativeHandle(ref, () => modalElementRef.current!)
    if (CustomModalComponent) {
      return (
        <Wrapper>
          <Dialog.Root open onOpenChange={onClose} modal={modal}>
            <Dialog.Portal>
              <Dialog.DialogTitle className="sr-only">{title}</Dialog.DialogTitle>
              <Dialog.Content asChild onOpenAutoFocus={openAutoFocus}>
                <div
                  ref={edgeElementRef}
                  className={cn(
                    "no-drag-region fixed z-20",
                    modal ? "inset-0 overflow-auto" : "left-0 top-0",
                    currentIsClosing ? "!pointer-events-none" : "!pointer-events-auto",
                    modalContainerClassName,
                  )}
                  onPointerUp={handleDetectSelectEnd}
                  onClick={handleClickOutsideToDismiss}
                  onFocus={stopPropagation}
                  style={zIndexStyle}
                >
                  {DragBar}
                  <div
                    className={cn("contents", modalClassName)}
                    onClick={stopPropagation}
                    ref={modalElementRef}
                    onSelect={handleSelectStart}
                    onKeyUp={handleDetectSelectEnd}
                  >
                    <CurrentModalContext.Provider value={ModalContextProps}>
                      <CustomModalComponent>{finalChildren}</CustomModalComponent>
                    </CurrentModalContext.Provider>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </Wrapper>
      )
    }

    const ResizeSwitch = resizeable ? Resizable : SafeFragment

    return (
      <Wrapper>
        <Dialog.Root modal={modal} open onOpenChange={onClose}>
          <Dialog.Portal>
            <Dialog.Content asChild onOpenAutoFocus={openAutoFocus}>
              <div
                ref={edgeElementRef}
                style={zIndexStyle}
                className={cn(
                  "fixed z-20 flex",
                  modal ? "inset-0 overflow-auto" : "left-0 top-0",
                  currentIsClosing && "!pointer-events-none",
                  modalContainerClassName,
                  !isResizeable && "center",
                )}
                onFocus={stopPropagation}
                onPointerUp={handleDetectSelectEnd}
                onClick={handleClickOutsideToDismiss}
              >
                {DragBar}

                <m.div
                  ref={modalElementRef}
                  style={modalStyle}
                  {...modalMontionConfig}
                  animate={animateController}
                  className={cn(
                    "relative flex flex-col overflow-hidden rounded-lg p-2",
                    opaque
                      ? "bg-theme-modal-background-opaque"
                      : "bg-theme-modal-background backdrop-blur-sm",
                    "shadow-modal",
                    max ? "h-[90vh] w-[90vw]" : "max-h-[90vh]",

                    "border border-slate-200 dark:border-neutral-800",
                    modalClassName,
                  )}
                  onClick={stopPropagation}
                  onSelect={handleSelectStart}
                  onKeyUp={handleDetectSelectEnd}
                  drag
                  dragControls={dragController}
                  dragElastic={0}
                  dragListener={false}
                  dragMomentum={false}
                  dragConstraints={edgeElementRef}
                  onMeasureDragConstraints={measureDragConstraints}
                  whileDrag={{
                    cursor: "grabbing",
                  }}
                >
                  <ResizeSwitch
                    enable={resizableOnly("bottomRight")}
                    onResizeStart={handleResizeEnable}
                    defaultSize={resizeDefaultSize}
                    className="flex grow flex-col"
                  >
                    <div
                      className={"relative flex items-center"}
                      onPointerDownCapture={handleDrag}
                      onPointerDown={handleResizeEnable}
                    >
                      <Dialog.Title className="flex w-0 max-w-full grow items-center gap-2 px-4 py-1 text-lg font-semibold">
                        {icon && <span className="size-4">{icon}</span>}
                        <EllipsisHorizontalTextWithTooltip className="truncate">
                          <span>{title}</span>
                        </EllipsisHorizontalTextWithTooltip>
                      </Dialog.Title>
                      {canClose && (
                        <Dialog.DialogClose className="center p-2" tabIndex={1} onClick={close}>
                          <i className="i-mgc-close-cute-re" />
                        </Dialog.DialogClose>
                      )}
                    </div>
                    <Divider className="my-2 shrink-0 border-slate-200 opacity-80 dark:border-neutral-800" />

                    <div className="min-h-0 shrink grow overflow-auto px-4 py-2">
                      <CurrentModalContext.Provider value={ModalContextProps}>
                        {finalChildren}
                      </CurrentModalContext.Provider>
                    </div>
                  </ResizeSwitch>
                </m.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Wrapper>
    )
  }),
)
