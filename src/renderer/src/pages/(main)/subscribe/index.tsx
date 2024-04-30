import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs"
import { Recommendations } from "@renderer/components/subscribe/recommendations"
import { GeneralForm } from "@renderer/components/subscribe/general-form"
import { RSSForm } from "@renderer/components/subscribe/rss-form"
import { RSSHubForm } from "@renderer/components/subscribe/rsshub-form"
import { ReadOKUserForm } from "@renderer/components/subscribe/readok-user-form"

export function Component() {
  const tabs = [
    {
      name: "General",
      content: <GeneralForm />,
    },
    {
      name: "RSS",
      content: <RSSForm />,
    },
    {
      name: "RSSHub",
      content: <RSSHubForm />,
    },
    {
      name: "RSS3",
    },
    {
      name: "ReadOK User",
      content: <ReadOKUserForm />,
    },
    {
      name: "Email",
    },
  ]

  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full">
      <div className="text-2xl font-bold">Subscribe</div>
      <Tabs defaultValue="General">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.name}>
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
