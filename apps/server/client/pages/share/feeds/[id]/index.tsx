import { useEntriesPreview } from "@client/query/entries"
import { useFeed } from "@client/query/feed"
import { FeedIcon } from "@follow/components/ui/feed-icon/index.jsx"
import { LoadingCircle } from "@follow/components/ui/loading/index.jsx"
import type { FeedModel } from "@follow/shared/hono"
import { useParams, useSearchParams } from "react-router-dom"

export function Component() {
  const { id } = useParams()
  const [search] = useSearchParams()
  const view = Number.parseInt(search.get("view") || "0")

  const feed = useFeed({
    id: id!,
  })

  const feedData = feed.data?.feed
  const isSubscribed = !!feed.data?.subscription
  const entries = useEntriesPreview({
    id,
  })

  if (feed.isLoading || !feed.data?.feed) {
    return (
      <>
        <LoadingCircle size="large" className="center fixed inset-0" />
      </>
    )
  }

  return (
    <div className="mx-auto mt-12 flex w-full max-w-5xl flex-col items-center justify-center p-4 lg:p-0">
      <FeedIcon fallback feed={feed.data.feed} className="mask-squircle mask shrink-0" size={64} />
    </div>
  )

  // const feedData = feed.data?.feed as FeedModel
  // const isSubscribed = !!feed.data?.subscription
  // const entries = useEntriesPreview({
  //   id,
  // })

  // const Item: FC<UniversalItemProps> = getItemComponentByView(view as FeedViewType)

  // const { t } = useTranslation("external")
  // useTitle(feed.data?.feed.title)
  // const presentFeedFormModal = usePresentFeedFormModal()
  // return (
  //   <>
  //     {feed.isLoading ? (
  //       <LoadingCircle size="large" className="center fixed inset-0" />
  //     ) : (
  //       feed.data?.feed && (
  //         <div className="mx-auto mt-12 flex w-full max-w-5xl flex-col items-center justify-center p-4 lg:p-0">
  //           <FeedIcon
  //             fallback
  //             feed={feed.data.feed}
  //             className="mask-squircle mask shrink-0"
  //             size={64}
  //           />
  //           <div className="flex flex-col items-center">
  //             <div className="mb-2 mt-4 flex items-center text-2xl font-bold">
  //               <h1>{feed.data.feed.title}</h1>
  //               <FeedCertification feed={feed.data.feed} />
  //             </div>
  //             <div className="mb-8 text-sm text-zinc-500">{feed.data.feed.description}</div>
  //           </div>
  //           <div className="mb-4 text-sm">
  //             {t("feed.followsAndReads", {
  //               subscriptionCount: feed.data.subscriptionCount,
  //               subscriptionNoun: t("feed.follower", { count: feed.data.subscriptionCount }),
  //               readCount: feed.data.readCount,
  //               readNoun: t("feed.read", { count: feed.data.readCount }),
  //               appName: APP_NAME,
  //             })}
  //           </div>
  //           <span className="center mb-8 flex gap-4">
  //             {feedData.url.startsWith("https://") ? (
  //               <Button
  //                 variant={"outline"}
  //                 onClick={() => {
  //                   window.open(feedData.url, "_blank")
  //                 }}
  //               >
  //                 {t("feed.view_feed_url")}
  //               </Button>
  //             ) : (
  //               <Button
  //                 variant={"outline"}
  //                 onClick={() => {
  //                   toast.success(t("copied_link"))
  //                   navigator.clipboard.writeText(feedData.url)
  //                 }}
  //               >
  //                 {t("feed.copy_feed_url")}
  //               </Button>
  //             )}
  //             <Button
  //               variant={isSubscribed ? "outline" : undefined}
  //               onClick={() => {
  //                 presentFeedFormModal({
  //                   feedId: id!,
  //                 })
  //               }}
  //             >
  //               <FollowIcon className="mr-1 size-3" />
  //               {isSubscribed ? t("feed.actions.followed") : <>{APP_NAME}</>}
  //             </Button>
  //           </span>
  //           <div
  //             className={cn(
  //               "w-full pb-12 pt-8",
  //               views[view].gridMode
  //                 ? "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
  //                 : "flex max-w-3xl flex-col gap-6",
  //             )}
  //           >
  //             {entries.data?.map((entry) => (
  //               <a
  //                 className="relative cursor-pointer"
  //                 href={entry.url || void 0}
  //                 target="_blank"
  //                 key={entry.id}
  //               >
  //                 <div className="rounded-xl pl-3 duration-300 hover:bg-theme-item-active">
  //                   <Item
  //                     entryPreview={{
  //                       entries: entry,
  //                       feeds: feedData,
  //                       read: true,
  //                       feedId: feedData.id!,
  //                     }}
  //                     entryId={entry.id}
  //                   />
  //                 </div>
  //               </a>
  //             ))}
  //           </div>
  //           <PoweredByFooter className="pb-12" />
  //         </div>
  //       )
  //     )}
  //   </>
  // )
}
