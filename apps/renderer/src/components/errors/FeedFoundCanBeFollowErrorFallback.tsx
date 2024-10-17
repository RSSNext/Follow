import type { FC } from "react"
import { useNavigate } from "react-router-dom"

import { getSidebarActiveView } from "~/atoms/sidebar"
import { getRouteParams } from "~/hooks/biz/useRouteParams"
import { nextFrame } from "~/lib/dom"
import type { FeedModel } from "~/models"
import { FeedForm } from "~/modules/discover/feed-form"
import { entries } from "~/queries/entries"

import type { AppErrorFallbackProps } from "../common/AppErrorBoundary"
import { FeedIcon } from "../feed-icon"
import { Button } from "../ui/button"
import { useModalStack } from "../ui/modal"
import { CustomSafeError, useResetErrorWhenRouteChange } from "./helper"

const FeedFoundCanBeFollowErrorFallback: FC<AppErrorFallbackProps> = ({ resetError, error }) => {
  if (!(error instanceof FeedFoundCanBeFollowError)) {
    throw error
  }
  const feed = error.detail
  const { present } = useModalStack()
  const navigate = useNavigate()
  useResetErrorWhenRouteChange(resetError)

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-md bg-theme-modal-background-opaque p-2">
      <div className="center m-auto flex max-w-prose flex-col gap-4 text-center">
        <FeedIcon feed={feed} size={60} className="rounded" />

        <div className="text-lg font-bold">{feed.title}</div>

        <p className="my-3">{feed.description}</p>

        <div className="center gap-1 opacity-80">
          <i className="i-mgc-information-cute-re" />
          We found this feed in our database, you can follow it or go back to homepage.
        </div>
        <div className="center mt-12 gap-4">
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
      </div>
    </div>
  )
}

export default FeedFoundCanBeFollowErrorFallback
export class FeedFoundCanBeFollowError extends CustomSafeError {
  constructor(public detail: FeedModel) {
    super("Feed Found Can Be Follow")
  }
}
