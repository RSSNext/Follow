import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs"
import { Recommendations } from "@renderer/components/follow/recommendations"
import { FollowForm } from "@renderer/components/follow/form"
import { FollowImport } from "@renderer/components/follow/import"

export function Component() {
  const tabs = [
    {
      name: "General",
      value: "general",
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
    <div className="flex flex-col gap-8 items-center justify-center w-full overflow-y-auto">
      <div className="text-2xl font-bold">Follow</div>
      <Tabs defaultValue="General">
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
          <TabsContent key={tab.name} value={tab.name} className="h-96 mt-8">
            {tab.value === "import" ? (
              <FollowImport />
            ) : (
              <FollowForm type={tab.value} />
            )}
            <Recommendations type={tab.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
