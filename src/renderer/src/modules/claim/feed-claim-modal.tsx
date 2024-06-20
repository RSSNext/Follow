import { LoadingCircle } from "@renderer/components/ui/loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import { useBizQuery } from "@renderer/hooks"
import { Queries } from "@renderer/queries"
import { useFeedById } from "@renderer/store"
import type { FC } from "react"

export const FeedClaimModalContent: FC<{
  feedId: string
}> = ({ feedId }) => {
  const feed = useFeedById(feedId)

  const { data: claimMessage, isLoading, error } = useBizQuery(
    Queries.feed.claimMessage({ feedId }),
    {
      enabled: !!feed,
    },
  )
  if (!feed) return null

  if (isLoading) {
    return <LoadingCircle size="large" className="h-24" />
  }

  if (error) { return <div>Failed to load claim message</div> }

  return (
    <div className="w-[650px] max-w-full">
      <p>
        To claim this feed as your own, you need to verify ownership.
      </p>
      <p>
        There are three ways to choose from, you can choose one of them to verify.
      </p>
      <Tabs defaultValue="content" className="mt-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="content">
            Content
          </TabsTrigger>
          <TabsTrigger value="description">
            Description
          </TabsTrigger>
          <TabsTrigger value="rss">
            RSS Tag
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <pre className="cursor-auto select-text whitespace-pre-line break-words">
            <code>
              {claimMessage?.data.content}
            </code>
          </pre>
        </TabsContent>
        <TabsContent value="description">
          <div>{claimMessage?.data.description}</div>
        </TabsContent>
        <TabsContent value="rss">
          <div>{claimMessage?.data.xml}</div>
        </TabsContent>
      </Tabs>

    </div>
  )
}
