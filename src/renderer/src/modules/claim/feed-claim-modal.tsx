import { AutoResizeHeight } from "@renderer/components/ui/auto-resize-height"
import { StyledButton } from "@renderer/components/ui/button"
import {
  CopyButton,
  ShikiHighLighter,
} from "@renderer/components/ui/code-highlighter"
import { useShikiDefaultTheme } from "@renderer/components/ui/code-highlighter/shiki/hooks"
import { LoadingCircle } from "@renderer/components/ui/loading"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs"
import { useBizQuery } from "@renderer/hooks"
import { Queries } from "@renderer/queries"
import { useClaimFeedMutation } from "@renderer/queries/feed"
import { useFeedById } from "@renderer/store"
import type { FC } from "react"

export const FeedClaimModalContent: FC<{
  feedId: string
}> = ({ feedId }) => {
  const feed = useFeedById(feedId)
  const {
    data: claimMessage,
    isLoading,
    error,
  } = useBizQuery(Queries.feed.claimMessage({ feedId }), {
    enabled: !!feed,
  })

  const {
    mutateAsync: claim,
    isPending,
    isSuccess,
  } = useClaimFeedMutation(feedId)

  const shikiTheme = useShikiDefaultTheme()

  if (!feed) return null

  if (isLoading) {
    return (
      <div className="center h-32 w-[650px]">
        <LoadingCircle size="large" />
      </div>
    )
  }

  if (error) {
    return <div>Failed to load claim message</div>
  }

  return (
    <div className="w-[650px] max-w-full">
      <p>To claim this feed as your own, you need to verify ownership.</p>
      <p>
        There are three ways to choose from, you can choose one of them to
        verify.
      </p>
      <Tabs defaultValue="content" className="mt-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="rss">RSS Tag</TabsTrigger>
        </TabsList>
        <AutoResizeHeight duration={0.1}>
          <TabsContent className="mt-0 pt-3" value="content">
            <p>Copy the content below and post it to your latest RSS feed.</p>

            <BaseCodeBlock>{claimMessage?.data.content || ""}</BaseCodeBlock>
          </TabsContent>
          <TabsContent className="mt-0 pt-3" value="description">
            <p>
              Copy the following content and paste it into the
              {" "}
              <code className="text-sm">{`<description />`}</code>
              {" "}
              field of your
              RSS feed.
            </p>
            <BaseCodeBlock>
              {claimMessage?.data.description || ""}
            </BaseCodeBlock>
          </TabsContent>
          <TabsContent className="mt-0 pt-3" value="rss">
            <div className="space-y-3">
              <p>Copy the code below and paste it into your RSS generator.</p>
              <p>
                RSS generators generally have two formats to choose from. Please
                copy the XML and JSON formats below as needed.
              </p>
              <p>
                <b>XML Format</b>
              </p>
              <ShikiHighLighter
                transparent
                theme={shikiTheme}
                className="group relative mt-3 cursor-auto select-text whitespace-pre break-words rounded-lg border border-border bg-zinc-100 p-2 text-sm dark:bg-neutral-800 [&_pre]:whitespace-pre [&_pre]:break-words [&_pre]:!p-0"
                code={claimMessage?.data.xml || ""}
                language="xml"
              />
              <p>
                <b>JSON Format</b>
              </p>
              <ShikiHighLighter
                transparent
                theme={shikiTheme}
                className="group relative mt-3 cursor-auto select-text whitespace-pre break-words rounded-lg border border-border bg-zinc-100 p-2 text-sm dark:bg-neutral-800 [&_pre]:whitespace-pre [&_pre]:break-words [&_pre]:!p-0"
                code={JSON.stringify(
                  JSON.parse(claimMessage?.data.json || "{}"),
                  null,
                  2,
                )}
                language="json"
              />
            </div>
          </TabsContent>
        </AutoResizeHeight>
      </Tabs>

      <div className="mt-3 flex justify-end">
        <StyledButton
          disabled={isSuccess}
          isLoading={isPending}
          onClick={() => claim()}
          variant={isSuccess ? "plain" : "primary"}
        >
          {isSuccess && (
            <i className="i-mgc-check-circle-filled mr-2 bg-green-500" />
          )}
          Claim
        </StyledButton>
      </div>
    </div>
  )
}

const BaseCodeBlock: FC<{
  children: string
}> = ({ children }) => (
  <pre className="group relative mt-3 cursor-auto select-text whitespace-pre-line break-words rounded-lg border border-border bg-zinc-100 p-2 text-sm dark:bg-neutral-800">
    <code>{children}</code>
    <CopyButton
      value={children}
      className="absolute bottom-2 right-2 z-[3] opacity-0 group-hover:opacity-100"
    />
  </pre>
)
