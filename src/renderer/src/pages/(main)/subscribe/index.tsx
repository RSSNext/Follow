import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs"
import { Recommendations } from "@renderer/components/subscribe/recommendations"
import { RSSForm } from "@renderer/components/subscribe/rss-form"
import { RSSHubForm } from "@renderer/components/subscribe/rsshub-form"
import { FollowUserForm } from "@renderer/components/subscribe/follow-user-form"

export function Component() {
  const tabs = [
    {
      name: "RSS",
      content: <RSSForm />,
    },
    {
      name: "RSSHub",
      content: <RSSHubForm />,
    },
    {
      name: "Follow User",
      content: <FollowUserForm />,
    },
    {
      name: "RSS3",
    },
    {
      name: "Email",
    },
  ]

  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full">
      <div className="text-2xl font-bold">Subscribe</div>
      <Tabs defaultValue="RSS">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.name}
              disabled={!tab.content}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.name} value={tab.name} className="h-96 mt-8">
            {tab.content || <span className="text-zinc-500">Comming Soon</span>}
            {tab.content && <Recommendations type={tab.name} />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
