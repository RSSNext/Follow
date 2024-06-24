import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs"
import { DiscoverForm } from "@renderer/modules/discover/form"
import { DiscoverImport } from "@renderer/modules/discover/import"
import { Recommendations } from "@renderer/modules/discover/recommendations"

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
      name: "Follow User",
      value: "user",
      disabled: true,
    },
    {
      name: "RSS3",
      value: "rss3",
      disabled: true,
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
            {tab.value === "import" ?
                (
                  <DiscoverImport />
                ) :
                (
                  <DiscoverForm type={tab.value} />
                )}
          </TabsContent>
        ))}
      </Tabs>
      <Recommendations />
    </div>
  )
}
