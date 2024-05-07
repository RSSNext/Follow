import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs"
import { Recommendations } from "@renderer/components/subscribe/recommendations"
import { SubscribeForm } from "@renderer/components/subscribe/form"

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
  ]

  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full overflow-y-auto">
      <div className="text-2xl font-bold">Subscribe</div>
      <Tabs defaultValue="General">
        <TabsList>
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
            <SubscribeForm type={tab.value} />
            <Recommendations type={tab.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
