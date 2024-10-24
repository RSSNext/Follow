import { Tabs, TabsContent, TabsList, TabsTrigger } from "@follow/components/ui/tabs/index.jsx"
import { UserRole } from "@follow/constants"
import { cn } from "@follow/utils/utils"
import { createElement } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

import { useUserRole } from "~/atoms/user"
import { useActivationModal } from "~/modules/activation"
import { DiscoverForm } from "~/modules/discover/form"
import { DiscoverImport } from "~/modules/discover/import"
import { DiscoverInboxList } from "~/modules/discover/inbox-list-form"
import { Recommendations } from "~/modules/discover/recommendations"
import { DiscoverRSS3 } from "~/modules/discover/rss3-form"
import { DiscoverTransform } from "~/modules/discover/transform-form"
import { DiscoverUser } from "~/modules/discover/user-form"
import { Trend } from "~/modules/trending"

import { useSubViewTitle } from "../hooks"

const tabs: {
  name: I18nKeys
  value: string
  disableForTrial?: boolean
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
    disableForTrial: true,
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
    name: "words.transform",
    value: "transform",
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

  const presentActivationModal = useActivationModal()
  const role = useUserRole()

  const currentTabs = tabs.map((tab) => {
    const disabled = tab.disableForTrial && role === UserRole.Trial
    return {
      ...tab,
      disabled,
    }
  })

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="pt-12 text-2xl font-bold">{t("words.discover")}</div>
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
          {currentTabs.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.value}
              className={cn(tab.disabled && "cursor-not-allowed opacity-50")}
              onClick={() => {
                if (tab.disabled) {
                  presentActivationModal()
                }
              }}
            >
              {t(tab.name)}
            </TabsTrigger>
          ))}

          <Trend className="relative bottom-0 left-1.5 mr-3.5 w-6" />
        </TabsList>
        {currentTabs.map((tab) => (
          <TabsContent key={tab.name} value={tab.value} className="mt-8">
            <div className={tab.value === "inbox" ? "" : "center flex flex-col"}>
              {createElement(TabComponent[tab.value] || TabComponent.default, {
                type: tab.value,
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <Recommendations />
    </div>
  )
}

const TabComponent: Record<string, React.FC<{ type?: string }>> = {
  import: DiscoverImport,
  rss3: DiscoverRSS3,
  inbox: DiscoverInboxList,
  user: DiscoverUser,
  default: DiscoverForm,
  transform: DiscoverTransform,
}
