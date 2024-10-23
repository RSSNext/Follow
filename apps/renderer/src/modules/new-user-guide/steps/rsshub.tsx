import { ScrollArea } from "~/components/ui/scroll-area"
import { useAuthQuery } from "~/hooks/common"
import { Recommendations } from "~/modules/discover/recommendations"
import { Queries } from "~/queries"

export function RSSHubGuide() {
  const rsshubPopular = useAuthQuery(
    Queries.discover.rsshubCategory({
      category: "popular",
    }),
    {
      meta: {
        persist: true,
      },
    },
  )

  const { data } = rsshubPopular

  if (rsshubPopular.isLoading) {
    return null
  }

  if (!data) {
    return null
  }

  return (
    <ScrollArea.ScrollArea viewportClassName="h-[450px]">
      <div className="space-y-3">
        <Recommendations hideTitle className="grid-cols-4" />
      </div>
    </ScrollArea.ScrollArea>
  )
}
