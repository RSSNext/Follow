import type { FC } from "react"
import { useNavigate } from "react-router-dom"

import { getSidebarActiveView } from "~/atoms/sidebar"
import { getRouteParams } from "~/hooks/biz/useRouteParams"
import { nextFrame } from "~/lib/dom"
import type { FeedModel } from "~/models"
import { FeedForm } from "~/modules/discover/feed-form"
import { entries } from "~/queries/entries"

import type { AppErrorFallbackProps } from "../common/AppErrorBoundary"
import { Button } from "../ui/button"
import { useModalStack } from "../ui/modal"
import { CustomSafeError, useResetErrorWhenRouteChange } from "./helper"
import { FeedPreview } from "./previews/FeedPreview"

const FeedFoundCanBeFollowErrorFallback: FC<AppErrorFallbackProps> = ({ resetError, error }) => {
  if (!(error instanceof FeedFoundCanBeFollowError)) {
    throw error
  }
  const feed = error.detail
  const { present } = useModalStack()
  const navigate = useNavigate()
  useResetErrorWhenRouteChange(resetError)

  return (
    <div className="flex w-full flex-col overflow-auto bg-theme-modal-background-opaque p-2">
      <FeedPreview feedId={feed.id}>
        {{
          actions: (
            <div className="center mt-3 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/")
                  setTimeout(() => {
                    resetError()
                  }, 100)
                }}
              >
                Back
              </Button>

              <Button
                onClick={() => {
                  present({
                    title: "Add Feed",
                    content: ({ dismiss }) => (
                      <FeedForm
                        asWidget
                        url={feed.url}
                        defaultValues={{
                          view: getSidebarActiveView().toString(),
                        }}
                        onSuccess={() => {
                          dismiss()

                          const { feedId, view } = getRouteParams()

                          const entriesOptions = {
                            id: feedId,
                            view,
                          }

                          entries.entries(entriesOptions).remove()
                          nextFrame(() => resetError())
                        }}
                      />
                    ),
                  })
                }}
                variant="primary"
              >
                Follow
              </Button>
            </div>
          ),
        }}
      </FeedPreview>
    </div>
  )
}

export default FeedFoundCanBeFollowErrorFallback
export class FeedFoundCanBeFollowError extends CustomSafeError {
  constructor(public detail: FeedModel) {
    super("Feed Found Can Be Follow")
  }
}
