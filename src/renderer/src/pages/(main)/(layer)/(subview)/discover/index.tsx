import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import { DiscoverForm } from "@renderer/modules/discover/form"
import { DiscoverImport } from "@renderer/modules/discover/import"
import { Recommendations } from "@renderer/modules/discover/recommendations"
import { DiscoverRSS3 } from "@renderer/modules/discover/rss3-form"
import { DiscoverUser } from "@renderer/modules/discover/user-form"
import { createElement } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

import { useSubViewTitle } from "../hooks"

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
    name: "User",
    value: "user",
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

export function Component() {
  const [search, setSearch] = useSearchParams()
  const { t } = useTranslation()
  useSubViewTitle("Discover")

  return (
    <>
      <div className="text-2xl font-bold">{t("words.discover")}</div>
      <Tabs
        value={search.get("type") || "search"}
        onValueChange={(val) => {
          setSearch((search) => {
            search.set("type", val)
            return new URLSearchParams(search)
          })
        }}
      >
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.value} disabled={tab.disabled}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.name} value={tab.value} className="mt-8">
            {TabComponent[tab.value] ? (
              createElement(TabComponent[tab.value])
            ) : (
              <DiscoverForm type={tab.value} />
            )}
          </TabsContent>
        ))}
      </Tabs>
      <Recommendations />
    </>
  )
}

const TabComponent = {
  import: DiscoverImport,
  rss3: DiscoverRSS3,
  user: DiscoverUser,
}
