import { getSidebarActiveView } from "@renderer/atoms/sidebar"
import { FollowSummary } from "@renderer/components/feed-summary"
import { Button } from "@renderer/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@renderer/components/ui/card"
import { Media } from "@renderer/components/ui/media"
import { useModalStack } from "@renderer/components/ui/modal"
import { useSubscriptionByFeedId } from "@renderer/store/subscription"

import { FeedForm } from "./feed-form"
import type { FeedCardData } from "./types"

export const FeedCard = ({ data }: { data: FeedCardData }) => {
  const { present } = useModalStack()
  const hasSub = useSubscriptionByFeedId(data.feed.id || "")

  return (
    <Card data-feed-id={data.feed.id} key={data.feed.url || data.docs} className="select-text">
        <CardHeader>
          <FollowSummary className="max-w-[462px]" feed={data.feed} docs={data.docs} />
        </CardHeader>
        {data.docs ? (
          <CardFooter>
            <a href={data.docs} target="_blank" rel="noreferrer">
              <Button>View Docs</Button>
            </a>
          </CardFooter>
        ) : (
          <>
            <CardContent>
              {!!data.entries?.length && (
                <div className="grid grid-cols-4 gap-4">
                  {data.entries
                    .filter((e) => !!e)
                    .map((entry) => {
                      const assertEntry = entry
                      return (
                        <a
                          key={assertEntry.id}
                          href={assertEntry.url || void 0}
                          target="_blank"
                          className="flex min-w-0 flex-1 flex-col items-center gap-1"
                          rel="noreferrer"
                        >
                          {assertEntry.media?.[0] ? (
                            <Media
                              src={assertEntry.media?.[0].url}
                              type={assertEntry.media?.[0].type}
                              previewImageUrl={assertEntry.media?.[0].preview_image_url}
                              className="aspect-square w-full"
                            />
                          ) : (
                            <div className="flex aspect-square w-full overflow-hidden rounded bg-stone-100 p-2 text-xs leading-tight text-zinc-500">
                              {assertEntry.title}
                            </div>
                          )}
                          <div className="line-clamp-2 w-full text-xs leading-tight">
                            {assertEntry.title}
                          </div>
                        </a>
                      )
                    })}
                </div>
              )}
            </CardContent>
            <CardFooter>
              {hasSub ? (
                <Button variant="outline" disabled>
                  Followed
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    present({
                      title: "Add Feed",
                      content: ({ dismiss }) => (
                        <FeedForm
                          asWidget
                          url={data.feed.url}
                          id={data.feed.id}
                          defaultValues={{
                            view: getSidebarActiveView().toString(),
                          }}
                          onSuccess={dismiss}
                        />
                      ),
                    })
                  }}
                >
                  Follow
                </Button>
              )}
              <div className="ml-6 text-zinc-500">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {data.subscriptionCount}
                </span>{" "}
                Followers
              </div>
            </CardFooter>
          </>
        )}
    </Card>
  )
}
