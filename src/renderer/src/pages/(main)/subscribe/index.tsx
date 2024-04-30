import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs"
import { GeneralForm } from "@renderer/components/subscribe/general-form"

export function Component() {
  const tabs = [
    {
      name: "General",
      content: <GeneralForm />,
    },
    {
      name: "RSS",
    },
    {
      name: "RSSHub",
    },
    {
      name: "RSS3",
    },
    {
      name: "ReadOK User",
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
            <TabsTrigger value={tab.name}>{tab.name}</TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent value={tab.name} className="h-96">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
