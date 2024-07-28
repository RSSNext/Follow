import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs"
import { DiscoverForm } from "@renderer/modules/discover/form"
import { DiscoverImport } from "@renderer/modules/discover/import"
import { Recommendations } from "@renderer/modules/discover/recommendations"
import { DiscoverRSS3 } from "@renderer/modules/discover/rss3-form"
import { createElement } from "react"

export function Component() {
  const tabs = [
    {
      name: "Search",
      value: "search",
    },
    {
      name: "RSS",
      value: "rss",
    },
    {
      name: "RSSHub",
      value: "rsshub",
    },
    {
      name: "RSS3",
      value: "rss3",
    },
    {
      name: "Email",
      value: "email",
      disabled: true,
    },
    {
      name: "Import",
      value: "import",
    },
  ]

  return (
    <div className="flex w-full flex-col items-center gap-8 overflow-y-auto pb-10 pt-40">
      <div className="text-2xl font-bold">Discover</div>
      <Tabs defaultValue="Search">
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.name}
              disabled={tab.disabled}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.name} value={tab.name} className="mt-8">
            {TabComponent[tab.value] ? (
              createElement(TabComponent[tab.value])
            ) : (
              <DiscoverForm type={tab.value} />
            )}
          </TabsContent>
        ))}
      </Tabs>
      <Recommendations />
    </div>
  )
}

const TabComponent = {
  import: DiscoverImport,
  rss3: DiscoverRSS3,
}
