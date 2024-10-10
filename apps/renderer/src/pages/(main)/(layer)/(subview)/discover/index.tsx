import { createElement } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { DiscoverForm } from "~/modules/discover/form"
import { DiscoverImport } from "~/modules/discover/import"
import { DiscoverInboxList } from "~/modules/discover/inbox-list-form"
import { Recommendations } from "~/modules/discover/recommendations"
import { DiscoverRSS3 } from "~/modules/discover/rss3-form"
import { DiscoverUser } from "~/modules/discover/user-form"
import { Trend } from "~/modules/trending"

import { useSubViewTitle } from "../hooks"

const tabs: {
  name: I18nKeys
  value: string
  disabled?: boolean
}[] = [
  {
    name: "words.search",
    value: "search",
  },
  {
    name: "words.rss",
    value: "rss",
  },
  {
    name: "words.rsshub",
    value: "rsshub",
  },
  {
    name: "words.inbox",
    value: "inbox",
  },
  {
    name: "words.rss3",
    value: "rss3",
  },
  {
    name: "words.user",
    value: "user",
  },
  {
    name: "words.import",
    value: "import",
  },
]

export function Component() {
  const [search, setSearch] = useSearchParams()
  const { t } = useTranslation()
  useSubViewTitle("words.discover")

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
        <TabsList className="relative w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.value} disabled={tab.disabled}>
              {t(tab.name)}
            </TabsTrigger>
          ))}

          <Trend className="relative bottom-0 left-1.5" />
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.name} value={tab.value} className="mt-8">
            {createElement(TabComponent[tab.value] || TabComponent.default, {
              type: tab.value,
            })}
          </TabsContent>
        ))}
      </Tabs>
      <Recommendations />
    </>
  )
}

const TabComponent: Record<string, React.FC<{ type?: string }>> = {
  import: DiscoverImport,
  rss3: DiscoverRSS3,
  inbox: DiscoverInboxList,
  user: DiscoverUser,
  default: DiscoverForm,
}
