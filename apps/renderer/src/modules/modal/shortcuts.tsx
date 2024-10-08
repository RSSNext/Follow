import clsx from "clsx"
import { m, useDragControls } from "framer-motion"
import { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { useUISettingKey } from "~/atoms/settings/ui"
import { MotionButtonBase } from "~/components/ui/button"
import { KbdCombined } from "~/components/ui/kbd/Kbd"
import { useCurrentModal, useModalStack } from "~/components/ui/modal"
import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { ScrollArea } from "~/components/ui/scroll-area"
import { shortcuts, shortcutsType } from "~/constants/shortcuts"
import { useSwitchHotKeyScope } from "~/hooks/common"
import { cn } from "~/lib/utils"

const ShortcutModalContent = () => {
  const { dismiss } = useCurrentModal()
  const modalOverlay = useUISettingKey("modalOverlay")
  const dragControls = useDragControls()

  const switchScope = useSwitchHotKeyScope()
  useEffect(() => {
    switchScope("Home")
  }, [])
  const { t } = useTranslation("shortcuts")
  return (
    <m.div
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      exit={{
        scale: 0.96,
        opacity: 0,
      }}
      whileDrag={{
        cursor: "grabbing",
      }}
      className={clsx(
        "center absolute inset-0 m-auto flex max-h-[80vh] w-[60ch] max-w-[90vw] flex-col rounded-xl border bg-theme-modal-background-opaque",

        !modalOverlay && "shadow-modal",
      )}
    >
      <h2
        onPointerDownCapture={dragControls.start.bind(dragControls)}
        className="center w-full border-b p-3 font-medium"
      >
        {t("shortcuts.guide.title", { ns: "app" })}
      </h2>
      <MotionButtonBase onClick={dismiss} className="absolute right-3 top-2 p-2">
        <i className="i-mgc-close-cute-re" />
      </MotionButtonBase>
      <ScrollArea.ScrollArea scrollbarClassName="w-2" rootClassName="w-full h-full">
        <div className="w-full space-y-6 px-4 pb-5 pt-3">
          {Object.keys(shortcuts).map((type) => (
            <section key={type}>
              <div className="mb-2 text-base font-medium capitalize">{t(shortcutsType[type])}</div>
              <div className="rounded-md border text-[13px] text-zinc-600 dark:text-zinc-300">
                {Object.keys(shortcuts[type]).map((action, index) => (
                  <div
                    key={`${type}-${action}`}
                    className={cn(
                      "flex h-9 items-center justify-between px-3 py-1.5",
                      index % 2 && "bg-native/40",
                    )}
                  >
                    <div>{t(shortcuts[type][action].name)}</div>
                    <div>
                      <KbdCombined joint>
                        {`${shortcuts[type][action].key}${shortcuts[type][action].extra ? `, ${shortcuts[type][action].extra}` : ""}`}
                      </KbdCombined>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </ScrollArea.ScrollArea>
    </m.div>
  )
}

export const useShortcutsModal = () => {
  const { present, dismiss, getModalStackById } = useModalStack()
  const id = "shortcuts"

  const showShortcutsModal = useCallback(() => {
    present({
      title: "Shortcuts",
      id,
      overlay: false,
      content: () => <ShortcutModalContent />,
      CustomModalComponent: PlainModal,
      clickOutsideToDismiss: true,
    })
  }, [present])

  return useCallback(() => {
    const shortcutsModal = getModalStackById(id)
    if (shortcutsModal && shortcutsModal.modal) {
      dismiss(id)
      return
    }
    showShortcutsModal()
  }, [dismiss, getModalStackById, showShortcutsModal])
}
