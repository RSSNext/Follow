import { useOnce } from "@follow/hooks"
import { repository } from "@pkg"
import type { FC } from "react"
import { toast } from "sonner"

import { Markdown } from "~/components/ui/markdown/Markdown"
import { PeekModal } from "~/components/ui/modal/inspire/PeekModal"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { Paper } from "~/components/ui/paper"
import { isDev } from "~/constants"
import { DebugRegistry } from "~/modules/debug/registry"

const AppUpgradeProvider: FC = () => {
  const { present } = useModalStack()
  useOnce(() => {
    const toaster = () => {
      toast.success(
        <div>
          App is upgraded to{" "}
          <a href={`${repository.url}/releases/tag/${APP_VERSION}`}>{APP_VERSION}</a>, enjoy the new
          features! 🎉
        </div>,
        {
          duration: 10e8,
          action: CHANGELOG_CONTENT
            ? {
                label: "What's new?",
                onClick: () => {
                  present({
                    clickOutsideToDismiss: true,
                    title: "What's new?",
                    autoFocus: false,
                    modalClassName:
                      "relative mx-auto mt-[10vh] scrollbar-none max-w-full overflow-auto px-2 lg:max-w-[65rem] lg:p-0",

                    CustomModalComponent: ({ children }) => {
                      return <PeekModal>{children}</PeekModal>
                    },
                    content: Changelog,
                    overlay: true,
                  })
                },
              }
            : undefined,
        },
      )
    }
    if (window.__app_is_upgraded__) {
      setTimeout(toaster)
    }

    isDev && DebugRegistry.add("simulate_app_upgraded_toast", toaster)
  })

  return null
}

export default AppUpgradeProvider

const Changelog = () => (
  <Paper>
    <Markdown className="mt-8">{CHANGELOG_CONTENT}</Markdown>
  </Paper>
)
